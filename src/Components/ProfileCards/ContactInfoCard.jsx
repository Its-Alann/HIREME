import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ContactInfoCard = ({ setProfile, profile, currentUserEmail }) => {
  const [editButton, setEditButton] = useState(false);
  const [bday, setBday] = useState();

  const getBday = async () => {
    if (profile.values)
      setBday(
        await profile.values.dob
        // await profile.values.dob.toDate().toLocaleString("en-US", {
        //   month: "long",
        //   day: "2-digit",
        //   year: "numeric",
        // })
      );
  };

  useEffect(() => {
    // console.log("profile", profile);
    getBday();
  }, [profile]);

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              {" "}
              <Typography variant="h5"> Contact Information </Typography>{" "}
            </Grid>
            <Grid item>
              <EditIcon
                onClick={() => setEditButton(!editButton)}
                style={{ cursor: "pointer" }}
              />

              {/* <Button
                onClick={() =>
                  setProfile((previousState) => ({
                    values: { ...previousState.values, city: "Los Angeles" },
                  }))
                }
              >
                Change state in child, Change City to LA
              </Button> */}
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="Phone number"
                variant="standard"
                size="small"
                value={profile.values.phoneNumber}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, phoneNumber: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Address"
                variant="standard"
                size="small"
                value={profile.values.address}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, address: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="City"
                variant="standard"
                size="small"
                value={profile.values.city}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, city: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Country"
                variant="standard"
                size="small"
                value={profile.values.country}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, country: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Postal Code"
                variant="standard"
                size="small"
                value={profile.values.postalCode}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, postalCode: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={bday && bday}
              onChange={(newValue) => {
                setProfile({
                  values: { ...profile.values, dob: newValue && newValue.$d },
                });
              }}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(params) => <TextField {...params} />}
              InputProps={{
                readOnly: !editButton,
                error: editButton,
              }}
            />
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Box>
  );
};

ContactInfoCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  currentUserEmail: PropTypes.string,
};

export default ContactInfoCard;
