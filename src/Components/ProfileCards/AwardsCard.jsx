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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const AwardsCard = ({
  profile,
  setProfile,
  cardNum,
  isLast,
  visitingProfile,
}) => {
  const awardTitle = `awardTitle${cardNum}`;
  const awardIssuer = `awardIssuer${cardNum}`;
  const awardDescription = `awardDescription${cardNum}`;
  const awardDate = `awardDate${cardNum}`;
  const [editButton, setEditButton] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [tempAwardDate, setTempAwardDate] = useState("");

  useEffect(() => {
    if (profile.values[awardDate] !== undefined) {
      setTempAwardDate(profile.values[awardDate]);
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
    const newCardNum = profile.values.awardsNum - 1;
    setProfile({
      values: {
        ...profile.values,
        awardsNum: newCardNum,
      },
    });
  };

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
                style={{
                  cursor: "pointer",
                  display: visitingProfile ? "none" : "inline",
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="Award Title"
                variant="standard"
                size="small"
                value={profile.values[awardTitle]}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, [awardTitle]: e.target.value },
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
                value={profile.values[awardIssuer]}
                onChange={(e) =>
                  setProfile({
                    values: {
                      ...profile.values,
                      [awardIssuer]: e.target.value,
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="new date"
                  value={tempAwardDate}
                  readOnly={!editButton}
                  onChange={(newVal) => {
                    setTempAwardDate(newVal.$d.toISOString());
                    setProfile({
                      values: {
                        ...profile.values,
                        [awardDate]: newVal.$d.toISOString(),
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
            <Grid item sx={{ mr: "auto" }}>
              <TextField
                label="Award Description"
                variant="standard"
                size="small"
                multiline
                maxRows={4}
                value={profile.values[awardDescription]}
                onChange={(e) =>
                  setProfile({
                    values: {
                      ...profile.values,
                      [awardDescription]: e.target.value,
                    },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
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
                  sx={{
                    ml: "1%",
                    mt: "auto",
                    cursor: "pointer",
                    display: visitingProfile ? "none" : "inline",
                  }}
                  onClick={() => {
                    const newCardNum = profile.values.awardsNum + 1;
                    console.log(newCardNum);
                    setProfile({
                      values: {
                        ...profile.values,
                        awardsNum: newCardNum,
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

AwardsCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  visitingProfile: PropTypes.bool,
};

export default AwardsCard;
