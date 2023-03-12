import { React, useState, useEffect } from "react";
import { doc, getFirestore, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Stack, Button, InputBase } from "@mui/material";
import { ref, getDownloadURL } from "firebase/storage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContactInfoCard from "../../Components/ProfileCards/ContactInfoCard";
import EducationCard from "../../Components/ProfileCards/EducationCard";
import ExperienceCard from "../../Components/ProfileCards/ExperienceCard";
import SkillsCard from "../../Components/ProfileCards/SkillsCard";
import LanguagesCard from "../../Components/ProfileCards/LanguagesCard";
import ProjectsCard from "../../Components/ProfileCards/ProjectsCard";
import VolunteeringCard from "../../Components/ProfileCards/VolunteeringCard";
import AwardsCard from "../../Components/ProfileCards/AwardsCard";
import { app, auth, storage } from "../../Firebase/firebase";
import "./EditProfile.css";
import ProfilePicture from "../../Components/ProfileCards/ProfilePicture";

const EditProfilePage = () => {
  const theme = createTheme({
    palette: {
      primary: { main: "#2B2F90" },
      background: { main: "#EAEAEA" },
      gray: { main: "#757575" },
    },
    typography: {
      fontFamily: ["Proxima Nova"],
    },
  });

  const [profile, setProfile] = useState({
    values: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      dob: "",
      //school: "",
      //degree: "",
      //program: "",
      //startDateEdu: "",
      //endDateEdu: "",
      courses: "",
      company: "",
      jobPosition: "",
      location: "",
      startDateExp: "",
      endDateExp: "",
      workingHere: "",
      description: "",
      skills: "",
      //language: "",
      proficiency: "",
      //project: "",
      //projectDesc: "",
      organization: "",
      dateVolunt: "",
      //voluntDesc: "",
      awardTitle: "",
      issuer: "",
      dateAward: "",
      awardDesc: "",
    },
  });
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const database = getFirestore(app);
  const [url, setUrl] = useState();
  const [infoAvailable, setInfoAvailable] = useState(false);

  //callback function to make sure setState updates state before its next use (i think)
  // function outputProfile() {
  //   console.log(profile);
  // }

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
        //Get profile picture
        console.log(currentUserEmail);
        const profilePictureLink = `${currentUserEmail}-profilePicture`;
        const imageRef = ref(storage, `profile-pictures/${profilePictureLink}`);
        getDownloadURL(imageRef)
          // eslint-disable-next-line no-shadow
          .then((url) => {
            setUrl(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
      }
    }
    console.log("current User Email");
    console.log(currentUserEmail);
    fetchData();
  }, [currentUserEmail, database]);

  // Update user's profile with data inside "profile"
  async function handleTempButton() {
    console.log(profile);
    if (currentUserEmail != null) {
      const userProfileDocRef = doc(database, "userProfiles", currentUserEmail);
      await updateDoc(userProfileDocRef, profile);
      console.log("Update finished");
    }
  }

  //wait until info is retrieved from db before loading cards
  useEffect(() => {
    console.log("User Profile", profile);
    if (profile.values.firstName !== "") {
      setInfoAvailable(true);
    }
  }, [profile]);

  const getEductionCards = () => {
    const cards = [];
    if (profile.values.schoolNum === undefined) {
      setProfile({
        values: {
          ...profile.values,
          schoolNum: 1,
        },
      });
      handleTempButton();
    }
    for (let i = 0; i < profile.values.schoolNum; i += 1) {
      cards.push(
        <EducationCard
          setProfile={setProfile}
          profile={profile}
          currentUserEmail={currentUserEmail}
          cardNum={i}
          isLast={i + 1 === profile.values.schoolNum}
        />
      );
    }
    return cards;
  };

  const getExperienceCards = () => {
    const cards = [];
    if (profile.values.expNum === undefined) {
      setProfile({
        values: {
          ...profile.values,
          expNum: 1,
        },
      });
      handleTempButton();
    }
    for (let i = 0; i < profile.values.expNum; i += 1) {
      cards.push(
        <ExperienceCard
          setProfile={setProfile}
          profile={profile}
          currentUserEmail={currentUserEmail}
          cardNum={i}
          isLast={i + 1 === profile.values.expNum}
        />
      );
    }
    return cards;
  };

  const getAwardsCards = () => {
    const cards = [];
    if (profile.values.awardsNum === undefined) {
      setProfile({
        values: {
          ...profile.values,
          awardsNum: 1,
        },
      });
      handleTempButton();
    }
    for (let i = 0; i < profile.values.awardsNum; i += 1) {
      cards.push(
        <AwardsCard
          profile={profile}
          setProfile={setProfile}
          cardNum={i}
          isLast={i + 1 === profile.values.awardsNum}
        />
      );
    }
    return cards;
  };

  const getLanguageCards = () => {
    const cards = [];
    if (profile.values.languageNum === undefined) {
      setProfile({
        values: {
          ...profile.values,
          languageNum: 1,
        },
      });
      handleTempButton();
    }
    for (let i = 0; i < profile.values.languageNum; i += 1) {
      cards.push(
        <LanguagesCard
          profile={profile}
          setProfile={setProfile}
          cardNum={i}
          isLast={i + 1 === profile.values.languageNum}
        />
      );
    }
    return cards;
  };

  const getProjectsCards = () => {
    const cards = [];
    if (profile.values.projectNum === undefined) {
      setProfile({
        values: {
          ...profile.values,
          projectNum: 1,
        },
      });
      handleTempButton();
    }
    for (let i = 0; i < profile.values.projectNum; i += 1) {
      cards.push(
        <ProjectsCard
          profile={profile}
          setProfile={setProfile}
          cardNum={i}
          isLast={i + 1 === profile.values.projectNum}
        />
      );
    }
    return cards;
  };

  const getVolunteeringCard = () => {
    const cards = [];
    if (profile.values.volunteerNum === undefined) {
      setProfile({
        values: {
          ...profile.values,
          volunteerNum: 1,
        },
      });
      handleTempButton();
    }
    for (let i = 0; i < profile.values.volunteerNum; i += 1) {
      cards.push(
        <VolunteeringCard
          profile={profile}
          setProfile={setProfile}
          cardNum={i}
          isLast={i + 1 === profile.values.volunteerNum}
        />
      );
    }
    return cards;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid display="flex" style={{ minWidth: "100vh" }}>
        <div id="profile-container">
          <Grid container columnSpacing={2} sx={{ marginBottom: "1.5%" }}>
            <Grid
              item
              justifyContent="center"
              alignItems="center"
              display="flex"
            >
              <ProfilePicture urlProfilePicture={url} />
            </Grid>
            <Grid item xs={6} container>
              <InputBase
                id="standard-basic"
                style={{ fontSize: "45px" }}
                placeholder="First Name"
                value={profile.values.firstName}
                readOnly
                data-cy="firstName-test"
              />
              <InputBase
                id="standard-basic"
                style={{ fontSize: "45px" }}
                variant="standard"
                placeholder="Last Name"
                value={profile.values.lastName}
                readOnly
              />

              <InputBase
                id="standard-basic"
                style={{ fontSize: "25px" }}
                placeholder="School Name"
                variant="standard"
                value={profile.values.school}
                readOnly
              />

              <InputBase
                id="standard-basic"
                placeholder="City"
                variant="standard"
                value={profile.values.city}
                readOnly
              />

              <InputBase
                id="standard-basic"
                placeholder="Country"
                variant="standard"
                value={profile.values.country}
                readOnly
              />
            </Grid>
          </Grid>
          <Stack spacing={2}>
            {infoAvailable && (
              <>
                <ContactInfoCard setProfile={setProfile} profile={profile} />

                {/* <EducationCard
                setProfile={setProfile}
                profile={profile}
                currentUserEmail={currentUserEmail}
                /> */}
                {getEductionCards()}

                {/* <ExperienceCard
                setProfile={setProfile}
                profile={profile}
                currentUserEmail={currentUserEmail}
                /> */}
                {getExperienceCards()}

                <SkillsCard profile={profile} setProfile={setProfile} />

                {/* <LanguagesCard profile={profile} setProfile={setProfile} /> */}
                {getLanguageCards()}

                {/* <ProjectsCard profile={profile} setProfile={setProfile} /> */}
                {getProjectsCards()}

                {/* <VolunteeringCard profile={profile} setProfile={setProfile} /> */}
                {getVolunteeringCard()}

                {/* <AwardsCard profile={profile} setProfile={setProfile} /> */}
                {getAwardsCards()}

                <Button
                  onClick={() => {
                    console.log("Button Save Clicked");
                    handleTempButton();
                  }}
                  style={{
                    color: "white",
                  }}
                  data-cy="saveBtn"
                >
                  Save Changes
                </Button>
              </>
            )}
            {!infoAvailable && <p>Loading</p>}
          </Stack>
        </div>
      </Grid>
    </ThemeProvider>
  );
};

export default EditProfilePage;
