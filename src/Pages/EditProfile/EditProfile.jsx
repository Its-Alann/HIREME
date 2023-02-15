import { React, useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Box, TextField, Avatar, Stack } from "@mui/material";
import ContactInfoCard from "../../Components/ProfileCards/ContactInfoCard";
import EducationCard from "../../Components/ProfileCards/EducationCard";
import ExperienceCard from "../../Components/ProfileCards/ExperienceCard";
import SkillsCard from "../../Components/ProfileCards/SkillsCard";
import LanguagesCard from "../../Components/ProfileCards/LanguagesCard";
import ProjectsCard from "../../Components/ProfileCards/ProjectsCard";
import VolunteeringCard from "../../Components/ProfileCards/VolunteeringCard";
import AwardsCard from "../../Components/ProfileCards/AwardsCard";
import { app, auth } from "../../Firebase/firebase";

const EditProfile = () => {
  const something = "";
  const [profile, setProfile] = useState({
    values: {
      city: "Night city",
    },
  });
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const database = getFirestore(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        console.log("No user currently loggd in");
      }
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (currentUserEmail != null) {
        const userProfileDocRef = doc(
          database,
          "userProfiles",
          currentUserEmail
        );
        const userProfileSnapShot = await getDoc(userProfileDocRef);
        if (userProfileSnapShot.exists()) {
          console.log("User profile Exist");
          setProfile(userProfileSnapShot.data());
        } else {
          console.log("User Profile Not Exist");
        }
      }
    }
    console.log("current User Email");
    console.log(currentUserEmail);
    fetchData();
  }, [currentUserEmail, database]);

  useEffect(() => {
    console.log("User Profile");
    console.log(profile);
  }, [profile]);

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
        <ContactInfoCard setProfile={setProfile} profile={profile} />
        {/* <EducationCard />
        <ExperienceCard />
        <SkillsCard />
        <LanguagesCard />
        <ProjectsCard />
        <VolunteeringCard />
        <AwardsCard /> */}
      </Stack>
    </div>
  );
};

export default EditProfile;
