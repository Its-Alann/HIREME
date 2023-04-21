import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Projects = ({ setProject, setProjectDesc, values }) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();
  return (
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
          placeholder={t("ProjectTitle")}
          variant="standard"
          fullWidth
          value={values.project}
          onChange={(e) => setProject(e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          id="outlined-multiline-static"
          label={t("Description")}
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
};

Projects.propTypes = {
  setProject: PropTypes.func,
  setProjectDesc: PropTypes.func,
  values: PropTypes.shape({
    project: PropTypes.string,
    projectDesc: PropTypes.string,
  }),
};

export default Projects;
