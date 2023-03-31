import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Container from "@mui/material/Container";
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
import JobCard from "../../Components/Jobs/JobCard";
import { db, auth } from "../../Firebase/firebase";

export const MyJobs = () => {
  const [myJobsID, setMyJobsID] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const [companyName, setCompanyName] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [companyLogo, setCompanyLogo] = React.useState("");

  const jobsPerPage = 4;

  // Go to the recruiter, and get his company
  // Then get all the job id under company
  async function getMyJobsID() {
    const recruiterRef = doc(db, "recruiters", auth.currentUser.uid);
    const recruiterSnapshot = await getDoc(recruiterRef);
    if (recruiterSnapshot.exists()) {
      const companyID = recruiterSnapshot.data().workFor;
      if (companyID) {
        const companyRef = doc(db, "companies", companyID);
        const companySnapshot = await getDoc(companyRef);
        const companyInformation = companySnapshot.data();
        const tempArray = [...companyInformation.jobs];

        // Sort the list of jobID based on the publishedAt, newest first
        tempArray.sort((a, b) => {
          if (a.publishedAt.seconds === b.publishedAt.seconds) {
            return a.publishedAt.nanoseconds > b.publishedAt.nanoseconds
              ? 1
              : -1;
          }
          return a.publishedAt.seconds > b.publishedAt ? 1 : -1;
        });

        setMyJobsID(tempArray);
        setCompanyName(companyInformation.name);
        setCompanyLogo(companyInformation.logoPath);
      }
    }
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

  // Uncomment this code to verify infinite loop of query
  // React.useEffect(() => {
  //   console.log(myJobsID);
  // }, [myJobsID]);
  // React.useEffect(() => {
  //   console.log(cursorPosition);
  // }, [cursorPosition]);
  // React.useEffect(() => {
  //   console.log(jobs);
  // }, [jobs]);
  // React.useEffect(() => {
  //   console.log(companyName);
  // }, [companyName]);
  return (
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          My Jobs
        </Typography>
        <Typography>
          This Page list all jobs belong to me, {jobsPerPage} per page. Only I
          should be able to see the page.
        </Typography>

        {jobs.map((job) => (
          <JobCard
            key={`JobCard-${job.documentID}`}
            companyID={job.companyID}
            companyName={companyName}
            jobID={job.documentID}
            title={job.title}
            city={job.city}
            country={job.country}
            deadlineSeconds={job.deadline.seconds}
            deadlineNanoSeconds={job.deadline.nanoseconds}
            logo={companyLogo}
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
      </Box>
    </Container>
  );
};
export default MyJobs;
