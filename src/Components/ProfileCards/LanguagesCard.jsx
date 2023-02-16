import React from "react";
import { Grid, Box, Card, CardContent, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

const LanguagesCard = ({ profile }) => {
  const something = "";
  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> Languages </Typography>
            </Grid>
            <Grid item>
              <EditIcon />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {" "}
                {profile.values.language}{" "}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {" "}
                Proficienfy: {profile.values.proficiency}{" "}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

LanguagesCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
};

export default LanguagesCard;
