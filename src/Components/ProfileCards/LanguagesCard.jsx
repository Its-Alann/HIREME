/* eslint-disable react/prop-types */
import { React, useState } from "react";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

const LanguagesCard = ({
  profile,
  setProfile,
  cardNum,
  isLast,
  visitingProfile,
}) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const language = `language${cardNum}`;
  const proficiency = `language${cardNum}proficiency`;
  const [editButton, setEditButton] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const handleClickOpen = () => {
    setDeleteAlert(true);
  };

  const handleClose = () => {
    setDeleteAlert(false);
  };

  const handleClearCardInfo = () => {
    handleClose();
    const newCardNum = profile.values.languageNum - 1;
    setProfile({
      values: {
        ...profile.values,
        languageNum: newCardNum,
      },
    });
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 0 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> {t("Language")}</Typography>
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
                label={t("Language")}
                name="Language"
                variant="standard"
                size="small"
                value={profile.values[language]}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, [language]: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
            <Grid item sx={{ mr: "auto" }}>
              <Box sx={{ minWidth: 300 }}>
                <FormControl fullWidth variant="standard">
                  <InputLabel> {t("Proficiency")}</InputLabel>
                  <Select
                    id="language-dropdown"
                    name="LanguageDropdown"
                    value={profile.values[proficiency]}
                    label={t("Proficiency")}
                    onChange={(e) =>
                      setProfile({
                        values: {
                          ...profile.values,
                          [proficiency]: e.target.value,
                        },
                      })
                    }
                    inputProps={{ readOnly: !editButton }}
                  >
                    <MenuItem value="Fluent">{t("Fluent")}</MenuItem>
                    <MenuItem value="Inter">{t("Intermediate")}</MenuItem>
                    <MenuItem value="Beginner">{t("Beginner")}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            {isLast && (
              <>
                {cardNum > 0 && (
                  <DeleteIcon
                    sx={{ ml: "auto", mt: "auto", cursor: "pointer" }}
                    onClick={handleClickOpen}
                    name="langDel"
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
                    <Button onClick={handleClearCardInfo} name="langPopupDel">
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
                    const newCardNum = profile.values.languageNum + 1;
                    console.log(newCardNum);
                    setProfile({
                      values: {
                        ...profile.values,
                        languageNum: newCardNum,
                      },
                    });
                  }}
                  name="langAdd"
                />
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

LanguagesCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  visitingProfile: PropTypes.bool,
};

export default LanguagesCard;
