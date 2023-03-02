/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./Home.css";
import Typewriter from "typewriter-effect";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Tilt from "react-parallax-tilt";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import SignInGoogleButton from "../../Components/SignInGoogleButton/SignInGoogleButton";
import mainVideo from "../../Assets/videos/AdobeStock_Video1.mov";
import { auth, app } from "../../Firebase/firebase";
import HomepagePic from "../../Assets/images/homepage1.png";

import Login from "../Login/Login";

const Home = () => {
  const [user, setUser] = useState(null); //setting to uid cause idk what else to put for now
  const db = getFirestore(app);
  const [formCompleted, setFormCompleted] = useState(false);

  const checkFormCompletion = async (email) => {
    const docRef = doc(db, "userProfiles", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFormCompleted(true);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const { uid, email } = authUser;
        console.log("uid", uid);
        console.log("email", email);
        setUser(uid);
        checkFormCompletion(email);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("signed out");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#2B2F90" },
      background: { main: "#EAEAEA" },
      gray: { main: "#757575" },
    },
    typography: {
      fontFamily: ["Proxima Nova"],
      fontSize: 15,
    },
  });

  // <ThemeProvider theme={theme}></ThemeProvider>

  return (
    <Grid>
      <Grid container sx={{ bgcolor: "#EAEAEA" }}>
        {user ? (
          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              alignItems="center"
              justifyContent="center"
              display="flex"
            >
              <Box
                component="img"
                sx={{
                  objectFit: "cover",
                  width: 0.9,
                  height: 0.9,
                }}
                src={HomepagePic}
                // alt="Trees"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <button
                id="signout"
                type="button"
                data-testid="homeLink"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
              {formCompleted === false ? (
                <a href="/accountCreation" data-testid="createProfileLink">
                  Create your profile
                </a>
              ) : (
                <a href="/editProfile" id="glass-btn">
                  {" "}
                  Edit your profile{" "}
                </a>
              )}
            </Grid>
          </Grid>
        ) : (
          <div>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                alignItems="center"
                justifyContent="center"
                display="flex"
              >
                <Box
                  component="img"
                  sx={{
                    objectFit: "cover",
                    width: 0.9,
                    height: 0.9,
                  }}
                  src={HomepagePic}
                  // alt="Trees"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Login sx={{ bgcolor: "red" }} />
              </Grid>
            </Grid>
          </div>
        )}
        {/* <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              alignItems="center"
              justifyContent="center"
              display="flex"
            >
              <Box
              component="img"
                sx={{
                  objectFit: "cover",
                  width: 0.9,
                  height: 0.9,
                }}
                src={HomepagePic}
                // alt="Trees"
              />
              </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Login />
            </Grid>
          </Grid> */}
      </Grid>
    </Grid>
  );
};

export default Home;
