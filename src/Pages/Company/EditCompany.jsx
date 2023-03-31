import {
  Grid,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Card,
  Box,
  Button,
  Container,
  Stack,
} from "@mui/material";
import * as React from "react";
import {
  doc,
  collection,
  getDoc,
  updateDoc,
  query,
  documentId,
  where,
  getDocs,
  writeBatch,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../Firebase/firebase";
import JobCard from "../../Components/Jobs/JobCard";

export const EditCompany = () => {
  const { companyID } = useParams();
  const [companyInformation, setCompanyInformation] = React.useState({
    name: "",
    logoPath: "", // new state for the uploaded logo file
    jobs: [],
    employees: [],
    managers: [],
  });
  const [isAllowed, setIsAllowed] = React.useState(false);
  const [employeesInformation, setEmployeesInformation] = React.useState([]);
  const [managersInformation, setManagersInformation] = React.useState([]);
  const [currentUserID, setCurrentUserID] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [jobs, setJobs] = React.useState([]);

  const jobsPerPage = 4;

  async function getCompanyInformation() {
    const companyRef = doc(db, "companies", companyID);
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
    const companyRef = doc(db, "companies", companyID);
    await updateDoc(companyRef, companyInformation);
  }

  async function getEmployees() {
    if (companyInformation.employees.length > 0) {
      const recruitersRef = collection(db, "recruiters");
      const employeesQuery = query(
        recruitersRef,
        where(documentId(), "in", companyInformation.employees)
      );
      const querySnapshot = await getDocs(employeesQuery);
      const temp = [];
      querySnapshot.forEach((document) => {
        temp.push({
          ID: document.id,
          firstName: document.data().firstName,
          lastName: document.data().lastName,
        });
      });
      setEmployeesInformation(temp);
    } else {
      setEmployeesInformation([]);
    }
  }

  async function getManagers() {
    if (companyInformation.managers.length > 0) {
      const recruitersRef = collection(db, "recruiters");
      const employeesQuery = query(
        recruitersRef,
        where(documentId(), "in", companyInformation.managers)
      );
      const querySnapshot = await getDocs(employeesQuery);
      const temp = [];
      querySnapshot.forEach((document) => {
        temp.push({
          ID: document.id,
          firstName: document.data().firstName,
          lastName: document.data().lastName,
        });
      });
      setManagersInformation(temp);
    } else {
      setManagersInformation([]);
    }
  }

  async function removeEmployee(employeeID) {
    const batch = writeBatch(db);
    batch.update(doc(db, "companies", companyID), {
      employees: arrayRemove(employeeID),
    });
    batch.update(doc(db, "recruiters", employeeID), { workFor: null });
    await batch.commit();
    const employees = [...companyInformation.employees];
    employees.splice(employees.indexOf(employeeID), 1);
    setCompanyInformation({
      ...companyInformation,
      employees,
    });
  }

  async function promoteToManager(employeeID) {
    const batch = writeBatch(db);
    batch.update(doc(db, "companies", companyID), {
      employees: arrayRemove(employeeID),
    });
    batch.update(doc(db, "companies", companyID), {
      managers: arrayUnion(employeeID),
    });
    await batch.commit();
    const employees = [...companyInformation.employees];
    employees.splice(employees.indexOf(employeeID), 1);
    let managers;
    if (companyInformation.managers) {
      managers = [...companyInformation.managers, employeeID];
    } else {
      managers = [employeeID];
    }
    setCompanyInformation({
      ...companyInformation,
      employees,
      managers,
    });
  }

  async function demoteManager(employeeID) {
    const batch = writeBatch(db);
    batch.update(doc(db, "companies", companyID), {
      managers: arrayRemove(employeeID),
    });
    batch.update(doc(db, "companies", companyID), {
      employees: arrayUnion(employeeID),
    });
    await batch.commit();
    const managers = [...companyInformation.managers];
    managers.splice(managers.indexOf(employeeID), 1);
    let employees;
    if (companyInformation.employees) {
      employees = [...companyInformation.employees, employeeID];
    } else {
      employees = [employeeID];
    }
    setCompanyInformation({
      ...companyInformation,
      employees,
      managers,
    });
  }

  // Using the list of jobsID & the cursor position
  // determine 5 jobID
  // Then query jobs whose ID within the 5 jobID
  async function getJobs() {
    if (cursorPosition >= companyInformation.jobs.length) {
      return;
    }
    const tempJobIDList = [];
    for (let i = cursorPosition; i < cursorPosition + jobsPerPage; i += 1) {
      if (i >= companyInformation.jobs.length) {
        break;
      }
      tempJobIDList.push(companyInformation.jobs[i].jobID);
    }

    const jobsQuery = query(
      collection(db, "jobs"),
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
        return a.publishedAt.nanoseconds > b.publishedAt.nanoseconds ? 1 : -1;
      }
      return a.publishedAt.seconds > b.publishedAt ? 1 : -1;
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
    // if a copmany does not have manager, but has employee, then only employee is allowed to edit company
    // if a company does not have manager nor employee, then everyone is allowed to edit company
    if (companyInformation.managers && companyInformation.managers.length > 0) {
      if (companyInformation.managers.includes(currentUserID)) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } else if (
      companyInformation.employees &&
      companyInformation.employees.length > 0
    ) {
      if (companyInformation.employees.includes(currentUserID)) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } else {
      setIsAllowed(true);
    }
  }, [companyInformation, currentUserID]);

  React.useEffect(() => {
    if (companyInformation.employees) {
      getEmployees();
    }
    if (companyInformation.managers) {
      getManagers();
    }
  }, [companyInformation]);

  React.useEffect(() => {
    getJobs();
  }, [companyInformation, cursorPosition]);

  React.useEffect(() => {
    console.log(employeesInformation);
  }, [employeesInformation]);

  return (
    <>
      {isAllowed ? (
        <>
          <Typography variant="h4" sx={{ pb: 2 }}>
            Edit Company
          </Typography>
          <Typography>Company Name</Typography>
          <TextField
            required
            id="TextField-Name"
            variant="standard"
            placeholder="Job Title"
            fullWidth
            value={companyInformation.name}
            onChange={(e) =>
              setCompanyInformation({
                ...companyInformation,
                name: e.target.value,
              })
            }
          />

          <Button
            onClick={() => {
              saveCompanyInformation();
            }}
            data-cy="saveBtn"
            variant="contained"
            size="medium"
            sx={{ my: 1 }}
            id="ButtonSave"
          >
            Save
          </Button>

          <Typography>Company Logo</Typography>
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

          <Typography>Job List</Typography>
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
              editable
            />
          ))}
          <Button
            id="Button-Previous"
            onClick={() => setCursorToPreviousPosition()}
          >
            Previous
          </Button>
          <Button id="Button-Next" onClick={() => setCursorToNextPosition()}>
            Next
          </Button>

          <Typography>Employee List</Typography>
          {employeesInformation.map((employee) => (
            <div key={`employeeCard-${employee.ID}`}>
              <Typography>{employee.ID}</Typography>
              <Typography>{employee.firstName}</Typography>
              <Typography>{employee.lastName}</Typography>
              <Button
                onClick={() => {
                  removeEmployee(employee.ID);
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
            </div>
          ))}
          <Typography>Manager List</Typography>
          {managersInformation.map((manager) => (
            <div key={`managerCard-${manager.ID}`}>
              <Typography>{manager.ID}</Typography>
              <Typography>{manager.firstName}</Typography>
              <Typography>{manager.lastName}</Typography>
              <Button
                onClick={() => {
                  demoteManager(manager.ID);
                }}
              >
                Demote
              </Button>
            </div>
          ))}
        </>
      ) : (
        <>Not Allowed</>
      )}
      <p> </p>
    </>
  );
};
export default EditCompany;
