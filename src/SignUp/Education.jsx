import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

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
        defaultValue="School"
        variant="standard"
      />
    </Grid>
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Degree"
        variant="standard"
      />
    </Grid>
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Program"
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
        defaultValue="End Date (Expected)"
        variant="standard"
      />
    </Grid>
    <Grid xs={12}>
      <TextField
        id="outlined-multiline-static"
        label="Courses"
        multiline
        rows={6}
        defaultValue="Default Value"
      />
    </Grid>
  </Grid>
);

export default Education;
