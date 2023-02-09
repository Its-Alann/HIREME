import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControlLabel, Checkbox } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PropTypes from "prop-types";

const Experience = ({
  setCompany,
  setjobPosition,
  setLocation,
  setStartDateExp,
  setEndDateExp,
  setWorkingHere,
  setDescription,
  values,
}) => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "50vh" }}
    rowSpacing={1}
  >
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Company"
        variant="standard"
        value={values.company}
        onChange={(e) => setCompany(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Job Position"
        variant="standard"
        value={values.jobPosition}
        onChange={(e) => setjobPosition(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Location"
        variant="standard"
        value={values.location}
        onChange={(e) => setLocation(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={values.startDateExp}
          onChange={(newValue) => {
            setStartDateExp(newValue);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      {values.workingHere === false ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End Date"
            value={values.endDateExp}
            onChange={(newValue) => {
              setEndDateExp(newValue);
            }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      ) : (
        ""
      )}

      <FormControlLabel
        style={{ color: "black" }}
        control={<Checkbox />}
        label="Currently working here"
        checked={values.workingHere === true ? "true" : false}
        value={values.workingHere.checked}
        onChange={(e) => setWorkingHere(e.target.checked)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={6}
        value={values.description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </Grid>
  </Grid>
);

Experience.propTypes = {
  setCompany: PropTypes.func,
  setjobPosition: PropTypes.func,
  setLocation: PropTypes.func,
  setStartDateExp: PropTypes.func,
  startDateExp: PropTypes.func,
  setEndDateExp: PropTypes.func,
  endDateExp: PropTypes.func,
  setWorkingHere: PropTypes.func,
  setDescription: PropTypes.func,
  values: PropTypes.shape({
    startDateExp: PropTypes.instanceOf(Date),
    endDateExp: PropTypes.instanceOf(Date),
    company: PropTypes.string,
    jobPosition: PropTypes.string,
    location: PropTypes.string,
    workingHere: PropTypes.bool,
    description: PropTypes.string,
  }),
};

export default Experience;
