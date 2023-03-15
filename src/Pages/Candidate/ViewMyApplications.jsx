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
import { db, auth } from "../../Firebase/firebase";
import "../Job/Job.css";

export const ViewMyApplications = () => {
  //const auth = getAuth();
  // const userEmail = auth.currentUser.email;
  // console.log(userEmail);

  const [jobs, setJobs] = React.useState([]);
  const [myApplications, setMyApplications] = React.useState([]);

  // const [lastJob, setLastJob] = React.useState(null);
  // const [firstJob, setFirstJob] = React.useState(null);
  const [companiesName, setCompaniesName] = React.useState({});

  //const jobsPerPage = 5;

  const initialJobsQuery = query(collection(db, "jobs"));

  // get a list of all jobs that this user has applied to
  const getMyAppliedJobs = async () => {
    const applicationsSnapshot = await getDoc(
      doc(db, "applications", "billybob@gmail.com")
    );
    const applicationsData = applicationsSnapshot.data().jobs;
    setMyApplications(applicationsData);
  };

  // The alternative way is to fetch the entire collection
  // to the local machine, storing it in a list.
  // But I don't want to do it that way.
  // Because it can become heavy as the collection grows,
  // and also may cause security issues.
  const getJobs = async (jobsQuery) => {
    await getMyAppliedJobs();
    const jobsSnapshot = await getDocs(jobsQuery);

    // if none document returned, skip
    if (jobsSnapshot.docs.length < 1) {
      console.log("I AM RETURNING");
      return;
    }
    // setLastJob(jobsSnapshot.docs[0]);
    // setFirstJob(jobsSnapshot.docs[jobsSnapshot.docs.length - 1]);
    const temp = [];
    jobsSnapshot.docs.forEach((document) => {
      myApplications.forEach((oneJob) => {
        if (document.id === oneJob.jobID) {
          // console.log(oneJob.jobID);
          // console.log(document.id);
          temp.push({ ...document.data(), documentID: document.id });
        }
      });
    });
    // temp.reverse();
    setJobs(temp);
  };

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip

  //COMPANY FUNCTIONMNNNNNNNN
  const getCompaniesName = async () => {
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
  };

  //aaa
  // useEffect(() => {
  //   Promise.all([
  //     getMyAppliedJobs(),
  //     getJobs(initialJobsQuery),

  //     getCompaniesName(),
  //   ])
  //     .then(() => {
  //       console.log("finished loading data AAAAAAA");
  //       console.log(companiesName);
  //       console.log(myApplications);
  //       console.log(jobs);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    getCompaniesName();
    console.log("AAAAA STOOOOOPPPPPPPPPPP");
  }, [jobs]);

  useEffect(() => {
    getJobs(initialJobsQuery);
    console.log("AAAAA STOOOOOPPPPPPPPPPP aaaAAAAAAAAAAAAAA");
  }, []);

  return (
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          My Applications
        </Typography>
        <Typography>
          This Page lists all applications that the logged in user applied to.
        </Typography>

        {jobs.map((job) => {
          const hello = "hello";

          // do this to show what is inside job
          // console.log(job);
          return (
            // Create cards instead
            <Box key={job.documentID} sx={{ py: 1 }}>
              <Card variant="outlined">
                <Box sx={{ m: 3 }}>
                  <Typography variant="h4">{job.title}</Typography>

                  <Typography>{companiesName[job.companyID]}</Typography>

                  <Typography>{job.location}</Typography>

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
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};
export default ViewMyApplications;
