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
  // declaring  the useStates and useParams
  const pageID = useParams();
  const pageCompanyID = useParams().companyID;
  const pageJobID = useParams().jobID;

  const [job, setJob] = React.useState([]);
  const [companyName, setCompanyName] = React.useState({});
  const [companiesLogo, setCompaniesLogo] = React.useState({});

  // makes a getDoc of the jobs collection based on the jobID
  // sets the job to the JobData
  const getJobData = async () => {
    try {
      // Gets the job data using the jobID from the URL
      const jobsSnapshot = await getDoc(doc(db, "jobs2", pageJobID));
      //console.log(pageJobID);
      const jobData = jobsSnapshot.data();
      setJob(jobData);

      //console.log(jobData);
    } catch (error) {
      console.log(error);
    }
  };

  // gets the coompany name froom the coompanies collection based on the coompanyID
  const getCompanyName = async () => {
    try {
      const companySnapshot = await getDoc(
        doc(db, "companies2", pageCompanyID)
      );
      const companyData = companySnapshot.data();
      setCompanyName(companyData);
      if (companyData.logoPath === "") {
        companyData.logoPath =
          "https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FHIREME_whitebg.png?alt=media&token=c621d215-a3db-4557-8c06-1618905b5ab0";
      }
      setCompaniesLogo(companyData.logoPath);
    } catch (error) {
      console.log(error);
    }
  };

  // calling 2 methods
  useEffect(() => {
    getJobData();
    getCompanyName();
  }, []);

  // returns the job posting with the apply button
  // clicking on the apply button will take the user to the apply page
  if (job === undefined)
    return (
      <h3 style={{ textAlign: "center" }}>
        This job has been removed by the employer :/
      </h3>
    );
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
                  <Stack direction="row" alignItems="center">
                    <Box
                      component="img"
                      sx={{
                        // objectFit: "cover",
                        width: "6rem",
                        height: "6rem",
                        mr: 2,
                      }}
                      src={companiesLogo}
                    />
                    <Box>
                      <Typography variant="h4">{job.title}</Typography>
                      <Typography sx={{ fontSize: 18 }}>
                        {companyName.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 18 }}
                      >{`${job.city}, ${job.country}`}</Typography>
                      {job.deadline && (
                        <Typography sx={{ fontSize: 16 }}>
                          Deadline:{" "}
                          {new Date(
                            job.deadline.seconds * 1000 +
                              job.deadline.nanoseconds / 1000000
                          ).toDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  {/*  apply button which allowes a user to be sent to an apply page */}
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
                      {/* {console.log("thiws is the job:", job)}*/}
                      Apply
                    </Link>
                  </Button>
                  <StarOutlineIcon />
                </Box>
              </Stack>
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
              <Box>
                <Typography sx={{ fontSize: 20 }}>Benefits</Typography>
                <Typography>{job.benefits}</Typography>
              </Box>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Stack>
  );
};

export default JobPosting;
