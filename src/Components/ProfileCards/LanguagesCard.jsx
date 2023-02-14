import React from "react";
import { Grid, Box, Card, CardContent, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const LanguagesCard = () => {
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
              <Typography variant="body2"> English </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2"> Proficienfy: Fluent </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2"> French </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2"> Proficienfy: Fluent </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2"> Creole </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2"> Proficienfy: Beginner </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LanguagesCard;
