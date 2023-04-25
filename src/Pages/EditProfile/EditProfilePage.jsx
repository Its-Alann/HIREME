import { React, useState, useEffect } from "react";
import { doc, getFirestore, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Grid, Stack, Button, InputBase } from "@mui/material";
import { ref, getDownloadURL } from "firebase/storage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import Resume from "../../Components/ProfileCards/Resume";

const EditProfilePage = () => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

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
  const [field, setField] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const database = getFirestore(app);
  const [imageUrl, setImageUrl] = useState();
  const [resumeUrl, setResumeUrl] = useState();
  const [infoAvailable, setInfoAvailable] = useState(false);
  const location = useLocation();
  const [visitedProfile, setVisitedProfile] = useState(false);
  const [editButton, setEditButton] = useState(false);

  //callback function to make sure setState updates state before its next use (i think)
  // function outputProfile() {
  //   console.log(profile);
  // }

  // Only once, attach listener to onAuthStateChanged
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // Check if the profile is visited by an external user
      if (user && location.state === null) {
        setCurrentUserEmail(user.email);
      } else if (location.state !== null) {
        setCurrentUserEmail(location.state.userID);
        setVisitedProfile(true);
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
          setField(userProfileSnapShot.data().field);
        } else {
          console.log("User Profile Not Exist");
        }
        //Get profile picture
        console.log(currentUserEmail);
        const profilePictureLink = `${currentUserEmail}-profilePicture`;
        const imageRef = ref(storage, `profile-pictures/${profilePictureLink}`);
        getDownloadURL(imageRef)
          // eslint-disable-next-line no-shadow
          .then((imageUrl) => {
            setImageUrl(imageUrl);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });

        //Get user resume from firebase
        const resumeLink = `${currentUserEmail}-resume`;
        const resumeRef = ref(storage, `resumes/${resumeLink}`);
        getDownloadURL(resumeRef)
          // eslint-disable-next-line no-shadow
          .then((resumeUrl) => {
            setResumeUrl(resumeUrl);
          })
          .catch((error) => {
            console.log(error.message, "error getting the resume url");
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
      await updateDoc(userProfileDocRef, {
        field,
      });
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
          visitingProfile={visitedProfile}
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
          visitingProfile={visitedProfile}
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
          visitingProfile={visitedProfile}
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
          visitingProfile={visitedProfile}
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
          visitingProfile={visitedProfile}
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
          visitingProfile={visitedProfile}
        />
      );
    }
    return cards;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        display="flex"
        style={{ maxWidth: "100%" }}
        justifyContent="center"
      >
        <div id="profile-container">
          <Grid container justifyContent="space-between">
            <Grid
              item
              xs={10}
              container
              columnSpacing={3}
              sx={{ marginBottom: "1.5%", marginLeft: 0 }}
            >
              <Grid item alignItems="center" display="flex">
                <ProfilePicture
                  urlProfilePicture={imageUrl}
                  visitingProfile={visitedProfile}
                />
              </Grid>
              <Grid item xs={5} container>
                <InputBase
                  id="standard-basic"
                  style={{ fontSize: "45px" }}
                  placeholder={t("FirstName")}
                  value={profile.values.firstName}
                  name="firstName"
                  readOnly={!editButton}
                  error={editButton}
                  onChange={(e) =>
                    setProfile({
                      values: {
                        ...profile.values,
                        firstName: e.target.value,
                      },
                    })
                  }
                />
                <InputBase
                  id="standard-basic"
                  style={{ fontSize: "45px" }}
                  variant="standard"
                  placeholder={t("LastName")}
                  value={profile.values.lastName}
                  name="lastName"
                  readOnly={!editButton}
                  error={editButton}
                  onChange={(e) =>
                    setProfile({
                      values: {
                        ...profile.values,
                        lastName: e.target.value,
                      },
                    })
                  }
                />

                <InputBase
                  id="standard-basic"
                  style={{ fontSize: "25px", width: "100%" }}
                  placeholder={t("SchoolName")}
                  variant="standard"
                  value={profile.values.school}
                  name="school"
                  readOnly={!editButton}
                  error={editButton}
                  onChange={(e) =>
                    setProfile({
                      values: {
                        ...profile.values,
                        school: e.target.value,
                      },
                    })
                  }
                />

                <InputBase
                  id="standard-basic"
                  placeholder={t("City")}
                  variant="standard"
                  value={profile.values.city}
                  readOnly
                />

                <InputBase
                  id="standard-basic"
                  placeholder={t("Country")}
                  variant="standard"
                  value={profile.values.country}
                  readOnly
                />
                <InputBase
                  id="standard-basic"
                  variant="standard"
                  placeholder={t("DesiredJobTitle")}
                  name="field"
                  value={field}
                  readOnly={!editButton}
                  error={editButton}
                  onChange={(e) => setField(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid item>
              <EditIcon
                onClick={() => setEditButton(!editButton)}
                style={{
                  cursor: "pointer",
                  color: "white",
                  display: visitedProfile ? "none" : "inline",
                }}
              />
            </Grid>
          </Grid>

          {/* Resume section for user to add,modify or remove */}
          <Resume resumeUrl={resumeUrl} visitingProfile={visitedProfile}>
            {" "}
          </Resume>

          <Stack spacing={2}>
            {infoAvailable && (
              <>
                <ContactInfoCard
                  setProfile={setProfile}
                  profile={profile}
                  visitingProfile={visitedProfile}
                />

                {getEductionCards()}

                {getExperienceCards()}

                <SkillsCard
                  profile={profile}
                  setProfile={setProfile}
                  visitingProfile={visitedProfile}
                />

                {getLanguageCards()}

                {getProjectsCards()}

                {getVolunteeringCard()}

                {getAwardsCards()}

                <Button
                  onClick={() => {
                    console.log("Button Save Clicked");
                    handleTempButton();
                  }}
                  style={{
                    color: "white",
                    display: visitedProfile ? "none" : "inline",
                  }}
                  data-cy="saveBtn"
                >
                  {t("SaveChanges")}
                </Button>
              </>
            )}
            {!infoAvailable && <p>{t("Loading")}</p>}
          </Stack>
        </div>
      </Grid>
    </ThemeProvider>
  );
};

export default EditProfilePage;
