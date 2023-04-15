import { Edit, ElevatorSharp } from "@mui/icons-material";
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
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import PropTypes from "prop-types";
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import EmployeeCard from "../../Components/EmployeeCard/EmployeeCard";
import JobCard from "../../Components/Jobs/JobCard";
import { auth, db, storage } from "../../Firebase/firebase";

export const EditCompany = ({ toggleNavbarUpdate }) => {
  const { companyID } = useParams();
  const [companyInformation, setCompanyInformation] = React.useState({
    name: "",
    logoPath: "", // new state for the uploaded logo file
  });
  const [isNewJobAllowed, setIsNewJobAllowed] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [employees, setEmployees] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [currentUserID, setCurrentUserID] = React.useState("");
  const [jobCursorPosition, setJobCursorPosition] = React.useState(0);
  const [employeeCursorPosition, setEmployeeCursorPosition] = React.useState(0);
  const [managerCursorPosition, setManagerCursorPosition] = React.useState(0);
  const [jobs, setJobs] = React.useState([]);
  const [displayedJobs, setDisplayedJobs] = React.useState([]);
  const [displayedEmployees, setDisplayedEmployees] = React.useState([]);
  const [displayedManagers, setDisplayedManagers] = React.useState([]);
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
  const employeesPerPage = 4;
  const managersPerPage = 4;

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

  async function getEmployeesAndManagers() {
    const recruitersRef = collection(db, "recruiters2");
    const recruitersQuery = query(
      recruitersRef,
      where("workFor", "==", companyID)
    );
    const startTime = Date.now();
    const querySnapshot = await getDocs(recruitersQuery);
    console.log("recruiter query time: ", Date.now() - startTime);
    const employeesList = [];
    const managersList = [];
    querySnapshot.forEach((document) => {
      if (document.data().isManager) {
        managersList.push({
          ID: document.id,
          firstName: document.data().firstName,
          lastName: document.data().lastName,
          email: document.data().email,
          isManager: document.data().isManager,
        });
      } else {
        employeesList.push({
          ID: document.id,
          firstName: document.data().firstName,
          lastName: document.data().lastName,
          email: document.data().email,
          isManager: false,
        });
      }
    });
    setManagers(managersList);
    setEmployees(employeesList);
  }

  async function removeRecruiter(recruiterID) {
    await updateDoc(doc(db, "recruiters2", recruiterID), { workFor: null });
    getEmployeesAndManagers();
    toggleNavbarUpdate();
  }

  async function promoteToManager(recruiterID) {
    await updateDoc(doc(db, "recruiters2", recruiterID), { isManager: true });
    getEmployeesAndManagers();
  }

  async function demoteManager(recruiterID) {
    await updateDoc(doc(db, "recruiters2", recruiterID), { isManager: false });
    getEmployeesAndManagers();
  }

  async function getJobs() {
    // timelapse below means there is no need to store job id in company

    // timelapse : 306
    // const jobsQuery = query(
    //   collection(db, "jobs2"),
    //   where(documentId(), "in", tempJobIDList)
    // );
    // let startTime = Date.now();
    // const jobsSnapshot = await getDocs(jobsQuery);
    // let endTime = Date.now();
    // console.log("first method ", endTime - startTime);
    // console.log(jobsSnapshot.docs);

    // timelapse : 179
    // startTime = Date.now();
    // const tempPromise = [];
    // const temp = [];
    // tempJobIDList.forEach(async (jobID) => {
    //   tempPromise.push(getDoc(doc(db, "jobs2", jobID)));
    // });
    // await Promise.all(tempPromise).then((values) => {
    //   console.log(values);
    // });
    // endTime = Date.now();
    // console.log("second method ", endTime - startTime);

    // timelapse : 97
    const jQuery = query(
      collection(db, "jobs2"),
      where("companyID", "==", companyID)
    );
    const startTime = Date.now();
    const jSnapshot = await getDocs(jQuery);
    const endTime = Date.now();
    console.log("jobs query time: ", endTime - startTime);

    const temp = [];
    jSnapshot.docs.forEach((document) => {
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

  function setCursorToNextPosition(
    cursor,
    setCursor,
    listOfObject,
    numPerPage
  ) {
    const nextPosition = cursor + numPerPage;
    if (nextPosition >= listOfObject.length) {
      return;
    }
    setCursor(nextPosition);
  }

  function setCursorToPreviousPosition(cursor, setCursor, numPerPage) {
    let previousPosition = cursor - numPerPage;
    if (previousPosition < 0) {
      previousPosition = 0;
    }
    setCursor(previousPosition);
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged invoked");
      if (user) {
        setCurrentUserID(user.uid);
      } else {
        setCurrentUserID(null);
      }
    });
  }, []);

  React.useEffect(() => {
    getCompanyInformation();
    getJobs();
    getEmployeesAndManagers();
  }, [companyID]);

  React.useEffect(() => {
    // if a company has manager, then only the manager is allowed to edit company
    // if a copmany does not have manager, but has recruiter, then only recruiter is allowed to edit company
    let hasManager = false;
    if (managers && managers.length > 0) {
      hasManager = true;
      if (managers.filter((item) => item.ID === currentUserID).length > 0) {
        setIsNewJobAllowed(true);
        setIsAdmin(true);
        return;
      }
    }
    if (employees && employees.length > 0) {
      if (employees.filter((item) => item.ID === currentUserID).length > 0) {
        setIsNewJobAllowed(true);
        setIsAdmin(!hasManager);
        return;
      }
    }
    setIsNewJobAllowed(false);
    setIsAdmin(false);
  }, [managers, employees]);

  React.useEffect(() => {
    if (jobCursorPosition < jobs.length) {
      setDisplayedJobs(
        jobs.slice(jobCursorPosition, jobsPerPage + jobCursorPosition)
      );
    }
  }, [jobs, jobCursorPosition]);

  React.useEffect(() => {
    if (employeeCursorPosition < employees.length) {
      setDisplayedEmployees(
        employees.slice(
          employeeCursorPosition,
          employeesPerPage + employeeCursorPosition
        )
      );
    }
  }, [employees, employeeCursorPosition]);

  React.useEffect(() => {
    if (managerCursorPosition < managers.length) {
      setDisplayedManagers(
        managers.slice(
          managerCursorPosition,
          managersPerPage + managerCursorPosition
        )
      );
    }
  }, [managers, managerCursorPosition]);

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
              id="TextField-CompanyName"
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
              data-cy="Textfield-CompanyName"
              disabled={!editMode}
              InputProps={{
                style: { fontSize: 30 },
                endAdornment: !editMode ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClick}
                      data-cy="Button-Edit-CompanyName"
                    >
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
            id="Button-Save"
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
              data-cy="Button-NewJob"
              sx={{ height: "50px" }}
            >
              New Job
            </Button>
          </Link>
        )}
      </Box>

      {displayedJobs.map((job) => (
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
          id="Button-Previous-Job"
          data-cy="Button-Previous-Job"
          onClick={() =>
            setCursorToPreviousPosition(
              jobCursorPosition,
              setJobCursorPosition,
              jobsPerPage
            )
          }
        >
          Previous
        </Button>
        <Button
          id="Button-Next-Job"
          data-cy="Button-Next-Job"
          onClick={() =>
            setCursorToNextPosition(
              jobCursorPosition,
              setJobCursorPosition,
              jobs,
              jobsPerPage
            )
          }
        >
          Next
        </Button>
      </Box>

      <Typography variant="h3" sx={{ padding: "5%", alignItems: "center" }}>
        Recruiters List
      </Typography>
      {displayedEmployees.map((employee) => (
        <Box
          key={`recruiterCard-${employee.ID}`}
          sx={{ justifyContent: "center", paddingLeft: "5%" }}
        >
          <EmployeeCard
            employeeId={employee.ID}
            employeeFirstName={employee.firstName}
            employeeLastName={employee.lastName}
            employeeImage={employee.description}
          >
            {employee.email && (
              <Link
                to={`/editProfile/${employee.firstName}${employee.lastName}`}
                state={{ userID: currentUserID }}
              >
                <Button>View Profile</Button>
              </Link>
            )}
            {isAdmin && (
              <>
                <Button
                  onClick={() => {
                    removeRecruiter(employee.ID);
                  }}
                >
                  Remove
                </Button>
                <Button
                  onClick={() => {
                    promoteToManager(employee.ID);
                  }}
                >
                  Promote
                </Button>
              </>
            )}
          </EmployeeCard>
        </Box>
      ))}

      <Box sx={{ px: "5%" }}>
        <Button
          id="Button-Previous-Employee"
          data-cy="Button-Previous-Employee"
          onClick={() =>
            setCursorToPreviousPosition(
              employeeCursorPosition,
              setEmployeeCursorPosition,
              employeesPerPage
            )
          }
        >
          Previous
        </Button>
        <Button
          id="Button-Next-Employee"
          data-cy="Button-Next-Employee"
          onClick={() =>
            setCursorToNextPosition(
              employeeCursorPosition,
              setEmployeeCursorPosition,
              employees,
              employeesPerPage
            )
          }
        >
          Next
        </Button>
      </Box>
      <Typography variant="h2" sx={{ padding: "5%", alignItems: "center" }}>
        Manager List
      </Typography>
      {displayedManagers.map((employee) => (
        <Box
          key={`managerCard-${employee.ID}`}
          sx={{ justifyContent: "center", paddingLeft: "5%" }}
        >
          <EmployeeCard
            employeeId={employee.ID}
            employeeFirstName={employee.firstName}
            employeeLastName={employee.lastName}
          >
            {employee.email && (
              <Link
                to={`/editProfile/${employee.firstName}${employee.lastName}`}
                state={{ userID: currentUserID }}
              >
                <Button>View Profile</Button>
              </Link>
            )}
            {isAdmin && (
              <Button
                onClick={() => {
                  demoteManager(employee.ID);
                }}
              >
                Demote
              </Button>
            )}
          </EmployeeCard>
        </Box>
      ))}

      <Box sx={{ px: "5%" }}>
        <Button
          id="Button-Previous-Manager"
          data-cy="Button-Previous-Manager"
          onClick={() =>
            setCursorToPreviousPosition(
              managerCursorPosition,
              setManagerCursorPosition,
              managersPerPage
            )
          }
        >
          Previous
        </Button>
        <Button
          id="Button-Next-Manager"
          data-cy="Button-Next-Manager"
          onClick={() =>
            setCursorToNextPosition(
              managerCursorPosition,
              setManagerCursorPosition,
              managers,
              managersPerPage
            )
          }
        >
          Next
        </Button>
      </Box>
    </>
  );
};
export default EditCompany;

EditCompany.propTypes = {
  toggleNavbarUpdate: PropTypes.func,
};
