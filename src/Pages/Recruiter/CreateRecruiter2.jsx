import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import * as React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { setDoc, collection, query, getDocs, doc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

export const CreateRecruiter2 = () => {
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
    <Container maxWidth="md">
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Recruiter Account Creation 2
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography>Recruiter First Name</Typography>
            <TextField
              required
              id="TextField-FirstName"
              variant="standard"
              placeholder="First Name"
              fullWidth
              value={recruiterInformation.firstName}
              onChange={(e) =>
                setRecruiterInformation({
                  ...recruiterInformation,
                  firstName: e.target.value,
                })
              }
            />
          </Box>

          <Box>
            <Typography>Recruiter Last Name</Typography>
            <TextField
              required
              id="TextField-LastName"
              variant="standard"
              placeholder="Last Name"
              fullWidth
              value={recruiterInformation.lastName}
              onChange={(e) =>
                setRecruiterInformation({
                  ...recruiterInformation,
                  lastName: e.target.value,
                })
              }
            />
          </Box>

          <Box>
            <Typography>Company</Typography>
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
            <a href="/createCompany">Company does not exist yet?</a>
          </Box>
        </Stack>
        <Link to="/">
          <Button
            variant="contained"
            id="Button-Save"
            size="medium"
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
export default CreateRecruiter2;
