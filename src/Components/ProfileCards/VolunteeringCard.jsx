/* eslint-disable react/prop-types */
import { React, useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const VolunteeringCard = ({
  profile,
  setProfile,
  cardNum,
  isLast,
  visitingProfile,
}) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const volunteerOrg = `volunteer${cardNum}org`;
  const volunteerDesc = `volunteer${cardNum}desc`;
  const volunteerDate = `volunteer${cardNum}date`;
  const [editButton, setEditButton] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [tempVolDate, setTempVolDate] = useState("");

  useEffect(() => {
    if (profile.values[volunteerDate] !== undefined) {
      setTempVolDate(profile.values[volunteerDate]);
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
    const newCardNum = profile.values.volunteerNum - 1;
    setProfile({
      values: {
        ...profile.values,
        volunteerNum: newCardNum,
      },
    });
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 0 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">{t("Volunteering")}</Typography>
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
                label={t("OrganizationName")}
                name="OrgName"
                variant="standard"
                size="small"
                value={profile.values[volunteerOrg]}
                onChange={(e) =>
                  setProfile({
                    values: {
                      ...profile.values,
                      [volunteerOrg]: e.target.value,
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
                  label={t("VolunteeringDate")}
                  value={tempVolDate}
                  onChange={(newValue) => {
                    setTempVolDate(newValue.$d.toISOString());
                    setProfile({
                      values: {
                        ...profile.values,
                        [volunteerDate]: newValue.$d.toISOString(),
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
                label={t("Volunteering Description")}
                name="VolDesc"
                variant="standard"
                size="small"
                multiline
                maxRows={4}
                value={profile.values[volunteerDesc]}
                onChange={(e) =>
                  setProfile({
                    values: {
                      ...profile.values,
                      [volunteerDesc]: e.target.value,
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
                    name="volDel"
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
                    <Button onClick={handleClearCardInfo} name="volPopupDel">
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
                    const newCardNum = profile.values.volunteerNum + 1;
                    console.log(newCardNum);
                    setProfile({
                      values: {
                        ...profile.values,
                        volunteerNum: newCardNum,
                      },
                    });
                  }}
                  name="volAdd"
                />
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

VolunteeringCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  visitingProfile: PropTypes.bool,
};

export default VolunteeringCard;
