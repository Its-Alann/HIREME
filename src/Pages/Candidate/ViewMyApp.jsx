import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";

import {
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

  // gets all the job information and creates an array of
  //objects containing all needed information
  const getJobInformation = async (jobId) => {
    //gets the job statuses from the applications collection
    const applicationsSnapshot = await getDoc(doc(db, "applications", myUser));
    const usersjobs = applicationsSnapshot.data().jobs;
    let status1 = "";

    //goes through all jobs and sets the status of a specific jobID
    usersjobs.forEach(async (item) => {
      if (jobId === item.jobID) {
        console.log("LINE 47", item.status);
        status1 = item.status;
      }
    });

    console.log(jobId);

    //creates jobInformation object and adds it to myApplications
    try {
      const jobInformationSnapshot = await getDoc(doc(db, "jobs", jobId));
      const jobInformationData = jobInformationSnapshot.data();

      const jobInformation = {
        jobTitle: jobInformationData.title,
        jobID: jobId,
        status: status1,
        companyID: jobInformationData.companyID,
        city: jobInformationData.city,
        country: jobInformationData.country,
        deadline: jobInformationData.deadline,
      };
      setMyApplications((prevApplications) => [
        ...prevApplications,
        jobInformation,
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  // get all the jobs we need to display on the page from applications collection
  // creates a jobInformation object by calling the method
  async function getJobs() {
    //await getMyApplications();
    const applicationsSnapshot = await getDoc(doc(db, "applications", myUser));
    const applicationsData = applicationsSnapshot.data().jobs;
    await applicationsData.map((job) => getJobInformation(job.jobID));
    // console.log(myApplications);
  }

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    // console.log("IN COMPANIES", jobs);
    // console.log("IN COMPANIES", myApplications);

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
  // remove the entire row of the job that was selected to be removed
  // remove the applied job linked to the candidate the database
  const handleRemoveJob = async (jobID) => {
    // Implement the logic to remove the job with the given ID
    // console.log(`Removing job with ID ${jobID}`);
    // const docRef = db.collection("applications").doc("billybob@gmail.com");
    const docReffff = doc(db, "applications", myUser);
    const docRef = await getDoc(docReffff);

    const docSnapshot = docRef.data();

    // console.log(docSnapshot);
    docRef.data().jobs.forEach(async (element) => {
      // console.log(element);
      // console.log(element.jobID);
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

  //auth listener on load
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

  //set a listener to on the myApplications
  useEffect(() => {
    getCompaniesName();
    loadLogoCompany();
    console.log("STOPPPPPPP");
  }, [myApplications]);

  //set a listener to on the jobs document
  useEffect(() => {
    console.log("STOPPPPPPP");
    if (myUser) {
      getJobs();
    }
  }, [myUser]);

  // returns all the applications that the logged in user has applied to
  // every application has a remove button. If applicant clicks "Remove" button application is removed
  // status is displayed for each application (the status is changed by recruiter)
  return (
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          My Application
        </Typography>
        {/* {getJobTitle("4QwjqeYxPRuDw7fOnKBj")}; */}
        {myApplications.map((job) => {
          const hello = "hello";

          return (
            // Create cards
            <Grid sx={{ py: 1 }} key={`MyApplicationCard${job.jobID}`}>
              <Card variant="outlined">
                <Stack direction="row" justifyContent="space-between">
                  <Grid sx={{ md: 8, sm: 12, sx: 12 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      margin="5"
                    >
                      {job.companyID === undefined ? (
                        <Box
                          component="img"
                          sx={{
                            // objectFit: "cover",
                            width: "0.25",
                            height: "0.25",
                            ml: 2,
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
                            alignItems: "center",
                          }}
                          src={companiesLogo[job.companyID]}
                        />
                      )}
                      <Grid>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="h4">{job.jobTitle}</Typography>
                          <Button
                            variant="contained"
                            data-cy="remove-button"
                            sx={{
                              backgroundColor: "black",
                              m: 2,
                              height: 30,
                              width: 100,
                              textTransform: "none",
                            }}
                            onClick={() => handleRemoveJob(job.jobID)}
                          >
                            Remove
                          </Button>
                        </Stack>
                        <Typography>{companiesName[job.companyID]} </Typography>
                        <Typography>{`${job.city}, ${job.country}`}</Typography>
                      </Grid>
                    </Stack>
                    <Stack direction="row" sx={{ pt: 2 }}>
                      <Typography>
                        Deadline:{" "}
                        {new Date(
                          job.deadline.seconds * 1000 +
                            job.deadline.nanoseconds / 1000000
                        ).toDateString()}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid
                    sx={{
                      md: 2,
                      sm: 12,
                      sx: 12,
                      backgroundColor:
                        job.status === "interview"
                          ? "green"
                          : job.status === "viewed"
                          ? "yellow"
                          : job.status === "rejected"
                          ? "red"
                          : "darkgray",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "70px",
                    }}
                  >
                    <Typography
                      sx={{
                        writingMode: "vertical-rl",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                    >
                      {job.status}
                    </Typography>
                  </Grid>
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Box>
    </Container>
  );
};
export default ViewMyApp;
