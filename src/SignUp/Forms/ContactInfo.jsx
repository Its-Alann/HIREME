import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const ContactInfo = () => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "35vh" }}
    rowSpacing={1}
  >
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Phone number"
        variant="standard"
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Address"
        variant="standard"
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="City"
        variant="standard"
      />

      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Country"
        variant="standard"
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Postal Code"
        variant="standard"
      />

      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Date of birth"
        variant="standard"
      />
    </Grid>
  </Grid>
);

export default ContactInfo;
