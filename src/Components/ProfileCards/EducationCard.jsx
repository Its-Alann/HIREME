/* eslint-disable react/prop-types */
import { React, useEffect, useState } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const EducationCard = ({ setProfile, profile, cardNum, isLast }) => {
  const schName = `schoolName${cardNum}`;
  const schDegree = `schoolDegree${cardNum}`;
  const schProgram = `schoolProgram${cardNum}`;
  const schStartDate = `schoolStartDate${cardNum}`;
  const schEndDate = `schoolEndDate${cardNum}`;
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editButton, setEditButton] = useState(false);

  useEffect(() => {
    console.log(profile);
    if (profile.values[schStartDate] !== undefined) {
      setTempStartDate(profile.values[schStartDate]);
    }
    if (profile.values[schEndDate] !== undefined) {
      setTempEndDate(profile.values[schEndDate]);
    }
  }, []);

  const handleClickOpen = () => {
    setDeleteAlert(true);
  };

  const handleClose = () => {
    setDeleteAlert(false);
  };

  const handleClearCardInfo = () => {
    handleClose();
    const newCardNum = profile.values.schoolNum - 1;
    setProfile({
      values: {
        ...profile.values,
        schoolNum: newCardNum,
      },
    });
  };

  return (
    <Box>
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
                value={profile.values[schName]}
                onChange={(e) => {
                  setProfile({
                    values: {
                      ...profile.values,
                      [schName]: e.target.value,
                    },
                  });
                }}
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
                  value={tempStartDate}
                  readOnly={!editButton}
                  onChange={(newValue) => {
                    setTempStartDate(newValue.$d.toISOString());
                    setProfile({
                      values: {
                        ...profile.values,
                        [schStartDate]: newValue.$d.toISOString(),
                      },
                    });
                    console.log(newValue);
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
                  value={tempEndDate}
                  readOnly={!editButton}
                  onChange={(newValue) => {
                    setTempEndDate(newValue.$d.toISOString());
                    setProfile({
                      values: {
                        ...profile.values,
                        [schEndDate]: newValue.$d.toISOString(),
                      },
                    });
                    console.log(newValue.$d);
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
                value={profile.values[schDegree]}
                onChange={(e) =>
                  setProfile({
                    values: {
                      ...profile.values,
                      [schDegree]: e.target.value,
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
                label="Program"
                variant="standard"
                size="small"
                value={profile.values[schProgram]}
                onChange={(e) =>
                  setProfile({
                    values: {
                      ...profile.values,
                      [schProgram]: e.target.value,
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
          {/* I would like to make these into tags that you can delete */}
          <Grid container spacing={1} justifyContent="end">
            {/* {courses.map((data) => (
              <Grid item>
                <Chip color="info" label={data} variant="outlined" />
              </Grid>
            ))} */}
            {isLast && (
              <>
                {cardNum > 0 && (
                  <DeleteIcon
                    sx={{ ml: "auto", mt: "auto", cursor: "pointer" }}
                    onClick={handleClickOpen}
                  />
                )}

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
                    const newCardNum = profile.values.schoolNum + 1;
                    setProfile({
                      values: {
                        ...profile.values,
                        schoolNum: newCardNum,
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

EducationCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  currentUserEmail: PropTypes.string,
};

export default EducationCard;
