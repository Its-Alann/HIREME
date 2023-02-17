import { React, useEffect, useState } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const EducationCard = ({ setProfile, profile, currentUserEmail }) => {
  const courses = [profile.values.courses];
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [editButton, setEditButton] = useState(false);

  const getDates = async () => {
    if (profile.values) {
      setStartYear(await profile.values.startDateEdu);
      setEndYear(await profile.values.endDateEdu);
    }
  };

  useEffect(() => {
    // console.log("profile", profile);
    getDates();
  }, [profile]);

  return (
    <Box>
      {/* {console.log(courses)} */}
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> Education </Typography>
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
                label="School name"
                variant="standard"
                size="small"
                value={profile.values.school}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, school: e.target.value },
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
                        startDateEdu: newValue && newValue.$d,
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
                        endDateEdu: newValue && newValue.$d,
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
                label="Degree"
                variant="standard"
                size="small"
                value={profile.values.degree}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, degree: e.target.value },
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
                label="Degree"
                variant="standard"
                size="small"
                value={profile.values.program}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, program: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
          {/* I would like to make these into tags that you can delete */}
          <Grid container spacing={1}>
            {courses.map((data) => (
              <Grid item>
                <Chip color="info" label={data} variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

EducationCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  currentUserEmail: PropTypes.string,
};

export default EducationCard;
