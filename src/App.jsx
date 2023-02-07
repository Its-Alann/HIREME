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
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import AccountCreation from "./Pages/AccountCreation/AccountCreation";
import ViewNetwork from "./Pages/Network/MyConnections/ViewNetwork";

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
          <Route path="/signin" exact element={<SignIn />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/accountCreation" exact element={<AccountCreation />} />
          <Route path="/viewnetwork" exact element={<ViewNetwork />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
