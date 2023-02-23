import React from "react";
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
import Messaging from "./Pages/Messaging/Messaging";
import AccountCreation from "./Pages/AccountCreation/AccountCreation";
import { ViewNetwork } from "./Pages/Network/MyConnections/ViewNetwork";
import { SentInvitation } from "./Pages/Network/Invitation/SentInvitation";
import { Network } from "./Pages/Network/Network";
import { ReceivedInvitation } from "./Pages/Network/Invitation/ReceivedInvitation";
import { NetworkPossibleConnections } from "./Pages/Network/NetworkPossibleConnections";

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
          <Route path="/network" exact element={<Network />} />
          <Route path="/messaging" export element={<Messaging />} />
          <Route path="/myNetwork" exact element={<ViewNetwork />} />
          <Route path="/invitations" exact element={<ReceivedInvitation />} />
          <Route path="/sentRequests" exact element={<SentInvitation />} />
          <Route
            path="/possibleConnections"
            exact
            element={<NetworkPossibleConnections />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
