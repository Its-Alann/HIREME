import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const Volunteering = () => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "30vh" }}
    rowSpacing={1}
  >
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Organization"
        variant="standard"
      />
    </Grid>

    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Date"
        variant="standard"
      />
    </Grid>

    <Grid>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={6}
      />
    </Grid>
  </Grid>
);

export default Volunteering;
