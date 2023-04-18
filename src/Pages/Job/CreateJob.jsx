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
  arrayUnion,
  writeBatch,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useParams, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import { auth, db } from "../../Firebase/firebase";

export const CreateJob = () => {
  const [thirdPartyLink, setThirdPartyLink] = React.useState(false);
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
    resume: false,
    coverLetter: false,
    transcript: false,
    link: "",
  });
  const [companyName, setCompanyName] = React.useState({
    name: "",
  });
  const [isAllowed, setIsAllowed] = React.useState(false);

  async function handleSubmit() {
    // Here we are updating different document
    // By creating a job.
    // First add a new document in the collection jobs
    // Then update the document in companies
    const newJobRef = doc(collection(db, "jobs2"));
    // const batch = writeBatch(db);
    // batch.set(doc(db, "jobs2", newJobRef.id), {
    //   ...jobInformation,
    // });
    await setDoc(newJobRef, { ...jobInformation });

    // // Query the DB to get the job ID
    // const q1 = query(
    //   collection(db, "jobs2"),
    //   where("title", "==", jobInformation.title),
    //   where("companyID", "==", jobInformation.companyID),
    //   where("publishedAt", "==", jobInformation.publishedAt)
    // );
    // const jobIDSnapshots = await getDocs(q1);
    // let jobID = "";
    // // eslint-disable-next-line no-shadow
    // jobIDSnapshots.forEach((doc) => {
    //   jobID = doc.id;
    // });

    // Retrieve user information in order to properly create job suggestion notifications
    // For example: job title is Senior Software Developper
    // Then it will send notifications to all users, whose field begin with "Senior" or "Software" or "Developper"
    // That means, field of userProfiles should be a string with no space
    // (because doesn't matter he put "Software Tester" or "Software Manager" or "Senior Gamer", we are only checking if it starts with "Software" or "Senior" or "Developer")
    // (because titleArray is an array of single words)
    const titleArray = jobInformation.title.split(" ");
    const userProfileRef = collection(db, "userProfiles");
    const currentDate = new Date();

    for (let i = 0; i < titleArray.length; i += 1) {
      const q = query(
        userProfileRef,
        where("field", ">=", titleArray[i]),
        where("field", "<", `${titleArray[i]}\uf7ff`)
      );
      // eslint-disable-next-line no-await-in-loop
      const userProfileSnapShot = await getDocs(q);
      // eslint-disable-next-line no-loop-func
      userProfileSnapShot.forEach(async (document) => {
        try {
          console.log(`Sending notification to ${document.id}`);
          const notificationDocRef = doc(db, "notifications", document.id);
          const notificationJobSnapshot = await getDoc(notificationDocRef);
          if (notificationJobSnapshot.data().notificationForJobs === true) {
            updateDoc(notificationDocRef, {
              notifications: arrayUnion({
                type: "jobs",
                content: `New job suggestion: ${jobInformation.title} posted by ${companyName.name} in ${jobInformation.city}, ${jobInformation.country}`,
                timestamp: currentDate,
                link: `viewJobPosting/${jobInformation.companyID}/${newJobRef.id}`,
              }),
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
        setIsAllowed(false);
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
        setIsAllowed(true);
      } else {
        console.log("current recruiter's company not exist");
        setIsAllowed(false);
      }
    } else {
      console.log("current user not a recruiter");
      setIsAllowed(false);
    }
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getCompanyIDAndRecruiterID();
      }
    });
  }, []);

  return isAllowed ? (
    <Container maxWidth="md" sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Job Creation
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

          <Box>
            <Typography>Link to third party application</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  name="thirdPartyCheck"
                  checked={thirdPartyLink}
                  onChange={() => {
                    if (thirdPartyLink) {
                      setJobInformation({
                        ...jobInformation,
                        link: "",
                      });
                    }
                    setThirdPartyLink(!thirdPartyLink);
                  }}
                />
              }
              label="This application requires a link to a third party website for application"
              labelPlacement="end"
            />
            {thirdPartyLink && (
              <TextField
                required
                id="TextField-thirdParty"
                variant="standard"
                placeholder="https://www.glassdoor.com"
                fullWidth
                value={jobInformation.link}
                onChange={(e) =>
                  setJobInformation({
                    ...jobInformation,
                    link: e.target.value,
                  })
                }
              />
            )}
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
                  name="resumeCheck"
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
                  name="coverCheck"
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
                  name="transcriptCheck"
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

        <Link to="/">
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
  ) : (
    <p>
      You are not allowed to create new job, please check your recruiter
      information
    </p>
  );
};
export default CreateJob;
