import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import PropTypes from "prop-types";
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import EmployeeCard from "../../Components/EmployeeCard/EmployeeCard";
import JobCard from "../../Components/Jobs/JobCard";
import { auth, db, storage } from "../../Firebase/firebase";

// eslint-disable-next-line react/prop-types
export const EditCompany = ({ props }) => {
  const { companyID } = useParams();
  const [companyInformation, setCompanyInformation] = React.useState({
    name: "",
    logoPath: "", // new state for the uploaded logo file
    jobs: [],
    recruiters: [],
    managers: [],
  });
  const [isNewJobAllowed, setIsnewJobAllowed] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [recruitersInformation, setRecruitersInformation] = React.useState([]);
  const [managersInformation, setManagersInformation] = React.useState([]);
  const [currentUserID, setCurrentUserID] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [jobs, setJobs] = React.useState([]);
  const [mouseOver, setMouseOver] = React.useState(false);
  const [mouseOut, setMouseOut] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  const handleMouseOver = (event) => {
    setMouseOut(true);
    console.log("mouse out");
  };

  const handleMouseOut = (event) => {
    setMouseOver(false);
    setEditMode(false);
  };

  const handleClick = () => {
    setEditMode(true);
    setMouseOver(false);
  };

  const jobsPerPage = 4;

  const styles = {
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      width: 300,
      margin: 100,
    },
    //style for font size
    resize: {
      fontSize: 50,
    },
  };

  async function getCompanyInformation() {
    const companyRef = doc(db, "companies2", companyID);
    const companySnapshot = await getDoc(companyRef);
    if (companySnapshot.exists()) {
      setCompanyInformation(companySnapshot.data());
    }
  }

  async function uploadImage(image) {
    const imageName = `${companyID}-${Date.now()}`;
    const imageRef = ref(storage, `/company-logo/${imageName}`);
    await uploadBytes(imageRef, image);
    const downloadURL = await getDownloadURL(imageRef);
    setCompanyInformation({ ...companyInformation, logoPath: downloadURL });
  }

  async function saveCompanyInformation() {
    const companyRef = doc(db, "companies2", companyID);
    await updateDoc(companyRef, companyInformation);
  }

  async function getRecruiters() {
    if (companyInformation.recruiters.length > 0) {
      const recruitersRef = collection(db, "recruiters2");
      const recruitersQuery = query(
        recruitersRef,
        where(documentId(), "in", companyInformation.recruiters)
      );
      const querySnapshot = await getDocs(recruitersQuery);
      const temp = [];
      querySnapshot.forEach((document) => {
        temp.push({
          ID: document.id,
          firstName: document.data().firstName,
          lastName: document.data().lastName,
          email: document.data().email,
        });
      });
      setRecruitersInformation(temp);
    } else {
      setRecruitersInformation([]);
    }
  }

  async function getManagers() {
    if (companyInformation.managers.length > 0) {
      const recruitersRef = collection(db, "recruiters2");
      const recuitersQuery = query(
        recruitersRef,
        where(documentId(), "in", companyInformation.managers)
      );
      const querySnapshot = await getDocs(recuitersQuery);
      const temp = [];
      querySnapshot.forEach((document) => {
        temp.push({
          ID: document.id,
          firstName: document.data().firstName,
          lastName: document.data().lastName,
          email: document.data().email,
        });
      });
      setManagersInformation(temp);
    } else {
      setManagersInformation([]);
    }
  }

  async function removeRecruiter(recruiterID) {
    const batch = writeBatch(db);
    batch.update(doc(db, "companies2", companyID), {
      recruiters: arrayRemove(recruiterID),
    });
    batch.update(doc(db, "recruiters2", recruiterID), { workFor: null });
    await batch.commit();
    const recruiters = [...companyInformation.recruiters];
    recruiters.splice(recruiters.indexOf(recruiterID), 1);
    setCompanyInformation({
      ...companyInformation,
      recruiters,
    });
    if (recruiterID === currentUserID) {
      props.toggleNavbarUpdate();
    }
  }

  async function promoteToManager(recruiterID) {
    const batch = writeBatch(db);
    batch.update(doc(db, "companies2", companyID), {
      recruiters: arrayRemove(recruiterID),
    });
    batch.update(doc(db, "companies2", companyID), {
      managers: arrayUnion(recruiterID),
    });
    await batch.commit();
    const recruiters = [...companyInformation.recruiters];
    recruiters.splice(recruiters.indexOf(recruiterID), 1);
    let managers;
    if (companyInformation.managers) {
      managers = [...companyInformation.managers, recruiterID];
    } else {
      managers = [recruiterID];
    }
    setCompanyInformation({
      ...companyInformation,
      recruiters,
      managers,
    });
  }

  async function demoteManager(recruiterID) {
    const batch = writeBatch(db);
    batch.update(doc(db, "companies2", companyID), {
      managers: arrayRemove(recruiterID),
    });
    batch.update(doc(db, "companies2", companyID), {
      recruiters: arrayUnion(recruiterID),
    });
    await batch.commit();
    const managers = [...companyInformation.managers];
    managers.splice(managers.indexOf(recruiterID), 1);
    let recruiters;
    if (companyInformation.recruiters) {
      recruiters = [...companyInformation.recruiters, recruiterID];
    } else {
      recruiters = [recruiterID];
    }
    setCompanyInformation({
      ...companyInformation,
      recruiters,
      managers,
    });
  }

  // Using the list of jobsID & the cursor position
  // determine 5 jobID
  // Then query jobs whose ID within the 5 jobID
  async function getJobs() {
    if (companyInformation.jobs == null) {
      return;
    }
    if (cursorPosition >= companyInformation.jobs.length) {
      return;
    }
    const tempJobIDList = [];
    for (let i = cursorPosition; i < cursorPosition + jobsPerPage; i += 1) {
      if (i >= companyInformation.jobs.length) {
        break;
      }
      tempJobIDList.push(
        companyInformation.jobs[companyInformation.jobs.length - i - 1].jobID
      );
    }

    const jobsQuery = query(
      collection(db, "jobs2"),
      where(documentId(), "in", tempJobIDList)
    );

    const jobsSnapshot = await getDocs(jobsQuery);

    const temp = [];
    jobsSnapshot.docs.forEach((document) => {
      temp.push({ ...document.data(), documentID: document.id });
    });

    // Sort the list of jobs based on the publishedAt, newest first
    temp.sort((a, b) => {
      if (a.publishedAt.seconds === b.publishedAt.seconds) {
        return a.publishedAt.nanoseconds > b.publishedAt.nanoseconds ? -1 : 1;
      }
      return a.publishedAt.seconds > b.publishedAt.seconds ? -1 : 1;
    });
    setJobs(temp);
  }

  function setCursorToNextPosition() {
    const nextPosition = cursorPosition + jobsPerPage;
    if (nextPosition >= companyInformation.jobs.length) {
      return;
    }
    setCursorPosition(nextPosition);
  }
  function setCursorToPreviousPosition() {
    let previousPosition = cursorPosition - jobsPerPage;
    if (previousPosition < 0) {
      previousPosition = 0;
    }
    setCursorPosition(previousPosition);
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserID(user.uid);
      }
    });
  }, []);

  React.useEffect(() => {
    getCompanyInformation();
  }, []);

  React.useEffect(() => {
    // if a company has manager, then only the manager is allowed to edit company
    // if a copmany does not have manager, but has recruiter, then only recruiter is allowed to edit company
    let hasManager = false;
    if (companyInformation.managers && companyInformation.managers.length > 0) {
      hasManager = true;
      if (companyInformation.managers.includes(currentUserID)) {
        setIsnewJobAllowed(true);
        setIsAdmin(true);
        return;
      }
    }
    if (
      companyInformation.recruiters &&
      companyInformation.recruiters.length > 0
    ) {
      if (companyInformation.recruiters.includes(currentUserID)) {
        setIsnewJobAllowed(true);
        setIsAdmin(!hasManager);
        return;
      }
    }
    setIsnewJobAllowed(false);
    setIsAdmin(false);
  }, [companyInformation, currentUserID]);

  React.useEffect(() => {
    if (companyInformation.recruiters) {
      getRecruiters();
    }
    if (companyInformation.managers) {
      getManagers();
    }
  }, [companyInformation]);

  React.useEffect(() => {
    getJobs();
  }, [companyInformation, cursorPosition]);

  React.useEffect(() => {
    console.log(recruitersInformation);
  }, [recruitersInformation]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          fullWidth
          sx={{
            display: "flex",
            flexDirection: "row",
            minWidth: "500px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isAdmin ? (
            <TextField
              required
              id="TextField-Name"
              variant="standard"
              placeholder="Company name"
              label="Company Name"
              name="companyName"
              margin="normal"
              value={companyInformation.name}
              onChange={(e) =>
                setCompanyInformation({
                  ...companyInformation,
                  name: e.target.value,
                })
              }
              sx={{
                fontSize: "3em",
              }}
              disabled={!editMode}
              InputProps={{
                style: { fontSize: 30 },
                endAdornment: !editMode ? (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClick}>
                      <Edit />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  ""
                ),
              }}
            />
          ) : (
            <TextField
              id="TextField-Name"
              variant="standard"
              label="Company Name"
              disabled
              value={companyInformation.name}
              margin="normal"
              sx={{
                fontSize: "3em",
              }}
              InputProps={{
                style: { fontSize: 30 },
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "5%",
          }}
        >
          {isAdmin && (
            <>
              <Typography>Modify company logo</Typography>
              <IconButton>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files.length < 1) {
                      return;
                    }
                    uploadImage(e.target.files[0]);
                  }}
                />
              </IconButton>
            </>
          )}
        </Box>

        <Avatar
          alt="Upload Image"
          src={companyInformation.logoPath}
          sx={{
            width: 200,
            height: 200,
          }}
          style={{
            backgroundColor: "white",
            border: "solid",
            borderColor: "#263aaf",
            color: "#263aaf",
          }}
        />

        {isAdmin && (
          <Button
            onClick={() => {
              saveCompanyInformation();
              setEditMode(false);
            }}
            data-cy="saveBtn"
            variant="contained"
            size="medium"
            sx={{ my: 1 }}
            id="ButtonSave"
          >
            Save
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "5%",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" sx={{ marginRight: "2%" }}>
          Job List
        </Typography>
        {isNewJobAllowed && (
          <Link to="/createJob">
            <Button
              id="Button-NewJob"
              variant="contained"
              sx={{ height: "50px" }}
            >
              New Job
            </Button>
          </Link>
        )}
      </Box>

      {jobs.map((job) => (
        <JobCard
          key={`JobCard-${job.documentID}`}
          companyID={job.companyID}
          companyName={companyInformation.name}
          jobID={job.documentID}
          title={job.title}
          city={job.city}
          country={job.country}
          deadlineSeconds={job.deadline.seconds}
          deadlineNanoSeconds={job.deadline.nanoseconds}
          logo={companyInformation.logoPath}
          editable={isNewJobAllowed}
        />
      ))}
      <Box sx={{ px: "5%" }}>
        <Button
          id="Button-Previous"
          onClick={() => setCursorToPreviousPosition()}
        >
          Previous
        </Button>

        <Button id="Button-Next" onClick={() => setCursorToNextPosition()}>
          Next
        </Button>
      </Box>

      {/*<Typography>Promote recruiter to be a manager</Typography>
          <Typography>Demote a manager to be an recruiter</Typography>
          <Typography>Remove an recruiter</Typography>
          */}

      <Typography variant="h3" sx={{ padding: "5%", alignItems: "center" }}>
        Recruiters List
      </Typography>
      {recruitersInformation.map((recruiter) => (
        <Box
          key={`recruiterCard-${recruiter.ID}`}
          sx={{ justifyContent: "center", paddingLeft: "5%" }}
        >
          <EmployeeCard
            employeeId={recruiter.ID}
            employeeFirstName={recruiter.firstName}
            employeeLastName={recruiter.lastName}
            employeeImage={recruiter.description}
          >
            {recruiter.email && (
              <Link to={`/viewProfile/${recruiter.email}`}>
                <Button>View Profile</Button>
              </Link>
            )}
            {isAdmin && (
              <>
                <Button
                  onClick={() => {
                    removeRecruiter(recruiter.ID);
                  }}
                >
                  Remove
                </Button>
                <Button
                  onClick={() => {
                    promoteToManager(recruiter.ID);
                  }}
                >
                  Promote
                </Button>
              </>
            )}
          </EmployeeCard>
        </Box>
      ))}
      <Typography variant="h2" sx={{ padding: "5%", alignItems: "center" }}>
        Manager List
      </Typography>
      {managersInformation.map((manager) => (
        <Box
          key={`managerCard-${manager.ID}`}
          sx={{ justifyContent: "center", paddingLeft: "5%" }}
        >
          <EmployeeCard
            employeeId={manager.ID}
            employeeFirstName={manager.firstName}
            employeeLastName={manager.lastName}
          >
            {isAdmin && (
              <Button
                onClick={() => {
                  demoteManager(manager.ID);
                }}
              >
                Demote
              </Button>
            )}
          </EmployeeCard>
        </Box>
      ))}
    </>
  );
};
export default EditCompany;

EditCompany.propTypes = {
  toggleNavbarUpdate: PropTypes.func,
};
