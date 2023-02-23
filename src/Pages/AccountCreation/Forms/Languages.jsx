import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const Languages = ({ setLanguage, setProficiency, values }) => (
  <Grid
    id="formGrid"
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "30vh", maxWidth: "50vh" }}
    rowSpacing={1}
  >
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Language"
        variant="standard"
        value={values.language}
        onChange={(e) => setLanguage(e.target.value)}
        fullWidth
      />
    </Grid>

    <Grid>
      <Box sx={{ minWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel> Proficiency</InputLabel>
          <Select
            id="language-dropdown"
            value={values.proficiency}
            label="Proficiency"
            onChange={(e) => setProficiency(e.target.value)}
          >
            <MenuItem value="Fluent">Fluent</MenuItem>
            <MenuItem value="Inter">Intermediate</MenuItem>
            <MenuItem value="Beginner">Beginner</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Grid>
  </Grid>
);

Languages.propTypes = {
  setLanguage: PropTypes.func,
  setProficiency: PropTypes.func,
  values: PropTypes.shape({
    language: PropTypes.string,
    proficiency: PropTypes.string,
  }),
};

export default Languages;
