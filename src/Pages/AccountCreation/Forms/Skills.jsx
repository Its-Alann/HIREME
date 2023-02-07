import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const Skills = ({ setSkills, values }) => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "20vh" }}
    rowSpacing={1}
  >
    <Grid item xs={12}>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={6}
        value={values.skills}
        onChange={(e) => setSkills(e.target.value)}
      />
    </Grid>
  </Grid>
);

Skills.propTypes = {
  setSkills: PropTypes.func,
  values: PropTypes.shape({
    skills: PropTypes.string,
  }),
};

export default Skills;
