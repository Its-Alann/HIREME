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

  const getJobInformation = async (jobId) => {
    console.log(jobId);
    try {
      const jobInformationSnapshot = await getDoc(doc(db, "jobs", jobId));
      const jobInformationData = jobInformationSnapshot.data();
      //console.log(jobInformationData);
      const jobInformation = {
        jobTitle: jobInformationData.title,
        jobID: jobId,
        companyID: jobInformationData.companyID,
        deadline: jobInformationData.deadline,
      };
      console.log(jobInformation);
      setMyApplications((prevApplications) => [
        ...prevApplications,
        jobInformation,
      ]);
    } catch (err) {
      console.log(err);
    }
  };

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
    await applicationsData.map((job) =>
      Promise.all(getJobInformation(job.jobID))
    );
    console.log(myApplications);
  }

  useEffect(() => {
    console.log("STOPPPPPP");
    Promise.all([getJobs()]);
  }, []);

  return (
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          My Application
        </Typography>
        {/* {getJobTitle("4QwjqeYxPRuDw7fOnKBj")}; */}
        {myApplications.map((job) => {
          const hello = "hello";

          // do this to show what is inside job
          // console.log(job);
          return (
            // Create cards instead
            <Box sx={{ py: 1 }}>
              <Card variant="outlined">
                <Box sx={{ m: 3 }}>
                  <Typography variant="h4">{job.jobTitle}</Typography>
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
                  <Typography>{job.jobID}</Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    sx={{ pt: 2 }}
                  >
                    <Typography>
                      Deadline:{" "}
                      {new Date(
                        job.deadline.seconds * 1000 +
                          job.deadline.nanoseconds / 1000000
                      ).toDateString()}
                    </Typography>
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
