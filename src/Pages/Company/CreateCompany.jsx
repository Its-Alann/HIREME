import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import * as React from "react";
import Container from "@mui/material/Container";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import Stack from "@mui/material/Stack";
import { db } from "../../Firebase/firebase";

export const CreateCompany = () => {
  const [companyInformation, setCompanyInformation] = React.useState({
    name: "",
  });

  async function handleSubmit() {
    // await addDoc(collection(db, "companies", companyInformation.name), {
    //   companyInformation,
    // });

    //Set document ID to company name
    const newDocRef = doc(db, "companies", companyInformation.name);
    await setDoc(newDocRef, companyInformation, { merge: true });
  }
  return (
    <Container maxWidth="md">
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Company Creation
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography>Company Name</Typography>
            <TextField
              required
              id="TextField-CompanyName"
              placeholder="Company Name"
              variant="standard"
              fullWidth
              value={companyInformation.name}
              onChange={(e) => setCompanyInformation({ name: e.target.value })}
            />
          </Box>
        </Stack>
        <Button
          variant="contained"
          id="ButtonSave"
          size="medium"
          sx={{ mt: 2 }}
          onClick={() => handleSubmit()}
        >
          Save
        </Button>
      </Box>
    </Container>
  );
};
export default CreateCompany;
