import React from "react";
import "./App.css";
import Background from "./Background/Background";
import Home from "./Home/Home";
import AnotherPage from "./AnotherPage/AnotherPage";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";

const App = () => {
  const hello = "hello";

  //asds//

  return (
    <div className="App">
      {/* <Home />
      <Background />
      <AnotherPage /> */}
      <SignUp />
    </div>
  );
};

export default App;
