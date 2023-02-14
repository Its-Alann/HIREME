import React from "react";
import { Grid, Box, Card, CardContent, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ExperienceCard = () => {
  const something = "";
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
              <Typography variant="body2"> Google </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2"> 2020 - Present </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">Junior Software Developer</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">Montreal, Canada</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              maximus nibh nec massa convallis, quis bibendum neque fringilla.
              Mauris et odio a sem malesuada fermentum. Nunc sed lacus sit amet
              augue hendrerit tristique viverra non enim. Aliquam vitae porta
              neque. Nullam sodales nibh at velit pulvinar, in fermentum dolor
              dapibus. Donec efficitur metus ultricies magna mattis, eget
              vulputate tortor hendrerit. In in tempus neque. Fusce urna enim,
              faucibus quis bibendum ut, dictum quis urna. Aenean viverra urna
              tellus, vel vestibulum nulla finibus quis. Sed dolor tortor,
              iaculis ut purus id, dignissim sodales quam. Aliquam consectetur
              vitae mi in lacinia. In in ante ac nisi faucibus volutpat eu sed
              purus. Mauris commodo turpis ac augue condimentum, id tempor nunc
              tincidunt. In scelerisque mi id ullamcorper faucibus.{" "}
            </Typography>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExperienceCard;
