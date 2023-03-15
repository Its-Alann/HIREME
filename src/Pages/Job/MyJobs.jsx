import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  documentId,
  where,
} from "firebase/firestore";
import { EditJob } from "./EditJob";
import { CreateJob } from "./CreateJob";
import { db, auth } from "../../Firebase/firebase";

export const MyJobs = () => {
  const [myJobsID, setMyJobsID] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const [companiesName, setCompaniesName] = React.useState({});
  const [cursorPosition, setCursorPosition] = React.useState(0);

  const jobsPerPage = 4;

  // Go to the recruiter, and get his list of jobs he posted
  async function getMyJobsID() {
    const recruiterRef = doc(db, "recruiters", auth.currentUser.uid);
    const recruiterSnapshot = await getDoc(recruiterRef);
    const tempArray = [...recruiterSnapshot.data().jobs];

    // Sort the list of jobID based on the publishedAt, newest first
    tempArray.sort((a, b) => {
      if (a.publishedAt.seconds === b.publishedAt.seconds) {
        return a.publishedAt.nanoseconds > b.publishedAt.nanoseconds ? 1 : -1;
      }
      return a.publishedAt.seconds > b.publishedAt ? 1 : -1;
    });

    setMyJobsID(tempArray);
  }

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    jobs.forEach(async (job) => {
      if (!temp[job.companyID]) {
        temp[job.companyID] = "querying";
        const companyRef = doc(db, "companies", job.companyID);
        const companySnapshot = await getDoc(companyRef);
        temp[job.companyID] = companySnapshot.data().name;
        setCompaniesName({ ...temp });
      }
    });
  }

  // Using the list of jobsID & the cursor position
  // determine 5 jobID
  // Then query jobs whose ID within the 5 jobID
  async function getJobs() {
    if (cursorPosition >= myJobsID.length) {
      return;
    }
    const tempJobIDList = [];
    for (let i = cursorPosition; i < cursorPosition + jobsPerPage; i += 1) {
      if (i >= myJobsID.length) {
        break;
      }
      tempJobIDList.push(myJobsID[i].jobID);
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
    if (nextPosition >= myJobsID.length) {
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

  // when auth change, get the list of job id from recruiter
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getMyJobsID();
      }
    });
  }, []);

  // when cursor position change jobs to display
  React.useEffect(() => {
    getJobs();
  }, [cursorPosition, myJobsID]);

  // when jobs change, get the companies names
  React.useEffect(() => {
    getCompaniesName();
  }, [jobs]);

  // Uncomment this code to verify infinite loop of query
  //   React.useEffect(() => {
  //     console.log(myJobsID);
  //   }, [myJobsID]);
  //   React.useEffect(() => {
  //     console.log(cursorPosition);
  //   }, [cursorPosition]);
  //   React.useEffect(() => {
  //     console.log(jobs);
  //   }, [jobs]);
  //   React.useEffect(() => {
  //     console.log(companiesName);
  //   }, [companiesName]);
  return (
    <Box>
      <Typography>My Jobs</Typography>
      <Typography>
        This Page list all jobs belong to me, {jobsPerPage} per page. Only me
        should be able to see the page.
      </Typography>

      {jobs.map((job) => {
        // Anti eslint
        const hello = "hello";

        // do this to show what is inside job
        // console.log(job);
        return (
          <Box key={job.documentID}>
            <Typography>Company ID: {job.companyID}</Typography>
            <Typography>
              Company Name: {companiesName[job.companyID]}
            </Typography>
            <Typography>Title: {job.title}</Typography>
            <Typography>Description: {job.description}</Typography>
            <Typography>
              Deadline:{" "}
              {new Date(
                job.deadline.seconds * 1000 + job.deadline.nanoseconds / 1000000
              ).toDateString()}
            </Typography>
            <Typography>
              Published At:{" "}
              {new Date(
                job.publishedAt.seconds * 1000 +
                  job.publishedAt.nanoseconds / 1000000
              ).toDateString()}
            </Typography>

            <Link
              to={{
                pathname: `/editJob/${job.documentID}`,
              }}
            >
              <Button id={`Button-Edit-${job.documentID}`}>Edit</Button>
            </Link>
          </Box>
        );
      })}
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
  );
};
export default MyJobs;
