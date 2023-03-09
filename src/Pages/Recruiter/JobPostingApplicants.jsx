import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { getDocs, doc, getDoc } from "firebase/firestore";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { PropTypes } from "prop-types";
import { Divider } from "@mui/material";
import { db } from "../../Firebase/firebase";

export const JobPostingApplicants = (/*{ jobId }*/) => {
  const [job, setJob] = React.useState([]);
  const [companyName, setCompanyName] = React.useState({});

  // async function getJobs() {
  //   //const jobsSnapshot = await getDoc(doc(db, "jobs", jobId));
  //   const jobsSnapshot = await getDoc(doc(db, "jobs", "4QwjqeYxPRuDw7fOnKBj")); // hardcoded, implement navigation and pass in the prop
  //   const jobData = jobsSnapshot.data();
  //   setJobs(jobData);
  //   console.log(jobData);
  // }

  const getCompanyName = async (companyID) => {
    try {
      const companySnapshot = await getDoc(doc(db, "companies", companyID)); // hardcoded, implement navigation and pass in the prop
      const companyData = companySnapshot.data();
      setCompanyName(companyData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getJobs = async () => {
      try {
        //const jobsSnapshot = await getDoc(doc(db, "jobs", jobId));
        const jobsSnapshot = await getDoc(
          doc(db, "jobs", "4QwjqeYxPRuDw7fOnKBj")
        ); // hardcoded, implement navigation and pass in the prop
        const jobData = jobsSnapshot.data();
        setJob(jobData);
        console.log(jobData);
      } catch (err) {
        console.log(err);
      }
    };

    getJobs();
  }, []);

  useEffect(() => {
    getCompanyName(job.companyID);
  }, [job]);

  return (
    <Stack direction="row">
      {/* Job information */}
      <Box sx={{ minWidth: 500, p: 5 }}>
        <Card variant="outlined">
          <Box sx={{ m: 2 }}>
            <Typography variant="h4">{job.title}</Typography>
            <Typography>{companyName.name}</Typography>
            <Typography>{job.location}</Typography>
            <Typography>
              {new Date(
                job.deadline.seconds * 1000 + job.deadline.nanoseconds / 1000000
              ).toDateString()}
            </Typography>
            <Divider />
            <Stack spacing={2}>
              <Box>
                <Typography>About the job</Typography>
                <Typography>{job.description}</Typography>
              </Box>
            </Stack>
          </Box>
        </Card>
      </Box>
      {/* List of applicants and their statuses */}
    </Stack>
  );
};

// JobPostingApplicants.propTypes = {
//   jobId: PropTypes.string.isRequired,
// };

export default JobPostingApplicants;
