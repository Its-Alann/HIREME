/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./Home.css";
import mainVideo from "../Assets/AdobeStock_Video1.mov";

const Home = () => (
  <div className="Home" id="Home">
    <div className="overlay" />
    <video src={mainVideo} autoPlay loop muted playsInline />
    <div className="content">
      <h1>Welcome</h1>
      <a href="#">Enter</a>
    </div>
  </div>
);

export default Home;
