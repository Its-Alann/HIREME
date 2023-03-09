import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomePage from "./Pages/Home/HomePage";
import LoginPage from "./Pages/Login/LoginPage";
import SignUpPage from "./Pages/SignUp/SignUpPage";
import MessagingPage from "./Pages/Messaging/MessagingPage";
import AccountCreationPage from "./Pages/AccountCreation/AccountCreationPage";
import EditProfilePage from "./Pages/EditProfile/EditProfilePage";
import { ViewNetwork } from "./Pages/Network/MyConnections/ViewNetwork";
import { SentInvitation } from "./Pages/Network/Invitation/SentInvitation";
import { ReceivedInvitation } from "./Pages/Network/Invitation/ReceivedInvitation";
import { NetworkPossibleConnections } from "./Pages/Network/NetworkPossibleConnections";
import { CreateCompany } from "./Pages/Company/CreateCompany";
import { CreateRecruiter } from "./Pages/Recruiter/CreateRecruiter";
import { CreateJob } from "./Pages/Job/CreateJob";
import { BrowseJobs } from "./Pages/Job/BrowseJobs";
import { MyJobs } from "./Pages/Job/MyJobs";
import { EditJob } from "./Pages/Job/EditJob";
import Navbar from "./Components/Navbar/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NetworkPage from "./Pages/Network/NetworkPage";

const App = () => {
  const hello = "helloo";

  //asds//

  const theme = createTheme({
    palette: {
      primary: { main: "#2B2F90" },
      background: { main: "#EAEAEA" },
      gray: { main: "#757575" },
    },
    typography: {
      fontFamily: ["Proxima Nova"],
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/login" exact element={<LoginPage />} />
            <Route path="/signup" exact element={<SignUpPage />} />
            <Route
              path="/accountCreation"
              exact
              element={<AccountCreationPage />}
            />
            <Route
              path="/editProfile"
              exact
              element={
                <ProtectedRoute redirect="/">
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/network" exact element={<NetworkPage />} />
            <Route path="/messaging" export element={<MessagingPage />} />
            <Route path="/myNetwork" exact element={<ViewNetwork />} />
            <Route path="/invitations" exact element={<ReceivedInvitation />} />
            <Route path="/sentRequests" exact element={<SentInvitation />} />
            <Route
              path="/possibleConnections"
              exact
              element={<NetworkPossibleConnections />}
            />
            <Route path="/createCompany" exact element={<CreateCompany />} />
            <Route
              path="/createRecruiter"
              exact
              element={<CreateRecruiter />}
            />
            <Route path="/createJob" exact element={<CreateJob />} />
            <Route path="/browseJobs" exact element={<BrowseJobs />} />
            <Route path="/myJobs" exact element={<MyJobs />} />
            <Route path="/editJob/:jobID" exact element={<EditJob />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
