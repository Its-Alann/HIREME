/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./Home.css";
import Typewriter from "typewriter-effect";
import SignInGoogleButton from "../SignInGoogleButton/SignInGoogleButton";
import mainVideo from "../Assets/videos/AdobeStock_Video1.mov";

const Home = () => (
  <div className="Home" id="Home">
    <div className="overlay" />
    <video src={mainVideo} autoPlay loop muted playsInline />
    <div className="content">
      <h1>
        HIRE<span style={{ color: "#2B2F90" }}>ME</span>
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
      <a href="/signin" data-testid="homeLink">
        Sign In
      </a>
      <a href="/accountCreation"> Create your profile</a>
    </div>
  </div>
);

export default Home;
