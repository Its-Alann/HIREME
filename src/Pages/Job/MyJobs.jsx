import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import PostAddIcon from "@mui/icons-material/PostAdd";
import { db, auth } from "../../Firebase/firebase";

export const MyJobs = () => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const [myJobs, setMyJobs] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const [companiesName, setCompaniesName] = React.useState({});
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [companiesLogo, setCompaniesLogo] = React.useState({});

  const jobsPerPage = 4;
  // Using the list of jobsID & the cursor position
  // determine 5 jobID
  // Then query jobs whose ID within the 5 jobID
  async function getJobs() {
    if (cursorPosition >= myJobs.length) {
      return;
    }
    const tempJobList = [];
    for (let i = cursorPosition; i < cursorPosition + jobsPerPage; i += 1) {
      if (i >= myJobs.length) {
        break;
      }
      tempJobList.push(myJobs[i]);
    }
    setJobs(tempJobList);
  }

  // Go to the recruiter, and get his list of jobs he posted
  async function getMyJobs() {
    const jobQuery = query(
      collection(db, "jobs2"),
      where("owner", "==", auth.currentUser.uid)
    );
    const jobsSnapshot = await getDocs(jobQuery);
    const tempArray = jobsSnapshot.docs.map((job) => ({
      id: job.id,
      ...job.data(),
    }));

    // Sort the list of jobID based on the publishedAt, newest first
    tempArray.sort((a, b) => {
      if (a.publishedAt.seconds === b.publishedAt.seconds) {
        return a.publishedAt.nanoseconds > b.publishedAt.nanoseconds ? 1 : -1;
      }
      return a.publishedAt.seconds > b.publishedAt ? 1 : -1;
    });
    // console.log(tempArray);
    setMyJobs(tempArray);

    await getJobs();
  }

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    const temp2 = companiesLogo;

    jobs.forEach(async (job) => {
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

  function setCursorToNextPosition() {
    const nextPosition = cursorPosition + jobsPerPage;
    if (nextPosition >= myJobs.length) {
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
        getMyJobs();
      }
    });
  }, []);

  // when cursor position change jobs to display
  React.useEffect(() => {
    getJobs();
  }, [cursorPosition, myJobs]);

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
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" sx={{ pb: 2 }}>
            {t("MyJobs")}
          </Typography>
          {/* button for recruiter's view */}
          <Button
            variant="contained"
            size="medium"
            sx={{ my: 1 }}
            id="create-job"
            data-cy="view"
          >
            <Link
              to="/createJob"
              className="link"
              underline="none"
              style={{ textDecoration: "none" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                alignContent="center"
                alignSelf="center"
                justifyContent="space-between"
              >
                {t("CreateJob")} &nbsp;&nbsp;
                <PostAddIcon sx={{ fontSize: "25px" }} />
              </Stack>
            </Link>
          </Button>
        </Stack>
        <Typography>
          {t("ThisPagelistalljobs,")} {jobsPerPage} {t("perpage.")}
        </Typography>
        {jobs.map((job) => {
          // Anti eslint
          const hello = "hello";

          // do this to show what is inside job
          // console.log(job);
          return (
            <Box key={job.documentID} sx={{ py: 1 }}>
              <Card variant="outlined">
                <Box sx={{ m: 3 }}>
                  <Stack direction="row" alignItems="center">
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
                    <Box>
                      <Typography variant="h4">{job.title}</Typography>
                      <Typography>{companiesName[job.companyID]}</Typography>
                      <Typography>{`${job.city}, ${job.country}`}</Typography>
                    </Box>
                  </Stack>

                  {/* <Link
                    to={{
                      pathname: `/editJob/${job.documentID}`,
                    }}
                  >
                    <Button id={`Button-Edit-${job.documentID}`}>Edit</Button>
                  </Link> */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    sx={{ pt: 2 }}
                  >
                    {/* button for recruiter's view */}
                    <Button
                      variant="contained"
                      size="medium"
                      sx={{ my: 1 }}
                      id={`Button-${job.documentID}`}
                      data-cy="view"
                    >
                      <Link
                        to={`/viewJobPostingApplicants/${job.companyID}/${job.id}`}
                        className="link"
                        underline="none"
                        style={{ textDecoration: "none" }}
                      >
                        {/* <Link to="/job/1"> */}
                        {t("Viewjob")}
                      </Link>
                    </Button>
                    <Typography>
                      {t("Deadline:")}{" "}
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
        <Button
          id="Button-Previous"
          onClick={() => setCursorToPreviousPosition()}
        >
          {t("Previous")}
        </Button>
        <Button id="Button-Next" onClick={() => setCursorToNextPosition()}>
          {t("Next")}
        </Button>
      </Box>
    </Container>
  );
};
export default MyJobs;
