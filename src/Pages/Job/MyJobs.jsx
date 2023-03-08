import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
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
import { db, auth } from "../../Firebase/firebase";

export const MyJobs = () => {
  const [myJobsID, setMyJobsID] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const [companiesName, setCompaniesName] = React.useState({});
  const [cursorPosition, setCursorPosition] = React.useState(0);

  // Go to the recruiter, and get his list of jobs he posted
  async function getMyJobsID() {
    const recruiterRef = doc(db, "recruiters", auth.currentUser.uid);
    const recruiterSnapshot = await getDoc(recruiterRef);
    setMyJobsID(recruiterSnapshot.data().jobs);
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

  async function getJobs() {
    if (cursorPosition >= myJobsID.length) {
      return;
    }
    const tempJobIDList = [];
    for (let i = cursorPosition; i < cursorPosition + 5; i += 1) {
      if (i >= myJobsID.length) {
        break;
      }
      tempJobIDList.push(myJobsID[i].jobID);
    }

    const jobsQuery = query(
      collection(db, "jobs"),
      //orderBy(documentId()),
      where(documentId(), "in", tempJobIDList)
      //orderBy("publishedAt")
    );

    const jobsSnapshot = await getDocs(jobsQuery);

    const temp = [];
    jobsSnapshot.docs.forEach((document) => {
      temp.push({ ...document.data(), documentID: document.id });
    });
    temp.reverse();
    setJobs(temp);
  }

  function setCursorToNextPosition() {
    const nextPosition = cursorPosition + 5;
    if (nextPosition >= myJobsID.length) {
      return;
    }
    setCursorPosition(nextPosition);
  }
  function setCursorToPreviousPosition() {
    let previousPosition = cursorPosition - 5;
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

  // when cursor position change, get the jobs to display
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
        This Page list all jobs belong to me, 5 per page. Only me should be able
        to see the page.
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
            <Button id={`Button-Edit-${job.documentID}`}>
              Edit (not implemented)
            </Button>
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
