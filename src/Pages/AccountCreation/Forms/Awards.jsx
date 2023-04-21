import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Awards = ({
  setAwardTitle,
  setIssuer,
  setDateAward,
  setAwardDesc,
  values,
}) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();
  return (
    <Grid
      id="formGrid"
      container
      textAlign="center"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "60vh", maxWidth: "60vh" }}
      rowSpacing={2}
    >
      <Grid xs={12}>
        <TextField
          id="standard-required"
          placeholder={t("Title")}
          variant="standard"
          value={values.awardTitle}
          onChange={(e) => setAwardTitle(e.target.value)}
          fullWidth
        />
      </Grid>

      <Grid item xs={18} container spacing={10}>
        <Grid item xs={6}>
          <TextField
            id="standard-required"
            placeholder={t("Issuer")}
            variant="standard"
            value={values.issuer}
            onChange={(e) => setIssuer(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="row-reverse">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t("Date")}
                value={values.dateAward}
                onChange={(newValue) => {
                  setDateAward(newValue);
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <TextField
          id="outlined-multiline-static"
          label={t("Description")}
          multiline
          rows={6}
          value={values.awardDesc}
          onChange={(e) => setAwardDesc(e.target.value)}
          style={{ backgroundColor: "white" }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

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
