import React from "react";
import { Grid, Box, Card, CardContent, Typography, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const EducationCard = () => {
  const courses = [
    "Data Structures",
    "Databases",
    "Object Oriented Programming",
  ];
  return (
    <Box>
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
              <Typography variant="body2"> Concordia University </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2"> 2020 - Present </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {" "}
                Bachelor of Engineering, Software Engineering{" "}
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

export default EducationCard;
