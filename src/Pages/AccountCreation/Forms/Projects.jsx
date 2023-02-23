import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const Projects = ({ setProject, setProjectDesc, values }) => (
  <Grid
    id="formGrid"
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "32vh" }}
    rowSpacing={2}
  >
    <Grid item xs={12}>
      <TextField
        id="standard-required"
        placeholder="Project Title"
        variant="standard"
        fullWidth
        value={values.project}
        onChange={(e) => setProject(e.target.value)}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        fullWidth
        multiline
        rows={6}
        value={values.projectDesc}
        onChange={(e) => setProjectDesc(e.target.value)}
        style={{ backgroundColor: "white" }}
      />
    </Grid>
  </Grid>
);

Projects.propTypes = {
  setProject: PropTypes.func,
  setProjectDesc: PropTypes.func,
  values: PropTypes.shape({
    project: PropTypes.string,
    projectDesc: PropTypes.string,
  }),
};

export default Projects;
