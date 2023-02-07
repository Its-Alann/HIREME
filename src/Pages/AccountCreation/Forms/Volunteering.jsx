import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PropTypes from "prop-types";

const Volunteering = ({
  setOrganization,
  setDateVolunt,
  setVoluntDesc,
  values,
}) => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "30vh" }}
    rowSpacing={1}
  >
    <Grid item xs={12}>
      <TextField
        id="standard-required"
        placeholder="Organization"
        variant="standard"
        value={values.organization}
        onChange={(e) => setOrganization(e.target.value)}
      />
    </Grid>

    <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={values.dateVolunt}
          onChange={(newValue) => {
            setDateVolunt(newValue);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Grid>

    <Grid>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={6}
        value={values.voluntDesc}
        onChange={(e) => setVoluntDesc(e.target.value)}
      />
    </Grid>
  </Grid>
);

Volunteering.propTypes = {
  setOrganization: PropTypes.func,
  setDateVolunt: PropTypes.func,
  setVoluntDesc: PropTypes.func,
  values: PropTypes.shape({
    organization: PropTypes.string,
    dateVolunt: PropTypes.string,
    voluntDesc: PropTypes.string,
  }),
};

export default Volunteering;
