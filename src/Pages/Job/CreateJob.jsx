import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Divider } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  arrayUnion,
  writeBatch,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useParams, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import { auth, db } from "../../Firebase/firebase";

export const CreateJob = () => {
  const [jobInformation, setJobInformation] = React.useState({
    companyID: "",
    deadline: new Date(),
    description: "",
    country: "",
    city: "",
    owner: "",
    publishedAt: new Date(),
    requirement: "",
    title: "",
    benefits: "",
    resume: "",
    coverLetter: "",
    transcript: "",
  });
  const [companyName, setCompanyName] = React.useState({
    name: "",
  });

  async function handleSubmit() {
    // Here we are updating different document
    // With batch, either all of the updates succeed or none.
    // const batch = writeBatch(db);

    // const jobDocumentRef = doc(collection(db, "jobs2"));
    // batch.set(jobDocumentRef, jobInformation);

    // await batch.commit();
    await addDoc(collection(db, "jobs2"), {
      ...jobInformation,
    });

    // Query the DB to get the job ID
    const q1 = query(
      collection(db, "jobs2"),
      where("title", "==", jobInformation.title),
      where("companyID", "==", jobInformation.companyID),
      where("publishedAt", "==", jobInformation.publishedAt)
    );
    const jobIDSnapshots = await getDocs(q1);
    let jobID = "";
    // eslint-disable-next-line no-shadow
    jobIDSnapshots.forEach((doc) => {
      jobID = doc.id;
    });

    // Retrieve user information in order to properly create job suggestion notifications
    const titleArray = jobInformation.title.split(" ");
    const notificationsRef = collection(db, "notifications");

    const currentDate = new Date();
    for (let i = 0; i < titleArray.length; i += 1) {
      const q = query(
        notificationsRef,
        where("field", ">=", titleArray[i]),
        where("field", "<=", `${titleArray[i]}\uf7ff`)
      );
      const notificationSnapshots = getDocs(q);
      // eslint-disable-next-line no-loop-func
      notificationSnapshots.forEach(async (document) => {
        try {
          const notificationDocRef = doc(db, "notifications", document.id);
          const notificationJobSnapshot = getDoc(notificationDocRef);
          if (notificationJobSnapshot.data().notificationForJobs) {
            updateDoc(notificationDocRef, {
              notifications: arrayUnion(
                ...[
                  {
                    type: "jobs",
                    content: `New job suggestion: ${jobInformation.title} posted by ${companyName.name} in ${jobInformation.city}, ${jobInformation.country}`,
                    timestamp: currentDate,
                    link: `viewJobPosting/${jobInformation.companyID}/${jobID}`,
                  },
                ]
              ),
            });
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  // We need to include Recruiter ID & their company ID in the new Job
  async function getCompanyIDAndRecruiterID() {
    const recruiterRef = doc(db, "recruiters2", auth.currentUser.uid);
    const recruiterSnapshot = await getDoc(recruiterRef);
    if (recruiterSnapshot.exists()) {
      const companyID = recruiterSnapshot.data().workFor;
      if (companyID == null) {
        console.log("current recruiter's company ID not exist");
        return;
      }
      const companyRef = doc(db, "companies2", companyID);
      const companySnapshot = await getDoc(companyRef);
      if (companySnapshot.exists()) {
        setJobInformation({
          ...jobInformation,
          companyID,
          owner: auth.currentUser.uid,
        });
        setCompanyName({ name: companySnapshot.data().name });
      } else {
        console.log("current recruiter's company not exist");
      }
    } else {
      console.log("current user not a recruiter");
    }
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getCompanyIDAndRecruiterID();
      }
    });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Job Creation
        </Typography>
        {/* is this supposed to be a public comment? */}
        <Typography gutterBottom>
          This page has purpose of creating a new job posting. If you are logged
          in, and you are a Recruiter. Then, after you click SAVE, there should
          be a new document under jobs collection, and its id will be updated to
          your recruiter profile & the company profile.
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography>Job Title</Typography>
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
              placeholder="Company Name"
              fullWidth
              value={companyName.name}
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

          <Box>
            <Typography>Job description</Typography>
            {/*<TextField
              required
              id="TextField-Description"
              variant="standard"
              placeholder="Job Description"
              fullWidth
              multiline
              value={jobInformation.description}
              onChange={(e) =>
                setJobInformation({
                  ...jobInformation,
                  description: e.target.value,
                })
              }
            /> */}
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
            <Typography>Benefits</Typography>
            <TextField
              id="TextField-Benefits"
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
          <Divider />

          <Box>
            <Typography>
              Please specify which documents are required by candidates among
              the following. <br />
              (By default, documents are not required.)
            </Typography>
          </Box>

          <Box>
            <Typography>Resume</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={jobInformation.resume}
                  onChange={(e) =>
                    setJobInformation({
                      ...jobInformation,
                      resume: e.target.checked,
                    })
                  }
                />
              }
              label="required"
            />
          </Box>

          <Box>
            <Typography>Cover Letter</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={jobInformation.coverLetter}
                  onChange={(e) =>
                    setJobInformation({
                      ...jobInformation,
                      coverLetter: e.target.checked,
                    })
                  }
                />
              }
              label="required"
            />
          </Box>

          <Box>
            <Typography>Transcript</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={jobInformation.transcript}
                  onChange={(e) =>
                    setJobInformation({
                      ...jobInformation,
                      transcript: e.target.checked,
                    })
                  }
                />
              }
              label="required"
            />
          </Box>
        </Stack>

        <Link to="/myJobs">
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
export default CreateJob;
