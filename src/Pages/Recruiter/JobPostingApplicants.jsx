import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Modal,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import * as React from "react";
import {
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { db } from "../../Firebase/firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const JobPostingApplicants = () => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const pageCompanyID = useParams().companyID;
  const pageJobID = useParams().jobID;

  const [job, setJob] = useState([]);
  const [companyName, setCompanyName] = useState({});
  const [applicants, setApplicants] = useState([]);

  const [selectedApplicantStatus, setSelectedApplicantStatus] = useState("");
  const [selectedApplicantName, setSelectedApplicantName] = useState("");
  const [selectedApplicantEmail, setSelectedApplicantEmail] = useState("");
  const [selectedApplicantDocID, setSelectedApplicantDocID] = useState("");
  const [changedApplicationStatus, setChangedApplicationStatus] = useState("");
  const [companiesLogo, setCompaniesLogo] = React.useState({});

  const [open, setOpen] = useState(false);
  const [checkedResume, setCheckedResume] = React.useState("");
  const [checkedCoverLetter, setCheckedCoverLetter] = React.useState("");
  const [checkedTranscript, setCheckedTranscript] = React.useState("");
  const [thirdPartyLink, setThirdPartyLink] = React.useState("");

  const [openRemoveJob, setOpenRemoveJob] = useState(false);
  const tempArray2 = [];

  const getApplicationStatuses = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "applications2"), where("jobID", "==", pageJobID))
    );

    const tempArray = querySnapshot.docs.map((docJob) => ({
      id: docJob.id,
      applicantEmail: docJob.data().applicantEmail,
      applicationStatus: docJob.data().status,
    }));

    if (applicants != null) {
      await Promise.all(
        tempArray.map(async (applicant) => {
          const applicantNameSnapshot = await getDoc(
            doc(db, "userProfiles", applicant.applicantEmail)
          );

          tempArray2.push({
            applicantID: applicant.id,
            applicantStatus: applicant.applicationStatus,
            applicantFirstName: applicantNameSnapshot.data().values.firstName,
            applicantLastName: applicantNameSnapshot.data().values.lastName,
            applicantEmail: applicant.applicantEmail,
          });
        })
      );
    } else {
      console.log("no applicants");
    }

    setApplicants(tempArray2);
  };

  const getJobData = async () => {
    try {
      // Gets the job data using the jobID from the URL
      const jobsSnapshot = await getDoc(doc(db, "jobs2", pageJobID));
      const jobData = jobsSnapshot.data();
      setJob(jobData);
      if (jobData.resume === true) {
        setCheckedResume("Required");
      } else {
        setCheckedResume("Optional");
      }
      if (jobData.coverLetter === true) {
        setCheckedCoverLetter("Required");
      } else {
        setCheckedCoverLetter("Optional");
      }
      if (jobData.transcript === true) {
        setCheckedTranscript("Required");
      } else {
        setCheckedTranscript("Optional");
      }
      if (jobData.link !== "") {
        setThirdPartyLink(jobData.link);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanyName = async () => {
    try {
      // Gets the name of the company from the companyID in job data
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

  // Handle modal operations for remove job
  // 1. Recruiter will select from interview (green), viewed (orange), rejected (red), and pending (grey default)
  const handleOpen = (status, fName, lName, email, docID) => {
    setSelectedApplicantStatus(status);
    setSelectedApplicantName(`${fName} ${lName}`);
    setSelectedApplicantEmail(email);
    setSelectedApplicantDocID(docID);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleStatusChange = (event) => {
    setChangedApplicationStatus(event.target.value);
  };

  const handleSubmit = async () => {
    setSelectedApplicantStatus(changedApplicationStatus);

    // 1. Get changed application status and applicant id
    const newApplicationStatus = changedApplicationStatus;
    const jobId = pageJobID;
    const applicantEmail = selectedApplicantEmail;
    const applicantDocID = selectedApplicantDocID;

    // Create a notification for the applicant
    const notificationDocRef = doc(db, "notifications", applicantEmail);
    let notificationJobSnapshot = await getDoc(notificationDocRef);
    const currentDate = new Date();

    // Check if document exists in the db
    if (notificationJobSnapshot.exists()) {
      console.log("Notification document exists for this user");
    } else {
      console.log("Notification document does not exist for this user");
      console.log("Creating notification document for this user!");
      // Add user email to notifications collection
      await setDoc(doc(db, "notifications", applicantEmail), {
        notifications: [],
        notificationForJobs: true,
        notificationForConnections: true,
      });
      notificationJobSnapshot = await getDoc(notificationDocRef);
    }

    // Check if user has notifications ON or OFF for jobs
    if (notificationJobSnapshot.data().notificationForJobs === true) {
      await updateDoc(notificationDocRef, {
        notifications: arrayUnion(
          ...[
            {
              type: "job alert",
              content: `Your application for "${job.title}", from ${companyName.name}, has been updated!`,
              timestamp: currentDate,
            },
          ]
        ),
      });
    }

    const querySnapshot = await getDocs(
      query(
        collection(db, "applications2"),
        where("applicantEmail", "==", applicantEmail)
      )
    );
    querySnapshot.forEach(async (docApplicant) => {
      let applicantApplications = docApplicant.data();
      const applicationStatusToUpdate = {
        address: applicantApplications.address,
        applicantEmail,
        email: applicantApplications.email,
        jobID: jobId,
        phoneNumber: applicantApplications.phoneNumber,
        status: newApplicationStatus,
      };
      applicantApplications = applicationStatusToUpdate;
      const applicantRef = doc(db, "applications2", applicantDocID);

      // Update the database with the new status
      await updateDoc(applicantRef, applicantApplications)
        .then(() => {
          console.log("Status updated successfully!");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating status", error);
        });

      console.log(applicantEmail);
    });
  };

  // Remove job dialog
  const handleOpenRemoveJob = () => {
    setOpenRemoveJob(true);
  };

  const handleCloseRemoveJob = () => {
    setOpenRemoveJob(false);
  };

  // Remove job from backend
  const removeJobAndApplicants = async () => {
    const jobId = pageJobID;

    const querySnapshot = await getDocs(
      query(collection(db, "applications2"), where("jobID", "==", jobId))
    );

    const tempArray = querySnapshot.docs.map((docJob) => ({
      id: docJob.id,
    }));

    await Promise.all(
      tempArray.map(async (docJob) => {
        await deleteDoc(doc(db, "applications2", docJob.id));
      })
    );
    await deleteDoc(doc(db, "jobs2", jobId));
    navigate("/myJobs");
  };

  useEffect(() => {
    Promise.all([getJobData(), getCompanyName(), getApplicationStatuses()])
      .then(() => {
        console.log("Finished loading data");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Grid container direction="row" alignItems="flex-start" justify="center">
      {/* Job information */}
      <Grid xs={12} sm={12} md={6}>
        <Stack spacing={2}>
          <Box sx={{ px: 5, pt: 5 }}>
            <Card variant="outlined">
              <Box sx={{ m: 2 }}>
                <Box sx={{ pb: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Grid
                      container
                      spacing={-0.5}
                      direction="row"
                      alignItems="center"
                    >
                      <Grid>
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
                      </Grid>
                      <Grid>
                        <Box xs={12} sm={12} md={6}>
                          <Typography
                            variant="h4"
                            sx={{
                              maxWidth: "1000px",
                              overflow: "hidden",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                            }}
                          >
                            {job.title}
                          </Typography>
                          <Typography sx={{ fontSize: 18 }}>
                            {companyName.name}
                          </Typography>
                          <Typography sx={{ fontSize: 18 }}>
                            {`${job.city}, ${job.country}`}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box>
                      <Link
                        to={{
                          pathname: `/editJob/${pageJobID}`,
                        }}
                      >
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton onClick={handleOpenRemoveJob}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Box>
                  </Stack>

                  <Dialog
                    open={openRemoveJob}
                    onClose={handleCloseRemoveJob}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {t("Areyousureyouwouldliketoremovethejobposting?")}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        {t(
                          "Thisjobpostingwillberemovedcompletely.Alldatarelatedtothispostwillbeerased."
                        )}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseRemoveJob}>
                        {t("Cancel")}
                      </Button>
                      <Button
                        sx={{ color: "red" }}
                        onClick={removeJobAndApplicants}
                        autoFocus
                      >
                        {t("Remove")}
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {job.deadline && (
                    <Typography sx={{ fontSize: 16, color: "#8B8B8B" }}>
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
                    <Typography sx={{ fontSize: 20 }}>
                      {t("Aboutthejob")}
                    </Typography>
                    <Typography>{job.description}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 20 }}>
                      {t("Requirements")}
                    </Typography>
                    <Typography>{job.requirement}</Typography>
                  </Box>
                  <Box sx={{ pb: 2 }}>
                    <Typography sx={{ fontSize: 20 }}>
                      {t("Benefits")}
                    </Typography>
                    <Typography>{job.benefits}</Typography>
                  </Box>
                </Stack>

                <Divider />
                <Stack spacing={2}>
                  <Box sx={{ pt: 2 }}>
                    <Typography sx={{ fontSize: 20 }}>{t("Resume")}</Typography>
                    <Typography>{checkedResume}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 20 }}>
                      {t("CoverLetter")}
                    </Typography>
                    <Typography>{checkedCoverLetter}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 20 }}>
                      {t("Transcript")}
                    </Typography>
                    <Typography>{checkedTranscript}</Typography>
                  </Box>
                  {thirdPartyLink !== "" && (
                    <Box>
                      <Typography sx={{ fontSize: 20 }}>
                        Third Party Link
                      </Typography>
                      <Typography>{thirdPartyLink}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Card>
          </Box>
        </Stack>
      </Grid>

      {/* List of applicants and their statuses */}
      <Grid xs={12} sm={12} md={6}>
        <Box sx={{ p: 5 }}>
          <Card variant="outlined">
            <Box sx={{ m: 2 }}>
              <Box sx={{ pb: 2 }}>
                <Typography variant="h4">{t("Applicants")}</Typography>
                {applicants !== null && applicants.length > 0 ? (
                  applicants.map((applicant) => {
                    const hello = "hello";
                    return (
                      <Stack
                        display="flex"
                        direction="row"
                        alignItems="center"
                        justifyContent="space-evenly"
                        sx={{ my: 1 }}
                      >
                        <Box sx={{ width: 150 }}>
                          <Typography>
                            {`${applicant.applicantFirstName} ${applicant.applicantLastName}`}
                          </Typography>
                        </Box>

                        <Card>
                          <CardActionArea
                            onClick={() =>
                              handleOpen(
                                applicant.applicantStatus,
                                applicant.applicantFirstName,
                                applicant.applicantLastName,
                                applicant.applicantEmail,
                                applicant.applicantID
                              )
                            }
                          >
                            <CardContent
                              sx={{
                                display: "flex",
                                height: 5,
                                width: 200,
                                textAlign: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFFFFF",
                                backgroundColor: () => {
                                  switch (applicant.applicantStatus) {
                                    case "interview":
                                      return "#17A500";
                                    case "rejected":
                                      return "#8F0000";
                                    case "viewed":
                                      return "#DE8B50";
                                    default: // pending
                                      return "#A9A9A9";
                                  }
                                },
                              }}
                            >
                              <Typography sx={{ textTransform: "uppercase" }}>
                                {applicant.applicantStatus === "interview"
                                  ? t("Interview")
                                  : applicant.applicantStatus === "viewed"
                                  ? t("Viewed")
                                  : applicant.applicantStatus === "rejected"
                                  ? t("Rejected")
                                  : t("Pending")}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Stack>
                    );
                  })
                ) : (
                  <Typography>{t("Noapplicants")}</Typography>
                )}
              </Box>
            </Box>
          </Card>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography variant="h6" component="h2">
              {t("Changeapplicationstatusfor")}
              {selectedApplicantName}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {t("Thecurrentstatusis")} {selectedApplicantStatus}
            </Typography>
            <Stack direction="row" display="flex" alignItems="center">
              <Typography sx={{ mr: 2 }}>
                {t("Changeapplicationstatusto")}
              </Typography>
              <Select
                value={changedApplicationStatus}
                onChange={handleStatusChange}
              >
                <MenuItem value="interview">{t("Interview")}</MenuItem>
                <MenuItem value="viewed">{t("Viewed")}</MenuItem>
                <MenuItem value="rejected">{t("Rejected")}</MenuItem>
              </Select>
            </Stack>
            <Button onClick={handleSubmit}>{t("Submit")}</Button>
          </Box>
        </Modal>
      </Grid>
    </Grid>
  );
};

export default JobPostingApplicants;
