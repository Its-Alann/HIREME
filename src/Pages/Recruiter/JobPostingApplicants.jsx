import { useEffect } from "react";
import { useParams } from "react-router-dom";
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

export const JobPostingApplicants = () => {
  const pageID = useParams();
  const pageJobID = useParams().jobID;

  const [job, setJob] = React.useState([]);
  const [companyName, setCompanyName] = React.useState({});

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
        // const jobsSnapshot = await getDoc(
        //   doc(db, "jobs", "4QwjqeYxPRuDw7fOnKBj")
        // ); // hardcoded, implement navigation and pass in the prop
        const jobsSnapshot = await getDoc(doc(db, "jobs", pageJobID)); // hardcoded, implement navigation and pass in the prop
        const jobData = jobsSnapshot.data();
        setJob(jobData);
        // console.log(jobData);
      } catch (err) {
        console.log(err);
      }
    };

    getJobs();
  }, []);

  useEffect(() => {
    getCompanyName(job.companyID);
  }, [job]);

  // For application statuses
  // 1. Get the array of applications from jobs
  // 2. Get the names of the applicants from userProfiles
  // 3. If the job ID exists for the user in applications, then display the applicant status

  // To change application status
  // 1. Recruiter will select from interview (green), viewed (orange), rejected (red), and pending (grey default)

  return (
    <Stack direction="row" alignItems="flex-start" justifyContent="center">
      {/* Job information */}
      <Box sx={{ minWidth: 700, p: 5 }}>
        <Card variant="outlined">
          <Box sx={{ m: 2 }}>
            <Box sx={{ pb: 2 }}>
              <Stack spacing={-0.5}>
                <Typography variant="h4">{job.title}</Typography>
                <Typography sx={{ fontSize: 18 }}>
                  {companyName.name}
                </Typography>
                <Typography sx={{ fontSize: 18 }}>{job.location}</Typography>
              </Stack>
              {/* <Typography sx={{ fontSize: 16 }}>
                {new Date(
                  job.deadline.seconds * 1000 +
                    job.deadline.nanoseconds / 1000000
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </Typography> */}
            </Box>

            <Divider />
            <Stack spacing={2}>
              <Box sx={{ pt: 2 }}>
                <Typography sx={{ fontSize: 20 }}>About the job</Typography>
                <Typography>{job.description}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 20 }}>Requirements</Typography>
                <Typography>{job.requirement}</Typography>
              </Box>
            </Stack>
          </Box>
        </Card>
      </Box>
      {/* List of applicants and their statuses */}
      <Box sx={{ minWidth: 500, p: 5 }}>
        <Card variant="outlined">
          <Box sx={{ m: 2 }}>
            <Box sx={{ pb: 2 }}>
              <Typography variant="h4">Applicants</Typography>
              {/* <Typography>{job.applicants}</Typography> */}
              {/* <Typography>
                {job.applicants.map((el) => (
                  <Typography> {el} </Typography>
                ))}
              </Typography> */}
              {/* {console.log(applicants)} */}
              {/* {applicants.length > 0 && applicants != null ? ( */}
              {/* <Typography>
                {job.applicants.map((el) => (
                  <Typography> {el} </Typography>
                ))}
              </Typography> */}
              {/* ) : (
                <Typography>No applicants yet :/</Typography>
              )} */}
            </Box>
          </Box>
        </Card>
      </Box>
    </Stack>
  );
};

export default JobPostingApplicants;
