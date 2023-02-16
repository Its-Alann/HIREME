import { React, useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Box, TextField, Avatar, Stack, Button } from "@mui/material";
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

  // Set default value, because otherwise UI glitch + warning
  const [profile, setProfile] = useState({
    values: {
      city: "",
      firstName: "",
      lastName: "",
      school: "",
      country: "",
    },
  });
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const database = getFirestore(app);

  // Only once, attach listener to onAuthStateChanged
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        console.log("No user currently logged in");
      }
    });
  }, []);

  // Whenever currentUserEmail or database changes, get user's profile from database
  // Save it to profile
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

  // Whenever profile changes, log profile
  useEffect(() => {
    console.log("User Profile");
    console.log(profile);
  }, [profile]);

  // Update user's profile with data inside "profile"
  async function handleTempButton() {
    console.log(profile);
    if (currentUserEmail != null) {
      const userProfileDocRef = doc(database, "userProfiles", currentUserEmail);
      await updateDoc(userProfileDocRef, profile);
      console.log("Update finished");
    }
  }

  return (
    <div>
      <Grid container>
        <Grid item md={3}>
          <Grid container my={5}>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
        </Grid>
        <Grid item md={9} margin="auto">
          <Grid container direction="column">
            <Grid container>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="First Name"
                    variant="standard"
                    value={profile.values.firstName}
                  />
                </Grid>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="Last Name"
                    variant="standard"
                    value={profile.values.lastName}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="School Name"
                    variant="standard"
                    value={profile.values.school}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="City"
                    variant="standard"
                    value={profile.values.city}
                  />
                </Grid>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="Country"
                    variant="standard"
                    value={profile.values.country}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Stack spacing={2}>
        <ContactInfoCard
          setProfile={setProfile}
          profile={profile}
          currentUserEmail={currentUserEmail}
        />
        <EducationCard
          setProfile={setProfile}
          profile={profile}
          currentUserEmail={currentUserEmail}
        />
        <ExperienceCard
          setProfile={setProfile}
          profile={profile}
          currentUserEmail={currentUserEmail}
        />
        <SkillsCard
          setProfile={setProfile}
          profile={profile}
          currentUserEmail={currentUserEmail}
        />
        {/*
        <LanguagesCard />
        <ProjectsCard />
        <VolunteeringCard />
        <AwardsCard /> */}
        <Button
          onClick={() => {
            console.log("Button Save Clicked");
            handleTempButton();
          }}
        >
          Temp Button, click to save
        </Button>
      </Stack>
    </div>
  );
};

export default EditProfile;
