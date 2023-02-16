import React from "react";
import { Grid, Box, Card, CardContent, Typography, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const SkillsCard = () => {
  const skills = ["Java", "JavaScript", "React", "Zoom"];
  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> Skills </Typography>
            </Grid>
            <Grid item>
              <EditIcon />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            {skills.map((data) => (
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

export default SkillsCard;