import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const Skills = () => (
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
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={6}
      />
    </Grid>
  </Grid>
);

export default Skills;
