import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PropTypes from "prop-types";

const Awards = ({
  setAwardTitle,
  setIssuer,
  setDateAward,
  setAwardDesc,
  values,
}) => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "40vh" }}
    rowSpacing={1}
  >
    <Grid xs={12}>
      <TextField
        id="standard-required"
        placeholder="Title"
        variant="standard"
        value={values.awardTitle}
        onChange={(e) => setAwardTitle(e.target.value)}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        id="standard-required"
        placeholder="Issuer"
        variant="standard"
        value={values.issuer}
        onChange={(e) => setIssuer(e.target.value)}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          value={values.dateAward}
          onChange={(newValue) => {
            setDateAward(newValue);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Grid>

    <Grid item xs={12}>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={6}
        value={values.awardDesc}
        onChange={(e) => setAwardDesc(e.target.value)}
      />
    </Grid>
  </Grid>
);

Awards.propTypes = {
  setAwardTitle: PropTypes.func,
  setIssuer: PropTypes.func,
  setDateAward: PropTypes.func,
  setAwardDesc: PropTypes.func,
  values: PropTypes.shape({
    awardTitle: PropTypes.string,
    issuer: PropTypes.string,
    dateAward: PropTypes.instanceOf(Date),
    awardDesc: PropTypes.string,
  }),
};
export default Awards;
