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
  getDocs,
  query,
  where,
  collection,
  deleteDoc,
} from "firebase/firestore";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
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

  // gets all the job information and creates an array of
  //objects containing all needed information
  const getJobInformation = async (jobId, statusApplicant) => {
    //creates jobInformation object and adds it to myApplications
    try {
      const jobInformationSnapshot = await getDoc(doc(db, "jobs2", jobId));
      const jobInformationData = jobInformationSnapshot.data();
      const jobInformation = {
        jobTitle: jobInformationData.title,
        jobID: jobId,
        status: statusApplicant,
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
    const applicationsSnapshot = await getDocs(
      query(
        collection(db, "applications2"),
        where("applicantEmail", "==", myUser)
      )
    );

    const applicationsData = applicationsSnapshot.docs.map((docJob) => ({
      id: docJob.id,
      ...docJob.data(),
    }));
    // const applicationsSnapshot = await getDoc(doc(db, "applications2", myUser));
    // const applicationsData = applicationsSnapshot.data().jobs;
    await applicationsData.map((job) =>
      Promise.all(getJobInformation(job.jobID, job.status))
    );
  }

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    const temp2 = companiesLogo;

    myApplications.forEach(async (job) => {
      const companyRef = doc(db, "companies2", job.companyID);
      const companySnapshot = await getDoc(companyRef);
      if (!temp[job.companyID]) {
        temp[job.companyID] = "querying";
        temp[job.companyID] = companySnapshot.data().name;
        setCompaniesName({ ...temp });
      }
      if (companySnapshot.data().logoPath === "") {
        temp2[job.companyID] =
          "https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FHIREME_whitebg.png?alt=media&token=c621d215-a3db-4557-8c06-1618905b5ab0";
      } else temp2[job.companyID] = companySnapshot.data().logoPath;
      setCompaniesLogo({ ...temp2 });
    });
  }

  // remove the applied job linked to the candidate the database
  const handleRemoveJob = async (jobID) => {
    // Implement the logic to remove the job with the given ID
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "applications2"), where("jobID", "==", jobID))
      );
      const tempArray = querySnapshot.docs.map((docJob) => ({
        id: docJob.id,
      }));
      await Promise.all(
        tempArray.map(async (docID) => {
          await deleteDoc(doc(db, "applications2", docID.id));
        })
      );
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
    console.log("listening of myApplications");
  }, [myApplications]);

  //set a listener to on the jobs document
  useEffect(() => {
    console.log("listener of jobs");
    Promise.all([getJobs()]);
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
        {console.log(myApplications)}
        {myApplications.length > 0 && myApplications !== null ? (
          myApplications.map((job) => {
            const hello = "hello";

            return (
              // Create cards
              <Grid sx={{ py: 1 }}>
                <Card variant="outlined">
                  <Stack direction="row" justifyContent="space-between">
                    <Grid sx={{ md: 8, sm: 12, sx: 12 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        margin="5"
                      >
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
                          <Typography>
                            {companiesName[job.companyID]}{" "}
                          </Typography>
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
          })
        ) : (
          <Card variant="outlined">
            <Box sx={{ m: 2 }}>
              <Box sx={{ pb: 2 }}>
                <Typography>No applied jobs :/</Typography>
              </Box>
            </Box>
          </Card>
        )}
      </Box>
    </Container>
  );
};
export default ViewMyApp;
