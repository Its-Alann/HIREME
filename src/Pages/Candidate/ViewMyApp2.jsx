import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect } from "react";

import {
  collection,
  query,
  limitToLast,
  getDocs,
  orderBy,
  startAfter,
  endBefore,
  doc,
  getDoc,
  limit,
} from "firebase/firestore";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
// import JobPostingApplicants from "../Recruiter/JobPostingApplicants";
import { Link } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import "../Job/Job.css";

export const ViewMyApp2 = () => {
  const [jobs, setJobs] = React.useState([]);
  const [companiesName, setCompaniesName] = React.useState({});
  const [myApplications, setMyApplications] = React.useState([]);

  const jobsPerPage = 5;

  //   async function getMyApplications() {
  //     const applicationsSnapshot = await getDoc(
  //       doc(db, "applications", "billybob@gmail.com")
  //     );
  //     const applicationsData = applicationsSnapshot.data().jobs;

  //     const arrayOfJobIds = [];
  //     applicationsData.forEach((item) => {
  //       arrayOfJobIds.push(item.jobID);
  //     });

  //     console.log("this SHOULD BE AN ARRAY OF USER IDS", arrayOfJobIds);
  //     setMyApplications(arrayOfJobIds);
  //   }

  // The alternative way is to fetch the entire collection
  // to the local machine, storing it in a list.
  // But I don't want to do it that way.
  // Because it can become heavy as the collection grows,
  // and also may cause security issues.
  async function getJobs() {
    //await getMyApplications();
    const applicationsSnapshot = await getDoc(
      doc(db, "applications", "billybob@gmail.com")
    );
    const applicationsData = applicationsSnapshot.data().jobs;

    console.log(applicationsData);

    // const arrayOfJobIds = [];
    // const arrayOfStatus = [];
    // applicationsData.forEach((item) => {
    //   arrayOfJobIds.push(item.jobID);
    //   arrayOfStatus.push(item.status);
    // });

    // console.log("this SHOULD BE AN ARRAY OF USER IDS", arrayOfJobIds);
    // console.log("this SHOULD BE AN ARRAY OF USER STATUSES", arrayOfStatus);
    // //setMyApplications(arrayOfJobIds);

    // const initialJobsQuery = query(collection(db, "jobs"));

    // const jobsSnapshot = await getDocs(initialJobsQuery);

    // // if none document returned, skip
    // if (jobsSnapshot.docs.length < 1) {
    //   return;
    // }

    // const temp = [];
    // jobsSnapshot.docs.forEach((document) => {
    //   console.log("JOBBBBS", document);
    //   console.log(arrayOfJobIds);
    //   if (arrayOfJobIds.includes(document.id)) {
    //     temp.push({
    //       ...document.data(),
    //       documentID: document.id,
    //       status: "pending",
    //     });
    //   }
    // });
    // temp.reverse();
    setJobs(applicationsData);
  }

  // const getJobTitle = async (jobID) => {
  //   const jobsRef = doc(db, "jobs", jobID);
  //   const docSnap = await getDoc(jobsRef);
  //   const data = docSnap.data().title;
  //   console.log("title", data);
  //   return data.title;
  // };

  // const getCompany = async (jobID) => {
  //   const jobsRef = doc(db, "jobs", jobID);
  //   const docSnap = await getDoc(jobsRef);
  //   const data = docSnap.data().companyID;
  //   console.log("companyID", data);
  // };

  // const getLocation = async (jobID) => {
  //   const jobsRef = doc(db, "jobs", jobID);
  //   const docSnap = await getDoc(jobsRef);
  //   const data = docSnap.data().location;
  //   console.log("location", data);
  // };

  // const getDeadline = async (jobID) => {
  //   const jobsRef = doc(db, "jobs", jobID);
  //   const docSnap = await getDoc(jobsRef);
  //   const data = docSnap.data().deadline;
  //   console.log("deadline", data);
  // };
  const [title, setTitle] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [deadline, setDeadline] = React.useState("");

  const getAllInfo = async (jobID) => {
    const jobsRef = doc(db, "jobs", jobID);
    const docSnap = await getDoc(jobsRef);

    setTitle(docSnap.data().title);
    setCompany(docSnap.data().companyID);
    setLocation(docSnap.data().location);
    setDeadline(docSnap.data().deadline);
  };

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

  useEffect(() => {
    getCompaniesName();
    console.log("STOPPPPPPP");
  }, [jobs]);

  useEffect(() => {
    console.log("STOPPPPPPP");
    getJobs();
  }, []);

  return (
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          My Application
        </Typography>
        {/* {getJobTitle("4QwjqeYxPRuDw7fOnKBj")}; */}
        {jobs.map((job) => {
          const hello = "hello";

          getAllInfo(job.jobID);
          console.log("ALL INFO", title, company, deadline, location);
          //   const jobTitle = getJobTitle(job.jobID);
          // const jobTitle = getJobTitle(job.jobID);
          // const company = getCompany(job.jobID);
          // const location = getLocation(job.jobID);
          // const deadline = getDeadline(job.jobID);

          // do this to show what is inside job
          // console.log(job);
          return (
            // Create cards instead
            <Box sx={{ py: 1 }}>
              <Card variant="outlined">
                <Box sx={{ m: 3 }}>
                  <Typography variant="h4">{job.jobID}</Typography>
                  <Button
                    variant="contained"
                    sx={{
                      m: 2,
                      textTransform: "none",
                      ml: { xs: 0, sm: "auto" },
                    }}
                  >
                    Remove
                  </Button>
                  <Typography>comp </Typography>

                  {/* change to country and city */}
                  <Typography>{job.jobID}</Typography>

                  {/* do we need to show company id? */}
                  {/* <Typography>Company ID: {job.companyID}</Typography> */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    sx={{ pt: 2 }}
                  >
                    {/* <Typography>
                      Deadline:{" "}
                      {new Date(
                        getDeadline(job.jobID).seconds * 1000 +
                          getDeadline(job.jobID).nanoseconds / 1000000
                      ).toDateString()}
                    </Typography> */}
                  </Stack>
                </Box>
              </Card>
              <Typography>{job.status}</Typography>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};
export default ViewMyApp2;
