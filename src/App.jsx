import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Background from "./Background/Background";
import Home from "./Home/Home";
import AnotherPage from "./AnotherPage/AnotherPage";
import SignIn from "./SignIn/SignIn";

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
        </Routes>
      </Router>
    </div>
  );
};

export default App;
