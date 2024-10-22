import {
  Box,
  Button,
  Typography,
  TextField,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase";

export const EditJob = () => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  // We are passing the jobID in url
  // get it here
  const { jobID } = useParams();

  const [thirdPartyLink, setThirdPartyLink] = React.useState(false);
  const [jobInformation, setJobInformation] = React.useState({
    companyID: "",
    deadline: new Date(),
    description: "",
    owner: "",
    country: "",
    city: "",
    publishedAt: new Date(),
    requirement: "",
    title: "",
    benefits: "",
    resume: "",
    coverLetter: "",
    transcript: "",
    link: "",
  });
  const [companyName, setCompanyName] = React.useState("");

  async function getJob() {
    const jobRef = doc(db, "jobs2", jobID);
    const jobSnapshot = await getDoc(jobRef);
    console.log(jobSnapshot.data());
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
      const companyRef = doc(db, "companies2", jobInformation.companyID);
      const companySnapshot = await getDoc(companyRef);
      if (companySnapshot.exists()) {
        setCompanyName(companySnapshot.data().name);
      } else {
        console.log("Company with Company ID not found");
      }
    }
  }

  async function handleSubmit() {
    const jobRef = doc(db, "jobs2", jobID);
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
    if (jobInformation.link !== "") {
      setThirdPartyLink(true);
    }
  }, [jobInformation]);

  return (
    <Container maxWidth="md" sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          {t("EditJob")}
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography>{t("Title")}</Typography>
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
              value={companyName}
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
            <Typography>{t("Jobbenefits")}</Typography>
            <TextField
              required
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
              )}{" "}
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
            {t("Save")}
          </Button>
        </Link>
      </Box>
    </Container>
  );
};
export default EditJob;
