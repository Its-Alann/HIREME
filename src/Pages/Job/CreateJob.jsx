import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
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
} from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

export const CreateJob = () => {
  const [jobInformation, setJobInformation] = React.useState({
    companyID: "",
    deadline: new Date(),
    description: "",
    location: "",
    owner: "",
    publishedAt: new Date(),
    requirement: "",
    title: "",
  });
  const [companyName, setCompanyName] = React.useState({
    name: "",
  });

  async function handleSubmit() {
    // Here we are updating different document
    // With batch, either all of the updates succeed or none.
    const batch = writeBatch(db);

    const jobDocumentRef = doc(collection(db, "jobs"));
    batch.set(jobDocumentRef, jobInformation);

    const recruiterRef = doc(db, "recruiters", auth.currentUser.uid);
    batch.update(recruiterRef, {
      jobs: arrayUnion({
        jobID: jobDocumentRef.id,
        publishedAt: jobInformation.publishedAt,
      }),
    });

    const companyRef = doc(db, "companies", jobInformation.companyID);
    batch.update(companyRef, {
      jobs: arrayUnion({
        jobID: jobDocumentRef.id,
        publishedAt: jobInformation.publishedAt,
      }),
    });
    await batch.commit();
  }

  // We need to include Recruiter ID & their company ID in the new Job
  async function getCompanyIDAndRecruiterID() {
    const recruiterRef = doc(db, "recruiters", auth.currentUser.uid);
    const recruiterSnapshot = await getDoc(recruiterRef);
    if (recruiterSnapshot.exists()) {
      const companyID = recruiterSnapshot.data().workFor;
      if (companyID == null) {
        console.log("current recruiter's company ID not exist");
        return;
      }
      const companyRef = doc(db, "companies", companyID);
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
    <Box>
      <Typography>Job Creation</Typography>
      <Typography>
        This page has purpose of creating a new job posting. If you are logged
        in, and you are a Recruiter. Then, after you click SAVE, there should be
        a new document under jobs collection, and its id will be updated to your
        recruiter profile & the company profile.
      </Typography>
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

      <Typography>Description</Typography>
      <TextField
        required
        id="TextField-Description"
        variant="standard"
        placeholder="Job Description"
        fullWidth
        value={jobInformation.description}
        onChange={(e) =>
          setJobInformation({
            ...jobInformation,
            description: e.target.value,
          })
        }
      />

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

      <Typography>Company Name</Typography>
      <TextField
        required
        id="TextField-CompanyName"
        variant="standard"
        placeholder="Company ID"
        fullWidth
        value={companyName.name}
        InputProps={{ readOnly: true }}
      />

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

      <Typography>Requirement</Typography>
      <TextField
        required
        id="TextField-Requirement"
        variant="standard"
        placeholder="Location"
        fullWidth
        value={jobInformation.requirement}
        onChange={(e) =>
          setJobInformation({
            ...jobInformation,
            requirement: e.target.value,
          })
        }
      />

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
      <Button id="Button-Save" onClick={() => handleSubmit()}>
        Save
      </Button>
    </Box>
  );
};
export default CreateJob;
