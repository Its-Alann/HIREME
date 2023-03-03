import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

async function handleSubmit(companyInformation) {
  await addDoc(collection(db, "companies"), companyInformation);
}
export const CompanyCreation = () => {
  const [companyName, setCompanyName] = React.useState("Company Name");
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
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <Button
        id="ButtonSave"
        onClick={() => handleSubmit({ name: companyName })}
      >
        Save
      </Button>
    </Box>
  );
};
export default CompanyCreation;
