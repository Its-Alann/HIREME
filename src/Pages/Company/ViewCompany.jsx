import * as React from "react";
import {
  doc,
  collection,
  getDoc,
  query,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";
import { Stack, Box, Button, Typography, Container } from "@mui/material";
import { useParams } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import JobCard from "../../Components/Jobs/JobCard";

export const ViewCompany = () => {
  const { companyID } = useParams();
  const [companyInformation, setCompanyInformation] = React.useState({
    name: "",
    logoPath: "", // new state for the uploaded logo file
    jobs: [],
  });
  const [employeesInformation, setEmployeesInformation] = React.useState([]);
  const [managersInformation, setManagersInformation] = React.useState([]);
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
    getCompanyInformation();
  }, []);

  React.useEffect(() => {
    console.log(companyInformation);
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

  return (
    <>
      <Typography variant="h4">{companyInformation.name}</Typography>
      <Box
        component="img"
        sx={{
          // objectFit: "cover",
          width: "6rem",
          height: "6rem",
          mr: 2,
        }}
        src={companyInformation.logoPath}
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
      {employeesInformation.map((employeeInformation) => (
        <div key={`employeeCard-${employeeInformation.ID}`}>
          <Typography>{employeeInformation.ID}</Typography>
          <Typography>{employeeInformation.firstName}</Typography>
          <Typography>{employeeInformation.lastName}</Typography>
        </div>
      ))}
      <Typography>Manager List</Typography>
      {managersInformation.map((manager) => (
        <div key={`managerCard-${manager.ID}`}>
          <Typography>{manager.ID}</Typography>
          <Typography>{manager.firstName}</Typography>
          <Typography>{manager.lastName}</Typography>
        </div>
      ))}
    </>
  );
};
export default ViewCompany;
