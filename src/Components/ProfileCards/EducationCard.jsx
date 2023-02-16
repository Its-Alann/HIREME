import { React, useEffect, useState } from "react";
import { Grid, Box, Card, CardContent, Typography, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

const EducationCard = ({ setProfile, profile, currentUserEmail }) => {
  const courses = [profile.values.courses];
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const getDates = async () => {
    if (profile.values.startDateEdu && profile.values.endDateEdu) {
      setStartYear(await profile.values.startDateEdu.toDate().getFullYear());
      setEndYear(await profile.values.endDateEdu.toDate().getFullYear());
    }
  };

  useEffect(() => {
    // console.log("profile", profile);
    getDates();
  }, [profile]);

  return (
    <Box>
      {console.log(courses)}
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> Education </Typography>
            </Grid>
            <Grid item>
              <EditIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2"> {profile.values.school} </Typography>
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
                {" "}
                {profile.values.degree}, {profile.values.program}
              </Typography>
            </Grid>
          </Grid>
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
