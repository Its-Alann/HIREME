import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AccountCreationPage from "./Pages/AccountCreation/AccountCreationPage";
import FlaggedMessages from "./Pages/Admin/FlaggedMessages";
import { JobPosting } from "./Pages/Candidate/JobPosting";
import { ViewMyApp } from "./Pages/Candidate/ViewMyApp";
import { CreateCompany } from "./Pages/Company/CreateCompany";
import EditProfilePage from "./Pages/EditProfile/EditProfilePage";
import HomePage from "./Pages/Home/HomePage";
import { BrowseJobs } from "./Pages/Job/BrowseJobs";
import { CreateJob } from "./Pages/Job/CreateJob";
import { EditJob } from "./Pages/Job/EditJob";
import JobApplication from "./Pages/Job/JobApplication/JobApplication";
import { MyJobs } from "./Pages/Job/MyJobs";
import LoginPage from "./Pages/Login/LoginPage";
import ResetPassword from "./Pages/Login/ResetPassword";
import MessagingPage from "./Pages/Messaging/MessagingPage";
import { ReceivedInvitation } from "./Pages/Network/Invitation/ReceivedInvitation";
import { SentInvitation } from "./Pages/Network/Invitation/SentInvitation";
import NetworkPage from "./Pages/Network/NetworkPage";
import { NetworkPossibleConnections } from "./Pages/Network/NetworkPossibleConnections";
import { CreateRecruiter } from "./Pages/Recruiter/CreateRecruiter";
import { JobPostingApplicants } from "./Pages/Recruiter/JobPostingApplicants";
import SignUpPage from "./Pages/SignUp/SignUpPage";
import NotificationsPage from "./Pages/Notifications/NotificationsPage";
import SettingsPage from "./Pages/Setting/SettingsPage";

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
              element={<CreateRecruiter />}
            />
            <Route path="/createJob" exact element={<CreateJob />} />
            <Route path="/browseJobs" exact element={<BrowseJobs />} />
            <Route path="/myJobs" exact element={<MyJobs />} />
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
              path="/notifications"
              exact
              element={<NotificationsPage />}
            />
            <Route path="/settings" exact element={<SettingsPage />} />
            <Route path="/resetPassword" exact element={<ResetPassword />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
