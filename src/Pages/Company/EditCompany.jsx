import { Edit, ElevatorSharp } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Grid,
  Stack,
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
  orderBy,
  limitToLast,
  endBefore,
  startAfter,
  limit,
  or,
  and,
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
  const [lastEmployee, setLastEmployee] = React.useState(null);
  const [firstEmployee, setFirstEmployee] = React.useState(null);
  const [managers, setManagers] = React.useState([]);
  const [lastManager, setLastManager] = React.useState(null);
  const [firstManager, setFirstManager] = React.useState(null);
  const [currentUserID, setCurrentUserID] = React.useState("");
  const [jobs, setJobs] = React.useState([]);
  const [lastJob, setLastJob] = React.useState(null);
  const [firstJob, setFirstJob] = React.useState(null);
  const [mouseOver, setMouseOver] = React.useState(false);
  const [mouseOut, setMouseOut] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [favoriteCompaniesID, setFavoriteCompaniesID] = React.useState([]);
  const [userEmail, setUserEmail] = React.useState(null);

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

  async function getEmployees(employeesQuery) {
    const startTime = Date.now();
    const employeesSnapshot = await getDocs(employeesQuery);
    const endTime = Date.now();
    console.log("employees query time: ", endTime - startTime);

    const temp = [];
    // if none document returned, skip
    if (employeesSnapshot.docs.length < 1) {
      return;
    }

    setFirstEmployee(employeesSnapshot.docs[0]);
    setLastEmployee(employeesSnapshot.docs[employeesSnapshot.docs.length - 1]);

    employeesSnapshot.docs.forEach((document) => {
      temp.push({ ...document.data(), ID: document.id });
    });
    setEmployees(temp);
  }
  async function getManagers(managersQuery) {
    const startTime = Date.now();
    const managersSnapshot = await getDocs(managersQuery);
    const endTime = Date.now();
    console.log("managers query time: ", endTime - startTime);

    const temp = [];
    // if none document returned, skip
    if (managersSnapshot.docs.length < 1) {
      return;
    }

    setFirstManager(managersSnapshot.docs[0]);
    setLastManager(managersSnapshot.docs[managersSnapshot.docs.length - 1]);

    managersSnapshot.docs.forEach((document) => {
      temp.push({ ...document.data(), ID: document.id });
    });
    setManagers(temp);
  }

  async function getJobs(jobsQuery) {
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
    // const jQuery = query(
    //   collection(db, "jobs2"),
    //   where("companyID", "==", companyID)
    // );
    // const startTime = Date.now();
    // const jSnapshot = await getDocs(jQuery);
    // const endTime = Date.now();
    // console.log("jobs query time: ", endTime - startTime);

    // const temp = [];
    // jSnapshot.docs.forEach((document) => {
    //   temp.push({ ...document.data(), documentID: document.id });
    // });

    // // Sort the list of jobs based on the publishedAt, newest first
    // temp.sort((a, b) => {
    //   if (a.publishedAt.seconds === b.publishedAt.seconds) {
    //     return a.publishedAt.nanoseconds > b.publishedAt.nanoseconds ? -1 : 1;
    //   }
    //   return a.publishedAt.seconds > b.publishedAt.seconds ? -1 : 1;
    // });
    const startTime = Date.now();
    const jobsSnapshot = await getDocs(jobsQuery);
    const endTime = Date.now();
    console.log("jobs query time: ", endTime - startTime);

    // if none document returned, skip
    if (jobsSnapshot.docs.length < 1) {
      return;
    }

    setLastJob(jobsSnapshot.docs[0]);
    setFirstJob(jobsSnapshot.docs[jobsSnapshot.docs.length - 1]);

    const temp = [];
    jobsSnapshot.docs.forEach((document) => {
      temp.push({ ...document.data(), documentID: document.id });
    });
    temp.reverse();
    setJobs(temp);
  }

  // Job  Query
  const initialJobsQuery = query(
    collection(db, "jobs2"),
    where("companyID", "==", companyID),
    orderBy("publishedAt"),
    limitToLast(jobsPerPage)
  );
  const nextJobsQuery = query(
    collection(db, "jobs2"),
    where("companyID", "==", companyID),
    orderBy("publishedAt"),
    endBefore(lastJob),
    limitToLast(jobsPerPage)
  );
  const previousJobsQuery = query(
    collection(db, "jobs2"),
    where("companyID", "==", companyID),
    orderBy("publishedAt"),
    startAfter(firstJob),
    limit(jobsPerPage)
  );

  // Employee Query
  const initialEmployeesQuery = query(
    collection(db, "recruiters2"),
    where("workFor", "==", companyID),
    where("isManager", "==", false),
    orderBy("lastName"),
    limit(employeesPerPage)
  );
  const nextEmployeesQuery = query(
    collection(db, "recruiters2"),
    where("workFor", "==", companyID),
    where("isManager", "==", false),
    orderBy("lastName"),
    startAfter(lastEmployee),
    limit(employeesPerPage)
  );
  const previousEmployeesQuery = query(
    collection(db, "recruiters2"),
    where("workFor", "==", companyID),
    where("isManager", "==", false),
    orderBy("lastName"),
    endBefore(firstEmployee),
    limitToLast(employeesPerPage)
  );

  // Manager Query
  const initialManagersQuery = query(
    collection(db, "recruiters2"),
    where("workFor", "==", companyID),
    where("isManager", "==", true),
    orderBy("lastName"),
    limit(managersPerPage)
  );
  const nextManagersQuery = query(
    collection(db, "recruiters2"),
    where("workFor", "==", companyID),
    where("isManager", "==", true),
    orderBy("lastName"),
    startAfter(lastManager),
    limit(managersPerPage)
  );
  const previousManagersQuery = query(
    collection(db, "recruiters2"),
    where("workFor", "==", companyID),
    where("isManager", "==", true),
    orderBy("lastName"),
    endBefore(firstManager),
    limitToLast(managersPerPage)
  );

  async function getPermissions() {
    if (currentUserID) {
      const selfRecruiterSnapshot = await getDoc(
        doc(db, "recruiters2", currentUserID)
      );
      console.log("passed");
      if (selfRecruiterSnapshot.data().isManager) {
        setIsAdmin(true);
        setIsNewJobAllowed(true);
      } else if (selfRecruiterSnapshot.data().workFor !== companyID) {
        setIsAdmin(false);
        setIsNewJobAllowed(false);
      } else {
        const managersSnapshot = await getDocs(
          query(
            collection(db, "recruiters2"),
            where("workFor", "==", companyID),
            where("isManager", "==", true),
            limit(1)
          )
        );
        if (managersSnapshot.empty) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setIsNewJobAllowed(true);
      }
    } else {
      setIsAdmin(false);
      setIsNewJobAllowed(false);
    }
  }

  async function removeRecruiter(recruiterID) {
    await updateDoc(doc(db, "recruiters2", recruiterID), { workFor: null });
    setEmployees([]);
    setManagers([]);
    getEmployees(initialEmployeesQuery);
    getManagers(initialManagersQuery);
    getPermissions();
    toggleNavbarUpdate();
  }

  async function promoteToManager(recruiterID) {
    await updateDoc(doc(db, "recruiters2", recruiterID), { isManager: true });
    setEmployees([]);
    setManagers([]);
    getEmployees(initialEmployeesQuery);
    getManagers(initialManagersQuery);
    getPermissions();
  }

  async function demoteManager(recruiterID) {
    await updateDoc(doc(db, "recruiters2", recruiterID), { isManager: false });
    setEmployees([]);
    setManagers([]);
    getEmployees(initialEmployeesQuery);
    getManagers(initialManagersQuery);
    getPermissions();
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged invoked");
      if (user) {
        setCurrentUserID(user.uid);
        setUserEmail(user.email);
      } else {
        setCurrentUserID(null);
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    getCompanyInformation();
    getJobs(initialJobsQuery);
    getEmployees(initialEmployeesQuery);
    getManagers(initialManagersQuery);
  }, [companyID]);

  React.useEffect(() => {
    console.log("jobs ", jobs);
  }, [jobs]);
  React.useEffect(() => {
    console.log("employees ", employees);
  }, [employees]);
  React.useEffect(() => {
    console.log("managers ", managers);
  }, [managers]);

  React.useEffect(() => {
    // if a company has manager, then only the manager is allowed to edit company
    // if a copmany does not have manager, but has recruiter, then only recruiter is allowed to edit company
    getPermissions();
  }, [currentUserID]);

  React.useEffect(() => {
    async function getFavoriteCompaniesID() {
      if (userEmail !== null) {
        const notificationsDocRef = doc(db, "notifications", userEmail);
        // Get notifications data and set it to local array
        const notificationsSnapShot = await getDoc(notificationsDocRef);
        if (notificationsSnapShot.exists()) {
          console.log("Notifications for user Exist");
          if (notificationsSnapShot.data().favCompanies) {
            setFavoriteCompaniesID(notificationsSnapShot.data().favCompanies);
          } else {
            setFavoriteCompaniesID([]);
          }
        } else {
          console.log("Notifications for user does not Exist");
        }
      }
    }
    console.log("get fav companies");
    getFavoriteCompaniesID();
  }, [userEmail]);

  React.useEffect(() => {
    try {
      if (userEmail) {
        const notificationsDocRef = doc(db, "notifications", userEmail);
        updateDoc(notificationsDocRef, { favCompanies: favoriteCompaniesID });
      }
    } catch (err) {
      console.log(err);
    }
  }, [favoriteCompaniesID]);

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
          favoriteCompaniesID={favoriteCompaniesID}
          setFavoriteCompaniesID={setFavoriteCompaniesID}
        />
      ))}
      <Box sx={{ px: "5%" }}>
        <Button
          id="Button-Previous-Job"
          data-cy="Button-Previous-Job"
          onClick={() => getJobs(previousJobsQuery)}
        >
          <Typography variant="h6">Previous</Typography>
        </Button>
        <Button
          id="Button-Next-Job"
          data-cy="Button-Next-Job"
          onClick={() => getJobs(nextJobsQuery)}
        >
          <Typography variant="h6">Next</Typography>
        </Button>
      </Box>

      <Typography variant="h3" sx={{ padding: "5%", alignItems: "center" }}>
        Recruiters List
      </Typography>
      <Grid
        container
        sx={{ px: "5%" }}
        spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      >
        {employees.map((employee) => (
          <Grid
            item
            key={`recruiterCard-${employee.ID}`}
            xs={12}
            sm={12}
            md={6}
            lg={6}
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
                  <Button>
                    <Typography variant="h6">View Profile </Typography>
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <>
                  <Button
                    onClick={() => {
                      removeRecruiter(employee.ID);
                    }}
                  >
                    <Typography variant="h6">Remove</Typography>
                  </Button>
                  <Button
                    onClick={() => {
                      promoteToManager(employee.ID);
                    }}
                  >
                    <Typography variant="h6">Promote</Typography>
                  </Button>
                </>
              )}
            </EmployeeCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ px: "5%" }}>
        <Button
          id="Button-Previous-Employee"
          data-cy="Button-Previous-Employee"
          onClick={() => getEmployees(previousEmployeesQuery)}
        >
          <Typography variant="h6">Previous</Typography>
        </Button>
        <Button
          id="Button-Next-Employee"
          data-cy="Button-Next-Employee"
          onClick={() => getEmployees(nextEmployeesQuery)}
        >
          <Typography variant="h6">Next</Typography>
        </Button>
      </Box>
      <Typography variant="h2" sx={{ padding: "5%", alignItems: "center" }}>
        Manager List
      </Typography>
      <Grid
        container
        sx={{ px: "5%", height: "100%" }}
        spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      >
        {managers.map((employee) => (
          <Grid
            item
            key={`managerCard-${employee.ID}`}
            xs={12}
            sm={12}
            md={6}
            lg={6}
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
                  <Button>
                    <Typography variant="h6">View Profile</Typography>
                  </Button>
                </Link>
              )}
              {isAdmin && (
                <Button
                  onClick={() => {
                    demoteManager(employee.ID);
                  }}
                >
                  <Typography variant="h6">Demote</Typography>
                </Button>
              )}
            </EmployeeCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ px: "5%" }}>
        <Button
          id="Button-Previous-Manager"
          data-cy="Button-Previous-Manager"
          onClick={() => getManagers(previousManagersQuery)}
        >
          <Typography variant="h6">Previous</Typography>
        </Button>
        <Button
          id="Button-Next-Manager"
          data-cy="Button-Next-Manager"
          onClick={() => getManagers(nextManagersQuery)}
        >
          <Typography variant="h6">Next</Typography>
        </Button>
      </Box>
    </>
  );
};
export default EditCompany;

EditCompany.propTypes = {
  toggleNavbarUpdate: PropTypes.func,
};
