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
  Checkbox,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ExperienceCard = ({
  setProfile,
  profile,
  cardNum,
  isLast,
  visitingProfile,
}) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const expName = `expName${cardNum}`;
  const expPosition = `expPos${cardNum}`;
  const expLocation = `expLoc${cardNum}`;
  const expDescription = `expDesc${cardNum}`;
  const expStartDate = `expStartDate${cardNum}`;
  const expEndDate = `expEndDate${cardNum}`;
  const expWorkHere = `expWorkHere${cardNum}`;
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editButton, setEditButton] = useState(false);
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState(false);

  useEffect(() => {
    console.log(profile);
    if (profile.values[expStartDate] !== undefined) {
      setTempStartDate(profile.values[expStartDate]);
    }
    if (profile.values[expEndDate] !== undefined) {
      setTempEndDate(profile.values[expEndDate]);
    }
    if (profile.values[expWorkHere] !== undefined) {
      setIsCurrentlyEmployed(profile.values[expWorkHere]);
    } else {
      setProfile({
        values: {
          ...profile.values,
          [expWorkHere]: false,
        },
      });
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
    const newCardNum = profile.values.expNum - 1;
    setProfile({
      values: {
        ...profile.values,
        expNum: newCardNum,
      },
    });
  };

  const handleCheckbox = () => {
    setProfile({
      values: {
        ...profile.values,
        [expWorkHere]: !isCurrentlyEmployed,
      },
    });
    setIsCurrentlyEmployed(!isCurrentlyEmployed);
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 0 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> {t("Experience")}</Typography>
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
                label={t("CompanyName")}
                name="CompanyName"
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
                  label={t("StartDate")}
                  value={tempStartDate}
                  readOnly={!editButton}
                  onChange={(newValue) => {
                    setTempStartDate(newValue.$d.toISOString());
                    setProfile({
                      values: {
                        ...profile.values,
                        [expStartDate]: newValue.$d.toISOString(),
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
            {!isCurrentlyEmployed && (
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t("EndDate")}
                    name="ExpEndDate"
                    value={tempEndDate}
                    readOnly={!editButton}
                    onChange={(newValue) => {
                      setTempEndDate(newValue.$d.toISOString());
                      setProfile({
                        values: {
                          ...profile.values,
                          [expEndDate]: newValue.$d.toISOString(),
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
            )}
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    name="WorkCheck"
                    checked={isCurrentlyEmployed}
                    onChange={handleCheckbox}
                  />
                }
                label={t("Icurrentlyworkhere")}
                labelPlacement="end"
                disabled={!editButton}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label={t("JobPosition")}
                name="JobPosition"
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
                label={t("Location")}
                name="JobLocation"
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
              label={t("JobDescription")}
              name="JobDescription"
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
              sx={{ mr: "auto" }}
            />
            {isLast && (
              <>
                {cardNum > 0 && (
                  <DeleteIcon
                    sx={{ ml: "auto", mt: "auto", cursor: "pointer" }}
                    onClick={handleClickOpen}
                    name="expDel"
                  />
                )}

                <Dialog open={deleteAlert} onClose={handleClose}>
                  <DialogContent>
                    <DialogContentText>
                      {t("Areyousureyouwanttodeletethiscard?")}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>{t("Cancel")}</Button>
                    <Button onClick={handleClearCardInfo} name="expPopupDel">
                      {t("Delete")}
                    </Button>
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
                    const newCardNum = profile.values.expNum + 1;
                    console.log(newCardNum);
                    setProfile({
                      values: {
                        ...profile.values,
                        expNum: newCardNum,
                      },
                    });
                  }}
                  name="expAdd"
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
  visitingProfile: PropTypes.bool,
};

export default ExperienceCard;
