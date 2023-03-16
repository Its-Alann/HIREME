import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { db } from "../../Firebase/firebase";

export const JobPosting = () => {
  const pageID = useParams();
  const pageCompanyID = useParams().companyID;
  const pageJobID = useParams().jobID;

  const [job, setJob] = React.useState([]);
  const [companyName, setCompanyName] = React.useState({});

  const getJobData = async () => {
    try {
      // Gets the job data using the jobID from the URL
      const jobsSnapshot = await getDoc(doc(db, "jobs", pageJobID)); // hardcoded, implement navigation and pass in the prop
      console.log(pageJobID);
      const jobData = jobsSnapshot.data();
      setJob(jobData);

      console.log(jobData);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanyName = async () => {
    try {
      // Gets the name of the company from the companyID in job data
      const companySnapshot = await getDoc(doc(db, "companies", pageCompanyID)); // hardcoded, implement navigation and pass in the prop
      const companyData = companySnapshot.data();
      setCompanyName(companyData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobData();
    getCompanyName(); // try to fix this
  }, []);

  // For application statuses
  // 1. Get the array of applications from jobs
  // 2. Get the names of the applicants from userProfiles
  // 3. If the job ID exists for the user in applications, then display the applicant status

  // To change application status
  // 1. Recruiter will select from interview (green), viewed (orange), rejected (red), and pending (grey default)

  return (
    <Stack direction="row" alignItems="flex-start" justifyContent="center">
      {/* Job information */}
      <Box sx={{ p: 5, width: "90%" }}>
        <Card variant="outlined">
          <Box sx={{ m: 5 }}>
            <Box sx={{ pb: 4 }}>
              <Stack spacing={-0.5}>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Typography variant="h4">{job.title}</Typography>
                  <Button
                    variant="contained"
                    sx={{
                      m: 2,
                      textTransform: "none",
                      ml: { xs: 0, sm: "auto" },
                    }}
                  >
                    <Link
                      to={`/jobApplication/${job.companyID}/${pageJobID}`}
                      className="link"
                      underline="none"
                      style={{ textDecoration: "none" }}
                    >
                      {console.log("thiws is the job:", job)} Apply
                    </Link>
                  </Button>
                  <StarOutlineIcon />
                </Box>
                <Typography sx={{ fontSize: 18 }}>
                  {companyName.name}
                </Typography>
                <Typography
                  sx={{ fontSize: 18 }}
                >{`${job.city}, ${job.country}`}</Typography>
              </Stack>
              {job.deadline && (
                <Typography sx={{ fontSize: 16 }}>
                  {new Date(
                    (job.deadline.seconds ?? 0) * 1000 +
                      (job.deadline.nanoseconds ?? 0) / 1000000
                  ).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </Typography>
              )}
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
    </Stack>
  );
};

export default JobPosting;
