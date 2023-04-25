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
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import { auth, db } from "../../Firebase/firebase";

export const CreateJob = () => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

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
    resume: "",
    coverLetter: "",
    transcript: "",
    link: "",
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
    const userProfileRef = collection(db, "userProfiles");
    const currentDate = new Date();

    for (let i = 0; i < titleArray.length; i += 1) {
      const q = query(
        userProfileRef,
        where("field", ">=", titleArray[i]),
        where("field", "<=", `${titleArray[i]}\uf7ff`)
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
          {t("JobCreation")}
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography>{t("JobTitle")}</Typography>
            <TextField
              required
              id="TextField-Title"
              variant="standard"
              placeholder={t("JobTitle")}
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
            <Typography>{t("CompanyID")}</Typography>
            <TextField
              required
              id="TextField-CompanyID"
              variant="standard"
              placeholder={t("CompanyID")}
              fullWidth
              value={jobInformation.companyID}
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box>
            <Typography>{t("CompanyName")}</Typography>
            <TextField
              required
              id="TextField-CompanyName"
              variant="standard"
              placeholder={t("CompanyName")}
              fullWidth
              value={companyName.name}
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Stack direction="row" justifyContent="flex-start">
            <Box sx={{ pr: 2 }}>
              <Typography>{t("City")}</Typography>
              <TextField
                required
                id="TextField-City"
                variant="standard"
                placeholder={t("City")}
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
              <Typography>{t("Country")}</Typography>
              <TextField
                required
                id="TextField-Country"
                variant="standard"
                placeholder={t("Country")}
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
            <Typography>{t("Jobdescription")}</Typography>
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
            <Typography>{t("Jobrequirements")}</Typography>
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
            <Typography>{t("Benefits")}</Typography>
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
                label={t("ApplicationDeadline")}
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
              {t(
                "Pleasespecifywhichdocumentsarerequiredbycandidatesamongthefollowing."
              )}
              <br />
              {t("Bydefault,documentsarenotrequired.")}
            </Typography>
          </Box>

          <Box>
            <Typography>{t("Resume")}</Typography>
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
              label={t("required")}
            />
          </Box>

          <Box>
            <Typography>{t("CoverLetter")}</Typography>
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
              label={t("required")}
            />
          </Box>

          <Box>
            <Typography>{t("Transcript")}</Typography>
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
              label={t("required")}
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
            {t("Save")}
          </Button>
        </Link>
      </Box>
    </Container>
  );
};
export default CreateJob;
