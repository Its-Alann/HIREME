import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const Projects = ({ setProject, setProjectDesc, values }) => (
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
        id="standard-required"
        placeholder="Project Title"
        variant="standard"
        value={values.project}
        onChange={(e) => setProject(e.target.value)}
      />
    </Grid>

    <Grid>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={6}
        value={values.projectDesc}
        onChange={(e) => setProjectDesc(e.target.value)}
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
