import React from "react";
import "./App.css";
import Background from "./Background/Background";
import Home from "./Home/Home";
import AnotherPage from "./AnotherPage/AnotherPage";

const App = () => {
  const hello = "hello";

  //asds//

  return (
    <div className="App">
      <Home />
      <Background />
      <AnotherPage />
    </div>
  );
};

export default App;
