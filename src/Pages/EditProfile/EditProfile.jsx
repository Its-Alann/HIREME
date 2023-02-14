import React from "react";
import { Grid, Box, TextField, Avatar, Stack } from "@mui/material";
import ContactInfoCard from "../../Components/ProfileCards/ContactInfoCard";
import EducationCard from "../../Components/ProfileCards/EducationCard";
import ExperienceCard from "../../Components/ProfileCards/ExperienceCard";
import SkillsCard from "../../Components/ProfileCards/SkillsCard";
import LanguagesCard from "../../Components/ProfileCards/LanguagesCard";
import ProjectsCard from "../../Components/ProfileCards/ProjectsCard";
import VolunteeringCard from "../../Components/ProfileCards/VolunteeringCard";
import AwardsCard from "../../Components/ProfileCards/AwardsCard";

const EditProfile = () => {
  const something = "";

  return (
    <div>
      <Grid container>
        <Grid item md="3">
          <Grid container my={5}>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
        </Grid>
        <Grid item md="9" margin="auto">
          <Grid container direction="column">
            <Grid container>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="First Name"
                    variant="standard"
                  />
                </Grid>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="Last Name"
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="School Name"
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="City"
                    variant="standard"
                  />
                </Grid>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="Country"
                    variant="standard"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Stack spacing={2}>
        <ContactInfoCard />
        <EducationCard />
        <ExperienceCard />
        <SkillsCard />
        <LanguagesCard />
        <ProjectsCard />
        <VolunteeringCard />
        <AwardsCard />
      </Stack>
    </div>
  );
};

export default EditProfile;
