import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, app } from "../../Firebase/firebase";
import "./Job.css";

export const SavedJobs = () => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const [userEmail, setUserEmail] = useState("");
  const [savedJobIds, setSavedJobIds] = useState(null);
  const [jobInfo, setJobInfo] = useState([]);
  const [companiesName, setCompaniesName] = useState({});
  const [companiesLogo, setCompaniesLogo] = React.useState({});
  const database = getFirestore(app);

  // Only once, attach listener to onAuthStateChanged
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const { uid, email } = authUser;
        console.log("uid", uid);
        console.log("useEffect: ", email);
        setUserEmail(email);
      } else {
        setUserEmail(null);
      }
    });
  }, []);

  async function updateDB() {
    console.log("start update");
    if (userEmail !== "") {
      if (savedJobIds !== null) {
        const userProfileDocRef = doc(database, "notifications", userEmail);
        await updateDoc(userProfileDocRef, { savedJobs: savedJobIds });
      } else {
        const userProfileDocRef = doc(database, "notifications", userEmail);
        await updateDoc(userProfileDocRef, { savedJobs: [] });
      }
    }
    console.log("Update finished");
  }

  useEffect(() => {
    async function fetchData() {
      if (userEmail !== null) {
        try {
          const userInfoDocRef = doc(database, "notifications", userEmail);
          // Get notifications data and set it to local array
          const userInfoSnapShot = await getDoc(userInfoDocRef);
          if (userInfoSnapShot.exists()) {
            console.log("user profile exists in notifications");
            if (userInfoSnapShot.data().savedJobs !== undefined) {
              setSavedJobIds(userInfoSnapShot.data().savedJobs);
            } else {
              console.log("no saved jobs in notifications");
              updateDB();
            }
          } else {
            console.log("user profile doesn't exist in notifications");
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    console.log("sets saved companies");
    fetchData();
  }, [userEmail]);

  const getJobInformation = async (jobId) => {
    //creates jobInformation object and adds it to myApplications
    try {
      const jobInformationSnapshot = await getDoc(doc(db, "jobs2", jobId));
      const jobInformationData = jobInformationSnapshot.data();
      const jobInformation = {
        jobTitle: jobInformationData.title,
        jobID: jobId,
        companyID: jobInformationData.companyID,
        city: jobInformationData.city,
        country: jobInformationData.country,
        deadline: jobInformationData.deadline,
      };
      if (jobInformationData.link !== undefined) {
        jobInformation.link = jobInformationData.link;
      }
      setJobInfo((prevJobLst) => [...prevJobLst, jobInformation]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("adding job info");
    if (savedJobIds != null) {
      try {
        savedJobIds.map((jobId) => getJobInformation(jobId));
      } catch (err) {
        console.log(err);
      }
      updateDB();
    } else {
      console.log("no saved jobs");
    }
  }, [savedJobIds]);

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    const temp2 = companiesLogo;

    jobInfo.forEach(async (job) => {
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

  useEffect(() => {
    console.log("jobInfo useEffect");
    if (
      jobInfo !== null &&
      savedJobIds !== null &&
      jobInfo.length === savedJobIds.length
    ) {
      getCompaniesName();
    }
    // if (jobInfo !== null) {
    //   console.log(jobInfo);
    // }
    // if (savedJobIds !== null) {
    //   console.log(savedJobIds);
    // }
  }, [jobInfo]);

  const handleRemoveSaved = (jobId) => {
    setSavedJobIds((prev) => prev.filter((temp) => temp !== jobId));
    setJobInfo([]);
    updateDB();
  };

  // returns all the applications that the logged in user has applied to
  // every application has a remove button. If applicant clicks "Remove" button application is removed
  // status is displayed for each application (the status is changed by recruiter)
  return (
    // <Button
    //   onClick={() => {
    //     console.log(savedJobIds);
    //     console.log(companiesName);
    //     console.log(companiesLogo);
    //   }}
    // >
    //   temp
    // </Button>
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          {t("My Saved Jobs")}
        </Typography>
        {/* console.log(jobInfo) */}
        {jobInfo.length > 0 && jobInfo !== null ? (
          jobInfo.map((job) => {
            const hello = "hello";

            return (
              // Create cards instead
              <Box key={job.documentID} sx={{ py: 1 }}>
                <Card variant="outlined">
                  <Box sx={{ m: 3 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        id="companyLogo"
                        component="img"
                        sx={{
                          // objectFit: "cover",
                          width: "6rem",
                          height: "6rem",
                          mr: 2,
                        }}
                        src={companiesLogo[job.companyID]}
                      />
                      <Box>
                        <Typography variant="h4">{job.jobTitle}</Typography>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          <Typography>
                            {companiesName[job.companyID]}
                          </Typography>
                        </Box>
                        <Typography>{`${job.city}, ${job.country}`}</Typography>
                      </Box>
                      <Box sx={{ ml: "auto", mb: "auto" }}>
                        <Button
                          id="save-btn"
                          variant="contained"
                          data-cy="unsave-button"
                          sx={{
                            backgroundColor: "black",
                            m: 2,
                            height: 30,
                            width: 100,
                            textTransform: "none",
                          }}
                          onClick={() => handleRemoveSaved(job.jobID)}
                        >
                          {t("Unsave")}
                        </Button>
                      </Box>
                    </Stack>

                    {/* do we need to show company id? */}
                    {/* <Typography>Company ID: {job.companyID}</Typography> */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-end"
                      sx={{ pt: 2 }}
                    >
                      {/* Added this button for candidate's view */}
                      <Button
                        variant="contained"
                        size="medium"
                        sx={{ my: 1 }}
                        id={`Button-${job.documentID}`}
                      >
                        {/* if there's no link field in db, button links to viewJobPosting, otherwise external link */}
                        {job.link === undefined || job.link === "" ? (
                          <Link
                            to={`/viewJobPosting/${job.companyID}/${job.jobID}`}
                            className="link"
                            underline="none"
                            style={{ textDecoration: "none" }}
                          >
                            {/* <Link to="/job/1"> */}
                            {t("Viewjob")}
                          </Link>
                        ) : (
                          <a
                            href={job.link}
                            style={{ color: "white", textDecoration: "none" }}
                          >
                            {t("ApplyOnOtherSite")}
                          </a>
                        )}
                      </Button>
                      <Typography>
                        {t("Deadline")}{" "}
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
          })
        ) : (
          <Card variant="outlined">
            <Box sx={{ m: 2 }}>
              <Box sx={{ pb: 2 }}>
                <Typography>{t("No saved jobs")}</Typography>
              </Box>
            </Box>
          </Card>
        )}
      </Box>
    </Container>
  );
};
export default SavedJobs;
