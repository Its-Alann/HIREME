import { React, useState, useEffect } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

const LanguagesCard = ({ profile, setProfile }) => {
  const [editButton, setEditButton] = useState(false);
  const [proficiency, setProficiency] = useState("");

  useEffect(() => {
    if (profile.values) {
      setProficiency(profile.values.proficiency);
    }
  }, [profile.values.proficiency]);

  useEffect(() => {
    setProfile({
      values: { ...profile.values, proficiency },
    });
  }, [proficiency]);

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> Languages </Typography>
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
                label="Language"
                variant="standard"
                size="small"
                value={profile.values.language}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, language: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
            <Grid item>
              <Box sx={{ minWidth: 300 }}>
                <FormControl fullWidth variant="standard">
                  <InputLabel> Proficiency</InputLabel>
                  <Select
                    id="language-dropdown"
                    value={proficiency}
                    label="Proficiency"
                    onChange={(e) => setProficiency(e.target.value)}
                    inputProps={{ readOnly: !editButton }}
                  >
                    <MenuItem value="Fluent">Fluent</MenuItem>
                    <MenuItem value="Inter">Intermediate</MenuItem>
                    <MenuItem value="Beginner">Beginner</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

LanguagesCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
};

export default LanguagesCard;
