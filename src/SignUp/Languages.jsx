import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material/";

const Languages = () => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "15vh" }}
    rowSpacing={1}
  >
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Language"
        variant="standard"
      />
    </Grid>

    <Grid>
      <p> Language proficiency</p>
      <FormGroup row>
        <FormControlLabel control={<Checkbox />} label="Fluent" />
        <FormControlLabel control={<Checkbox />} label="Intermediate" />
        <FormControlLabel control={<Checkbox />} label="Beginner" />
      </FormGroup>
    </Grid>
  </Grid>
);

export default Languages;
