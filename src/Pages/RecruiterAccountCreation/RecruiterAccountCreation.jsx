import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import * as React from "react";
import { setDoc, collection, query, getDocs, doc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

export const RecruiterAccountCreation = () => {
  const [recruiterInformation, setRecruiterInformation] = React.useState({
    firstName: "",
    lastName: "",
    workFor: "",
  });
  const [companyList, setCompanyList] = React.useState([]);

  async function handleSubmit() {
    console.log(auth.currentUser.uid);
    await setDoc(
      doc(db, "recruiters", auth.currentUser.uid),
      recruiterInformation
    );
  }

  async function getCompanies() {
    const companiesRef = collection(db, "companies");
    const companiesQuery = query(companiesRef);
    const queryResultSnapshot = await getDocs(companiesQuery);
    const tempCompanyList = [];
    queryResultSnapshot.forEach((document) => {
      tempCompanyList.push({ id: document.id, label: document.data().name });
    });
    setCompanyList(tempCompanyList);
  }

  React.useEffect(() => {
    getCompanies();
  }, []);

  return (
    <Box>
      <Typography>Recruiter Account Creation</Typography>
      <Typography>Recruiter First Name</Typography>
      <TextField
        required
        id="TextField-FirstName"
        variant="standard"
        placeholder="Your First Name"
        fullWidth
        value={recruiterInformation.firstName}
        onChange={(e) =>
          setRecruiterInformation({
            ...recruiterInformation,
            firstName: e.target.value,
          })
        }
      />

      <Typography>Recruiter Last Name</Typography>
      <TextField
        required
        id="TextField-LastName"
        variant="standard"
        placeholder="Your Last Name"
        fullWidth
        value={recruiterInformation.lastName}
        onChange={(e) =>
          setRecruiterInformation({
            ...recruiterInformation,
            lastName: e.target.value,
          })
        }
      />

      <Autocomplete
        options={companyList}
        id="ComboBox-CompanyList"
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label="Choose a company"
            variant="standard"
          />
        )}
        onChange={(event, newValue) =>
          setRecruiterInformation({
            ...recruiterInformation,
            workFor: newValue.id,
          })
        }
      />
      <Button id="Button-Save" onClick={() => handleSubmit()}>
        Save
      </Button>
    </Box>
  );
};
export default RecruiterAccountCreation;
