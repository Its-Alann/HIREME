import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PropTypes from "prop-types";
import { blue } from "@mui/material/colors";
import { useTranslation } from "react-i18next";

const ContactInfo = ({
  setPhoneNumber,
  setAddress,
  setCity,
  setCountry,
  setPostalCode,
  setDob,
  values,
}) => {
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
      style={{ minHeight: "50vh", maxWidth: "60vh" }}
    >
      <Grid item xs={12}>
        <TextField
          required
          id="standard-required"
          placeholder={t("PhoneNumber")}
          variant="standard"
          fullWidth
          value={values.phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="standard-required"
          placeholder={t("Address")}
          variant="standard"
          fullWidth
          value={values.address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Grid>
      <Grid item xs={18} container spacing={13}>
        <Grid item xs={0}>
          <TextField
            required
            id="standard-required"
            placeholder={t("City")}
            variant="standard"
            value={values.city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="row-reverse">
            <TextField
              required
              id="standard-required"
              placeholder={t("Country")}
              variant="standard"
              value={values.country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={18} container spacing={14}>
        <Grid item xs={6}>
          <TextField
            required
            id="standard-required"
            placeholder={t("PostalCode")}
            variant="standard"
            value={values.postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="row-reverse">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t("DateOfBirth")}
                value={values.dob}
                onChange={(newValue) => {
                  setDob(newValue);
                }}
                // eslint-disable-next-line react/jsx-props-no-spreading
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

ContactInfo.propTypes = {
  setPhoneNumber: PropTypes.func.isRequired,
  setAddress: PropTypes.func.isRequired,
  setCity: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  setPostalCode: PropTypes.func.isRequired,
  dob: PropTypes.func,
  setDob: PropTypes.func,
  values: PropTypes.shape({
    phoneNumber: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    postalCode: PropTypes.string,
    address: PropTypes.string,
    dob: PropTypes.instanceOf(Date),
  }),
};

export default ContactInfo;
