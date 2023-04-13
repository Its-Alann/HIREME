import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useState } from "react";
import Container from "@mui/material/Container";
import { addDoc, collection } from "firebase/firestore";
import Stack from "@mui/material/Stack";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../Firebase/firebase";

export const CreateCompany = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [companyInformation, setCompanyInformation] = React.useState({
    name: "",
    logo: null, // new state for the uploaded logo file
  });
  async function handleSubmit() {
    // Upload the logo file to Firebase Storage
    const storageRef = ref(
      storage,
      `/company-logo/${companyInformation.logo.name}`
    );
    await uploadBytes(storageRef, companyInformation.logo).then(() => {
      getDownloadURL(storageRef)
        // eslint-disable-next-line no-shadow
        .then(async (url) => {
          setUrl(url);
          // Add the company information to the database
          await addDoc(collection(db, "companies2"), {
            name: companyInformation.name,
            logoPath: url, // Store the path to the uploaded logo file in the database
          });
        })
        .catch((error) => {
          console.log(error.message, "error getting the image url");
        });
    });
    navigate("/");
  }

  // update the state with the selected logo file
  function handleLogoChange(e) {
    setCompanyInformation({
      ...companyInformation,
      logo: e.target.files[0],
    });
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
              onChange={(e) =>
                setCompanyInformation({
                  ...companyInformation,
                  name: e.target.value,
                })
              }
            />
          </Box>
          <Box>
            <Typography>Company Logo</Typography>
            <input type="file" accept="image/*" onChange={handleLogoChange} />
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
