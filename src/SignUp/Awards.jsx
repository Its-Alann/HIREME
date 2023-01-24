import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const Awards = () => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "40vh" }}
    rowSpacing={1}
  >
    <Grid xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Title"
        variant="standard"
      />
    </Grid>

    <Grid xs={6}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Issuer"
        variant="standard"
      />
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Date"
        variant="standard"
      />
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

export default Awards;
