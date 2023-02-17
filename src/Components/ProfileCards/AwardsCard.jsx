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

const AwardsCard = ({ profile, setProfile }) => {
  const [startDate, setStartYear] = useState("");
  const [editButton, setEditButton] = useState(false);

  const getDates = async () => {
    if (profile.values) {
      setStartYear(await profile.values.dateVolunt);
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
              <Typography variant="h5"> Awards </Typography>
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
                label="Award Title"
                variant="standard"
                size="small"
                value={profile.values.awardTitle}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, awardTitle: e.target.value },
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
                label="Award Issuer"
                variant="standard"
                size="small"
                value={profile.values.issuer}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, issuer: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
            <Grid item>
              <Typography variant="body2"> {startDate} </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate && startDate}
                  onChange={(newValue) => {
                    setProfile({
                      values: {
                        ...profile.values,
                        dateAward: newValue && newValue.$d,
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
                label="Award Description"
                variant="standard"
                size="small"
                multiline
                maxRows={4}
                value={profile.values.awardDesc}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, awardDesc: e.target.value },
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

AwardsCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
};

export default AwardsCard;
