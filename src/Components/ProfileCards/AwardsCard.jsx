import { React, useEffect, useState } from "react";
import { Grid, Box, Card, CardContent, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

const AwardsCard = ({ profile }) => {
  const [startDate, setStartYear] = useState("");

  const getDates = async () => {
    if (profile.values.dateAward) {
      setStartYear(
        await profile.values.dateAward.toDate().toLocaleString("en-US", {
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
              <Typography variant="h5"> Awards </Typography>
            </Grid>
            <Grid item>
              <EditIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {" "}
                {profile.values.awardTitle}{" "}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2"> {profile.values.issuer} </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2"> {startDate} </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {profile.values.awardDesc}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

AwardsCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
};

export default AwardsCard;
