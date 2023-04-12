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
import { ViewProfile } from "./Pages/Network/ViewProfile";
import { CreateCompany } from "./Pages/Company/CreateCompany";
import { ViewCompany } from "./Pages/Company/ViewCompany";
import { EditCompany } from "./Pages/Company/EditCompany";
import { CreateRecruiter } from "./Pages/Recruiter/CreateRecruiter";
import { CreateJob } from "./Pages/Job/CreateJob";
import { BrowseJobs } from "./Pages/Job/BrowseJobs";
//import { MyJobs } from "./Pages/Job/MyJobs";
import { EditJob } from "./Pages/Job/EditJob";
import Navbar from "./Components/Navbar/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NetworkPage from "./Pages/Network/NetworkPage";
import FlaggedMessages from "./Pages/Admin/FlaggedMessages";
import JobApplication from "./Pages/Job/JobApplication/JobApplication";
import { JobPostingApplicants } from "./Pages/Recruiter/JobPostingApplicants";
import { JobPosting } from "./Pages/Candidate/JobPosting";
import { ViewMyApp } from "./Pages/Candidate/ViewMyApp";
import ResetPassword from "./Pages/Login/ResetPassword";

const App = () => {
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
  const [navbarUpdateToggle, setNavebarUpdateToggle] = React.useState(false);
  const toggleNavbarUpdate = () => {
    setNavebarUpdateToggle(!navbarUpdateToggle);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar navbarUpdateToggle={navbarUpdateToggle} />
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
              path="/editProfile/:connectionID"
              exact
              element={
                <ProtectedRoute redirect="/">
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/network" exact element={<NetworkPage />} />
            <Route path="/messaging" export element={<MessagingPage />} />
            {/* <Route path="/myNetwork" exact element={<ViewNetwork />} /> */}
            <Route path="/invitations" exact element={<ReceivedInvitation />} />
            <Route path="/sentRequests" exact element={<SentInvitation />} />
            <Route
              path="/admin/flaggedMessages"
              exact
              element={<FlaggedMessages />}
            />
            <Route
              path="/possibleConnections"
              exact
              element={<NetworkPossibleConnections />}
            />
            <Route path="/createCompany" exact element={<CreateCompany />} />
            <Route
              path="/createRecruiter"
              exact
              element={
                <CreateRecruiter toggleNavbarUpdate={toggleNavbarUpdate} />
              }
            />
            <Route path="/createJob" exact element={<CreateJob />} />
            <Route path="/browseJobs" exact element={<BrowseJobs />} />
            <Route
              path="/jobApplication/:companyID/:jobID"
              exact
              element={<JobApplication />}
            />
            <Route path="/editJob/:jobID" exact element={<EditJob />} />
            <Route
              path="/viewJobPostingApplicants/:companyID/:jobID"
              exact
              element={<JobPostingApplicants />}
            />
            <Route
              path="/viewJobPosting/:companyID/:jobID"
              exact
              element={<JobPosting />}
            />
            <Route path="/viewMyApplications" exact element={<ViewMyApp />} />
            <Route
              path="/viewCompany/:companyID"
              exact
              element={<ViewCompany />}
            />
            <Route
              path="/editCompany/:companyID"
              exact
              element={<EditCompany toggleNavbarUpdate={toggleNavbarUpdate} />}
            />
            <Route
              path="/viewProfile/:userEmail"
              exact
              element={<ViewProfile />}
            />
            <Route path="/resetPassword" exact element={<ResetPassword />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
