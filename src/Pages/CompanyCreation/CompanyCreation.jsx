import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

export const CompanyCreation = () => {
  const [companyInformation, setCompanyInformation] = React.useState({
    name: "",
  });
  async function handleSubmit() {
    await addDoc(collection(db, "companies"), companyInformation);
  }
  return (
    <Box>
      <Typography>Company Creation</Typography>
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
      <Button id="ButtonSave" onClick={() => handleSubmit()}>
        Save
      </Button>
    </Box>
  );
};
export default CompanyCreation;
