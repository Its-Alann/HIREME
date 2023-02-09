import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PropTypes from "prop-types";

const Education = ({
  setSchool,
  setDegree,
  setProgram,
  setStartDateEdu,
  setEndDateEdu,
  setCourses,
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
        placeholder="School"
        variant="standard"
        value={values.school}
        onChange={(e) => setSchool(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Degree"
        variant="standard"
        value={values.degree}
        onChange={(e) => setDegree(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Program"
        variant="standard"
        value={values.program}
        onChange={(e) => setProgram(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={values.startDateEdu}
          onChange={(newValue) => {
            setStartDateEdu(newValue);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="End Date"
          value={values.endDateEdu}
          onChange={(newValue) => {
            setEndDateEdu(newValue);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Grid>
    <Grid item xs={12}>
      <TextField
        id="outlined-multiline-static"
        label="Courses"
        multiline
        rows={6}
        value={values.courses}
        onChange={(e) => setCourses(e.target.value)}
      />
    </Grid>
  </Grid>
);

Education.propTypes = {
  setSchool: PropTypes.func,
  setDegree: PropTypes.func,
  setProgram: PropTypes.func,
  setStartDateEdu: PropTypes.func,
  setEndDateEdu: PropTypes.func,
  setCourses: PropTypes.func,
  values: PropTypes.shape({
    school: PropTypes.string,
    required: PropTypes.string,
    degree: PropTypes.string,
    program: PropTypes.string,
    courses: PropTypes.string,
    startDateEdu: PropTypes.instanceOf(Date),
    endDateEdu: PropTypes.instanceOf(Date),
  }),
};

export default Education;
