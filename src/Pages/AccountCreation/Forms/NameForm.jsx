import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const NameForm = ({ setFirstName, setLastName, values }) => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "15vh" }}
  >
    <Grid item xs={8}>
      <TextField
        required
        id="standard-required"
        placeholder="First Name"
        variant="standard"
        value={values.firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
    </Grid>
    <Grid item xs={8}>
      <TextField
        required
        id="standard-required"
        placeholder="Last Name"
        variant="standard"
        value={values.lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
    </Grid>
  </Grid>
);

NameForm.propTypes = {
  setFirstName: PropTypes.func.isRequired,
  setLastName: PropTypes.func.isRequired,
  values: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
};

export default NameForm;
