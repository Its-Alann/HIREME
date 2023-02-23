import { React, useState, useEffect } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const VolunteeringCard = ({ profile, setProfile }) => {
  const [startYear, setStartYear] = useState("");
  const [editButton, setEditButton] = useState(false);

  const getDates = async () => {
    if (profile.values) {
      setStartYear(
        profile.values.dateVolunt instanceof Date
          ? await dayjs.unix(profile.values.dateVolunt.valueOf() / 1000)
          : await dayjs.unix(profile.values.dateVolunt.seconds)
      );
    }
  };

  useEffect(() => {
    // console.log("profile", profile);
    getDates();
  }, [profile]);
  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> Volunteering </Typography>
            </Grid>
            <Grid item>
              <EditIcon
                onClick={() => setEditButton(!editButton)}
                style={{ cursor: "pointer" }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="Project Title"
                variant="standard"
                size="small"
                value={profile.values.organization}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, organization: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Awarded"
                  value={startYear}
                  onChange={(newValue) => {
                    setProfile({
                      values: {
                        ...profile.values,
                        dateVolunt: newValue && newValue.$d,
                      },
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
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="Project Description"
                variant="standard"
                size="small"
                multiline
                maxRows={4}
                value={profile.values.voluntDesc}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, voluntDesc: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

VolunteeringCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
};

export default VolunteeringCard;
