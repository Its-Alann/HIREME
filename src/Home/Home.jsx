/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./Home.css";
import Typewriter from "typewriter-effect";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import SignInGoogleButton from "../SignInGoogleButton/SignInGoogleButton";
import mainVideo from "../Assets/videos/AdobeStock_Video1.mov";
import { auth } from "../Firebase/firebase";

const Home = () => {
  const [user, setUser] = useState(null); //setting to uid cause idk what else to put for now

  onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
      const { uid } = authUser;
      console.log("uid", uid);
      setUser(uid);
    } else {
      setUser(null);
    }
  });

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
        <h1>
          <span id="titleHire">HIRE</span>
          <span id="titleME" style={{ color: "#2B2F90" }}>
            ME
          </span>
        </h1>
        <h2>
          Connect with
          <Typewriter
            options={{
              strings: ["Peers", "Potential Employers", "Partners", "Clients"],
              autoStart: true,
              loop: true,
              deleteSpeed: 50,
            }}
          />
        </h2>
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
          <a href="/signin" data-testid="homeLink">
            Sign In
          </a>
        )}
      </div>
    </div>
  );
};

export default Home;
