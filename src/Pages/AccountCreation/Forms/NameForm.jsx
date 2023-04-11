import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import "./Forms.css";
import ProfilePicture from "../../../Components/ProfileCards/ProfilePicture";

const NameForm = ({ setFirstName, setLastName, setField, values, field }) => (
  <Grid
    container
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "15vh" }}
  >
    <ProfilePicture />
    <Grid
      id="formGrid"
      container
      textAlign="center"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "35vh" }}
    >
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          id="standard-required"
          placeholder="First Name"
          variant="standard"
          value={values.firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          id="standard-required"
          placeholder="Last Name"
          variant="standard"
          value={values.lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          id="standard-required"
          placeholder="Desired Job Title"
          variant="standard"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
      </Grid>
    </Grid>
  </Grid>
);

NameForm.propTypes = {
  setFirstName: PropTypes.func.isRequired,
  setLastName: PropTypes.func.isRequired,
  setField: PropTypes.func.isRequired,
  values: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }).isRequired,
  field: PropTypes.string.isRequired,
};

export default NameForm;
