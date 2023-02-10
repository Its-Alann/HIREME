import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Background from "./Pages/Background/Background";
import Home from "./Pages/Home/Home";
import AnotherPage from "./Pages/AnotherPage/AnotherPage";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import AccountCreation from "./Pages/AccountCreation/AccountCreation";
import Messaging from "./Pages/Messaging/Messaging";
import SendChatButton from "./Components/SendChatButton/SendChatButton";
import Chat from "./Pages/Messaging/Chat";

const App = () => {
  const hello = "hello";

  //asds//

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/" exact element={<Background />} />
          <Route path="/" exact element={<AnotherPage />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/accountCreation" exact element={<AccountCreation />} />
          <Route path="/messaging" export element={<Messaging />} />
          <Route path="/temp" export element={<SendChatButton />} />
          <Route path="/chat" export element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
