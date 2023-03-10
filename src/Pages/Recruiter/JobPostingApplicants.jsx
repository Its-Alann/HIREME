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
  const pageCompanyID = useParams().companyID;
  const pageJobID = useParams().jobID;

  const [job, setJob] = React.useState([]);
  const [companyName, setCompanyName] = React.useState({});
  const [applicants, setApplicants] = React.useState({});

  const getJobData = async () => {
    try {
      // Gets the job data using the jobID from the URL
      const jobsSnapshot = await getDoc(doc(db, "jobs", pageJobID)); // hardcoded, implement navigation and pass in the prop
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

  const getApplicationStatuses = async () => {
    const listOfApplicants = job.applicants;
    console.log(listOfApplicants);

    const tempArray = [];

    if (listOfApplicants != null) {
      await Promise.all(
        listOfApplicants.map(async (applicant) => {
          const applicantSnapshot = await getDoc(
            doc(db, "applications", applicant)
          );
          const applicantApplications = applicantSnapshot.data().jobs;

          const applicantNameSnapshot = await getDoc(
            doc(db, "userProfiles", applicant)
          );

          let applicationStatus = "";
          applicantApplications.forEach((jobApplication) => {
            if (jobApplication.jobID === pageJobID) {
              applicationStatus = jobApplication.status;
            }
          });

          tempArray.push({
            applicantStatus: applicationStatus,
            applicantFirstName: applicantNameSnapshot.data().values.firstName,
            applicantLasttName: applicantNameSnapshot.data().values.lastName,
          });
        })
      );
    } else {
      console.log("no applicants");
    }
    setApplicants(tempArray);
    // console.log(tempArray);
  };

  useEffect(() => {
    getJobData();
    getCompanyName(); // try to fix this
  }, []);

  useEffect(() => {
    getApplicationStatuses();
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
      <Box sx={{ width: 700, p: 5 }}>
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
      <Box sx={{ width: 500, p: 5 }}>
        <Card variant="outlined">
          <Box sx={{ m: 2 }}>
            <Box sx={{ pb: 2 }}>
              <Typography variant="h4">Applicants</Typography>

              {applicants.map((applicant) => {
                const hello = "hello";

                return (
                  <Stack direction="row">
                    <Typography>
                      {`${applicant.applicantFirstName} ${applicant.applicantLastName}`}
                    </Typography>

                    <Typography>{applicant.applicantStatus}</Typography>
                  </Stack>
                );
              })}
              {console.log(applicants)}
              {console.log(typeof applicants)}
            </Box>
          </Box>
        </Card>
      </Box>
    </Stack>
  );
};

export default JobPostingApplicants;
