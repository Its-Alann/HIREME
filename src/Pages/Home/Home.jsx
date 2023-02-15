/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./Home.css";
import Typewriter from "typewriter-effect";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Tilt from "react-parallax-tilt";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import Grid from "@mui/material/Grid";
import SignInGoogleButton from "../../Components/SignInGoogleButton/SignInGoogleButton";
import mainVideo from "../../Assets/videos/AdobeStock_Video1.mov";
import { auth } from "../../Firebase/firebase";
import Navbar from "../../Components/Navbar/Navbar";

const Home = () => {
  const [user, setUser] = useState(null); //setting to uid cause idk what else to put for now

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const { uid, email } = authUser;
        console.log("uid", uid);
        console.log("email", email);
        setUser(uid);
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

  return (
    <div className="Home" id="Home">
      <div className="overlay" />
      <video src={mainVideo} autoPlay loop muted playsInline />
      <div className="content">
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} gyroscope>
          <div id="card">
            <h1 id="title">
              <span id="titleHire">
                <div id="gradient">HIRE</div>
              </span>
              <span id="titleME">ME</span>
            </h1>
            <div id="businessInfo">
              <table>
                <tr>
                  <td>
                    <LocalPhoneIcon />
                  </td>
                  <td>Contact clients, partners and contractors</td>
                </tr>
                <tr>
                  <td>
                    <LocationOnIcon />
                  </td>
                  <td>Search by location to find the nearest job</td>
                </tr>
                <tr>
                  <td>
                    <InsertLinkIcon />
                  </td>
                  <td>Add your contact information easily</td>
                </tr>
              </table>
              <br />
              <br />
              <div id="type">
                Connect with &#160;
                <Typewriter
                  options={{
                    strings: [
                      "Peers",
                      "Potential Employers",
                      "Partners",
                      "Clients",
                    ],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                  }}
                />
              </div>
            </div>
          </div>
        </Tilt>

        {user ? (
          <div style={{ display: "grid" }}>
            <button
              id="signout"
              type="button"
              data-testid="homeLink"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
            <a href="/accountCreation"> Create your profile</a>
          </div>
        ) : (
          <a href="/login" data-testid="homeLink" id="glass-btn">
            Sign In
          </a>
        )}
      </div>
    </div>
  );
};

export default Home;
