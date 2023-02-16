import { React, useEffect, useState } from "react";
import { Grid, Box, Card, CardContent, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

const ExperienceCard = ({ setProfile, profile, currentUserEmail }) => {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const getDates = async () => {
    if (profile.values.startDateEdu && profile.values.endDateEdu) {
      setStartYear(
        await profile.values.startDateExp.toDate().toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })
      );
      setEndYear(
        await profile.values.endDateExp.toDate().toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })
      );
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
              <EditIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {" "}
                {profile.values.company}{" "}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {" "}
                {startYear} - {endYear}{" "}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {profile.values.jobPosition}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">{profile.values.location}</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              {profile.values.description}
            </Typography>
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
