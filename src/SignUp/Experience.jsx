import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControlLabel, Checkbox } from "@mui/material";

const Education = () => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "50vh" }}
    rowSpacing={1}
  >
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Company"
        variant="standard"
      />
    </Grid>
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Job Position"
        variant="standard"
      />
    </Grid>
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Location"
        variant="standard"
      />
    </Grid>
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Start Date"
        variant="standard"
      />

      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="End Date"
        variant="standard"
      />

      <FormControlLabel control={<Checkbox />} label="Currently working here" />
    </Grid>
    <Grid xs={12}>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={6}
      />
    </Grid>
  </Grid>
);

export default Education;
