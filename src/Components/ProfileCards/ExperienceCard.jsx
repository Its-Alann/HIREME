/* eslint-disable react/prop-types */
import { React, useEffect, useState } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { CheckBox } from "@mui/icons-material";

const ExperienceCard = ({ setProfile, profile, cardNum, isLast }) => {
  const expName = `expName${cardNum}`;
  const expPosition = `expPos${cardNum}`;
  const expLocation = `expLoc${cardNum}`;
  const expDescription = `expDesc${cardNum}`;
  const expStartDate = `expStartDate${cardNum}`;
  const expEndDate = `expEndDate${cardNum}`;
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [editButton, setEditButton] = useState(false);
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState(false);

  const getDates = async () => {
    if (profile.values) {
      setStartYear(
        profile.values.startDateExp instanceof Date
          ? await dayjs.unix(profile.values[expStartDate].valueOf() / 1000)
          : await dayjs.unix(profile.values[expStartDate].seconds)
      );
      setEndYear(
        profile.values.endDateExp instanceof Date
          ? await dayjs.unix(profile.values[expEndDate].valueOf() / 1000)
          : await dayjs.unix(profile.values[expEndDate].seconds)
      );
    }
  };

  const handleClickOpen = () => {
    setDeleteAlert(true);
    console.log(isCurrentlyEmployed);
  };

  const handleClose = () => {
    setDeleteAlert(false);
  };

  const handleClearCardInfo = () => {
    handleClose();
    const newCardNum = profile.values.expNum - 1;
    setProfile({
      values: {
        ...profile.values,
        expNum: newCardNum,
      },
    });
  };

  const handleCheckbox = () => {
    console.log(isCurrentlyEmployed);
    setIsCurrentlyEmployed(!isCurrentlyEmployed);
    console.log(isCurrentlyEmployed);
  };

  useEffect(() => {
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
                value={profile.values[expName]}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, [expName]: e.target.value },
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
                  readOnly={!editButton}
                  onChange={(newValue) => {
                    setProfile({
                      values: {
                        ...profile.values,
                        [expStartDate]: newValue.$d,
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
                  readOnly={!editButton}
                  onChange={(newValue) => {
                    setProfile({
                      values: {
                        ...profile.values,
                        [expEndDate]: newValue.$d,
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
              <FormControlLabel
                sx={{ m: "auto" }}
                control={
                  <CheckBox
                    name="workCheck"
                    checked={isCurrentlyEmployed}
                    onChange={handleCheckbox}
                    unchecked
                  />
                }
                label="I currently work here"
                labelPlacement="end"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="Job Position"
                variant="standard"
                size="small"
                value={profile.values[expPosition]}
                onChange={(e) =>
                  setProfile({
                    values: {
                      ...profile.values,
                      [expPosition]: e.target.value,
                    },
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
                value={profile.values[expLocation]}
                onChange={(e) =>
                  setProfile({
                    values: {
                      ...profile.values,
                      [expLocation]: e.target.value,
                    },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
          <Grid container>
            <TextField
              label="Job Description"
              variant="standard"
              size="small"
              value={profile.values[expDescription]}
              onChange={(e) =>
                setProfile({
                  values: {
                    ...profile.values,
                    [expDescription]: e.target.value,
                  },
                })
              }
              InputProps={{
                readOnly: !editButton,
                error: editButton,
              }}
            />
            {isLast && (
              <>
                <DeleteIcon
                  sx={{ ml: "auto", mt: "auto", cursor: "pointer" }}
                  onClick={handleClickOpen}
                />

                <Dialog open={deleteAlert} onClose={handleClose}>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete this card?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClearCardInfo}>Delete</Button>
                  </DialogActions>
                </Dialog>

                <AddIcon
                  sx={{ ml: "1%", mt: "auto", cursor: "pointer" }}
                  onClick={() => {
                    const newCardNum = profile.values.expNum + 1;
                    setProfile({
                      values: {
                        ...profile.values,
                        expNum: newCardNum,
                      },
                    });
                  }}
                />
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

ExperienceCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  currentUserEmail: PropTypes.string,
};

export default ExperienceCard;
