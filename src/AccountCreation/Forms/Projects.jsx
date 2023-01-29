import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const Projects = () => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "25vh" }}
    rowSpacing={1}
  >
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Project Title"
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

export default Projects;