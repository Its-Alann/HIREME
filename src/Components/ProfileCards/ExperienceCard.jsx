import { React, useEffect, useState } from "react";
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

const ExperienceCard = ({ setProfile, profile, currentUserEmail }) => {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [editButton, setEditButton] = useState(false);

  const getDates = async () => {
    if (profile.values) {
      setStartYear(await profile.values.startDateExp);
      setEndYear(await profile.values.endDateExp);
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
              <Typography variant="h5"> Experience </Typography>
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
                label="Company Name"
                variant="standard"
                size="small"
                value={profile.values.company}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, company: e.target.value },
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
                  label="Start Date"
                  value={startYear && startYear}
                  onChange={(newValue) => {
                    setProfile({
                      values: {
                        ...profile.values,
                        startDateExp: newValue && newValue.$d,
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
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={endYear && endYear}
                  onChange={(newValue) => {
                    setProfile({
                      values: {
                        ...profile.values,
                        endDateExp: newValue && newValue.$d,
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
                label="Job Position"
                variant="standard"
                size="small"
                value={profile.values.jobPosition}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, jobPosition: e.target.value },
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
                label="Location"
                variant="standard"
                size="small"
                value={profile.values.location}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, location: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              label="Job Description"
              variant="standard"
              size="small"
              value={profile.values.description}
              onChange={(e) =>
                setProfile({
                  values: { ...profile.values, description: e.target.value },
                })
              }
              InputProps={{
                readOnly: !editButton,
                error: editButton,
              }}
            />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

ExperienceCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  currentUserEmail: PropTypes.string,
};

export default ExperienceCard;
