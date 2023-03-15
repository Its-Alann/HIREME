import {
  Box,
  Button,
  Typography,
  TextField,
  Container,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase";

export const EditJob = () => {
  // We are passing the jobID in url
  // get it here
  const { jobID } = useParams();

  const [jobInformation, setJobInformation] = React.useState({
    companyID: "",
    deadline: new Date(),
    description: "",
    location: "",
    owner: "",
    country: "",
    city: "",
    publishedAt: new Date(),
    requirement: "",
    title: "",
    benefits: "",
  });
  const [companyName, setCompanyName] = React.useState("");

  async function getJob() {
    const jobRef = doc(db, "jobs", jobID);
    const jobSnapshot = await getDoc(jobRef);
    if (jobSnapshot.exists()) {
      setJobInformation({
        ...jobSnapshot.data(),
        deadline: jobSnapshot.data().deadline.toDate(),
      });
    } else {
      console.log("Job with Job ID not found");
    }
  }

  async function getCompanyName() {
    if (jobInformation.companyID) {
      const companyRef = doc(db, "companies", jobInformation.companyID);
      const companySnapshot = await getDoc(companyRef);
      if (companySnapshot.exists()) {
        setCompanyName(companySnapshot.data().name);
      } else {
        console.log("Company with Company ID not found");
      }
    }
  }

  async function handleSubmit() {
    const jobRef = doc(db, "jobs", jobID);
    await updateDoc(jobRef, jobInformation);
  }

  // when auth change, get the list of job id from recruiter
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getJob();
      }
    });
  }, []);

  React.useEffect(() => {
    getCompanyName();
  }, [jobInformation]);

  return (
    <Container maxWidth="md" sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Edit Job
        </Typography>
        <Typography>
          This Page shows a single Job@aposs information & allow the owner to
          edit them
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography>Title</Typography>
            <TextField
              required
              id="TextField-Title"
              variant="standard"
              placeholder="Job Title"
              fullWidth
              value={jobInformation.title}
              onChange={(e) =>
                setJobInformation({
                  ...jobInformation,
                  title: e.target.value,
                })
              }
            />
          </Box>

          <Box>
            <Typography>Company ID</Typography>
            <TextField
              required
              id="TextField-CompanyID"
              variant="standard"
              placeholder="Company ID"
              fullWidth
              value={jobInformation.companyID}
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box>
            <Typography>Company Name</Typography>
            <TextField
              required
              id="TextField-CompanyName"
              variant="standard"
              placeholder="Company ID"
              fullWidth
              value={companyName}
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Stack direction="row" justifyContent="flex-start">
            <Box sx={{ pr: 2 }}>
              <Typography>City</Typography>
              <TextField
                required
                id="TextField-City"
                variant="standard"
                placeholder="City"
                fullWidth
                value={jobInformation.city}
                onChange={(e) =>
                  setJobInformation({
                    ...jobInformation,
                    city: e.target.value,
                  })
                }
              />
            </Box>

            <Box>
              <Typography>Country</Typography>
              <TextField
                required
                id="TextField-Country"
                variant="standard"
                placeholder="Country"
                fullWidth
                value={jobInformation.country}
                onChange={(e) =>
                  setJobInformation({
                    ...jobInformation,
                    country: e.target.value,
                  })
                }
              />
            </Box>
          </Stack>

          {/* <Box>
            <Typography>Location</Typography>
            <TextField
              required
              id="TextField-Location"
              variant="standard"
              placeholder="Location"
              fullWidth
              value={jobInformation.location}
              onChange={(e) =>
                setJobInformation({
                  ...jobInformation,
                  location: e.target.value,
                })
              }
            />
          </Box> */}

          <Box>
            <Typography>Job description</Typography>
            <TextField
              required
              id="TextField-Description"
              fullWidth
              multiline
              rows={4}
              value={jobInformation.description}
              onChange={(e) =>
                setJobInformation({
                  ...jobInformation,
                  description: e.target.value,
                })
              }
            />
          </Box>

          <Box>
            <Typography>Job requirements</Typography>
            <TextField
              required
              id="TextField-Requirement"
              fullWidth
              multiline
              rows={2}
              value={jobInformation.requirement}
              onChange={(e) =>
                setJobInformation({
                  ...jobInformation,
                  requirement: e.target.value,
                })
              }
            />
          </Box>
          <Box>
            <Typography>Job benefits</Typography>
            <TextField
              required
              id="TextField-Requirement"
              fullWidth
              multiline
              rows={2}
              value={jobInformation.benefits}
              onChange={(e) =>
                setJobInformation({
                  ...jobInformation,
                  benefits: e.target.value,
                })
              }
            />
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="DatePicker-Deadline"
                label="Application Deadline"
                value={jobInformation.deadline}
                onChange={(newValue) => {
                  setJobInformation({
                    ...jobInformation,
                    deadline: newValue.$d,
                  });
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Stack>
        <Link
          to={`/viewJobPostingApplicants/${jobInformation.companyID}/${jobID}`}
        >
          <Button
            variant="contained"
            size="medium"
            id="Button-Save"
            sx={{ mt: 2 }}
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
        </Link>
      </Box>
    </Container>
  );
};
export default EditJob;
