import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";

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
  FieldValue,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
// import JobPostingApplicants from "../Recruiter/JobPostingApplicants";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";
import "../Job/Job.css";

export const ViewMyApp = () => {
  const [jobs, setJobs] = useState([]);
  const [companiesName, setCompaniesName] = useState({});
  const [myApplications, setMyApplications] = useState([]);
  const [myUser, setMyUser] = useState("");
  const [companiesLogo, setCompaniesLogo] = React.useState({});

  const jobsPerPage = 5;

  const getJobInformation = async (jobId) => {
    const applicationsSnapshot = await getDoc(doc(db, "applications", myUser));
    const usersjobs = applicationsSnapshot.data().jobs;
    let status1 = "";

    usersjobs.forEach(async (item) => {
      if (jobId === item.jobID) {
        console.log("LINE 47", item.status);
        status1 = item.status;
      }
    });

    console.log(jobId);

    try {
      const jobInformationSnapshot = await getDoc(doc(db, "jobs", jobId));
      const jobInformationData = jobInformationSnapshot.data();

      console.log("in getjobinfo", status1);

      console.log(jobInformationData);
      const jobInformation = {
        jobTitle: jobInformationData.title,
        jobID: jobId,
        status: status1,
        companyID: jobInformationData.companyID,
        city: jobInformationData.city,
        country: jobInformationData.country,
        deadline: jobInformationData.deadline,
      };
      console.log("line73: ", jobInformation);
      setMyApplications((prevApplications) => [
        ...prevApplications,
        jobInformation,
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  async function getJobs() {
    //await getMyApplications();
    const applicationsSnapshot = await getDoc(doc(db, "applications", myUser));
    const applicationsData = applicationsSnapshot.data().jobs;
    await applicationsData.map((job) =>
      Promise.all(getJobInformation(job.jobID))
    );
    console.log(myApplications);
  }

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    console.log("IN COMPANIES", jobs);
    console.log("IN COMPANIES", myApplications);

    myApplications.forEach(async (job) => {
      if (!temp[job.companyID]) {
        temp[job.companyID] = "querying";
        const companyRef = doc(db, "companies", job.companyID);
        const companySnapshot = await getDoc(companyRef);
        temp[job.companyID] = companySnapshot.data().name;
        setCompaniesName({ ...temp });
      }
    });
  }

  // Load the logo of each company that has job listings
  function loadLogoCompany() {
    const temp = companiesLogo;
    myApplications.forEach(async (job) => {
      const querySnapshot = await getDoc(doc(db, "companies", job.companyID));
      temp[job.companyID] = querySnapshot.data().logoPath;
      // triggers a re-render and display the newly loaded logos
      setCompaniesLogo({ ...temp });
    });
  }

  const handleRemoveJob = async (jobID) => {
    // TODO: Implement the logic to remove the job with the given ID
    console.log(`Removing job with ID ${jobID}`);
    // const docRef = db.collection("applications").doc("billybob@gmail.com");
    const docReffff = doc(db, "applications", myUser);
    const docRef = await getDoc(docReffff);

    const docSnapshot = docRef.data();

    console.log(docSnapshot);
    docRef.data().jobs.forEach(async (element) => {
      console.log(element);
      console.log(element.jobID);
      if (element.jobID === jobID) {
        await updateDoc(docReffff, {
          jobs: arrayRemove(element),
          //element.arrayRemove();
        });
      }
    });

    const jobDocumentRef = doc(db, "jobs", jobID);

    try {
      await updateDoc(jobDocumentRef, {
        applicants: arrayRemove(myUser),
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  //wejnbjenck
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setMyUser(user.email);
        console.log("user.email", user.email);
        // getAllReceivers();
      } else {
        console.log("User must be signed in");
      }
    });
  }, []);

  useEffect(() => {
    getCompaniesName();
    loadLogoCompany();
    console.log("STOPPPPPPP");
  }, [myApplications]);

  useEffect(() => {
    console.log("STOPPPPPPP");
    Promise.all([getJobs()]);
  }, [myUser]);

  return (
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          My Application
        </Typography>
        {/* {getJobTitle("4QwjqeYxPRuDw7fOnKBj")}; */}
        {myApplications.map((job) => {
          const hello = "hello";

          // getAllInfo(job.jobID);
          // console.log("ALL INFO", title, company, deadline, location);
          //   const jobTitle = getJobTitle(job.jobID);
          // const jobTitle = getJobTitle(job.jobID);
          // const company = getCompany(job.jobID);
          // const location = getLocation(job.jobID);
          // const deadline = getDeadline(job.jobID);

          // do this to show what is inside job
          // console.log(job);
          // console.log(companiesName);
          return (
            // Create cards instead
            <Box sx={{ py: 1 }}>
              <Card variant="outlined">
                <Box sx={{ m: 3 }}>
                  <Grid
                    container
                    spacing={-0.5}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid>
                      {job.companyID === undefined ? (
                        <Box
                          component="img"
                          sx={{
                            // objectFit: "cover",
                            width: "0.25",
                            height: "0.25",
                            mr: 2,
                          }}
                          src="https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FDefault_logo.png?alt=media&token=bd9790a2-63bb-4083-8c4e-fba1a8fca4a3"
                        />
                      ) : (
                        <Box
                          component="img"
                          sx={{
                            // objectFit: "cover",
                            width: "6rem",
                            height: "6rem",
                            mr: 2,
                          }}
                          src={companiesLogo[job.companyID]}
                        />
                      )}
                      <Box>
                        <Typography variant="h4">{job.jobTitle}</Typography>
                        <Typography>{companiesName[job.companyID]} </Typography>
                        {/* <Typography>{job.companyID} </Typography> */}
                        {/* change to country and city */}
                        <Typography>{`${job.city}, ${job.country}`}</Typography>
                      </Box>
                    </Grid>
                    <Grid>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "black",
                          m: 2,
                          textTransform: "none",
                          marginLeft: "auto",
                        }}
                        onClick={() => handleRemoveJob(job.jobID)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>

                  {/* do we need to show company id? */}
                  {/* <Typography>Company ID: {job.companyID}</Typography> */}

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
                <Box
                  sx={{
                    backgroundColor:
                      job.status === "interview"
                        ? "green"
                        : job.status === "viewed"
                        ? "yellow"
                        : job.status === "rejected"
                        ? "red"
                        : "darkgray",
                    flex: 1,
                  }}
                >
                  <Typography>{job.status}</Typography>
                </Box>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};
export default ViewMyApp;
