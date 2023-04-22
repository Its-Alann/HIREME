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
import FlaggedMessages from "./Pages/Admin/FlaggedMessages";
import JobApplication from "./Pages/Job/JobApplication/JobApplication";
import { JobPostingApplicants } from "./Pages/Recruiter/JobPostingApplicants";
import { JobPosting } from "./Pages/Candidate/JobPosting";
import { ViewMyApp } from "./Pages/Candidate/ViewMyApp";
import ResetPassword from "./Pages/Login/ResetPassword";
import NotificationsPage from "./Pages/Notifications/NotificationsPage";
import SettingsPage from "./Pages/Setting/SettingsPage";
import EventCard from "./Components/Events/EventCard";
import EditEvent from "./Pages/Events/EditEvent";
import Events from "./Components/Events/Events";
import CreateEvent from "./Pages/Events/CreateEvent";
import { SavedJobs } from "./Pages/Job/SavedJobs";

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

  const companyID = "npx38jzGfcSJNhpN5LJx";
  const companyName = "Microsoft";
  const companyLogo =
    "https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FMicrosftLogo.png?alt=media&token=effc3862-bd6e-4a70-965c-816cad7bcc19";

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
            <Route path="/savedJobs" exact element={<SavedJobs />} />
            <Route
              path="/notifications"
              exact
              element={<NotificationsPage />}
            />
            <Route path="/settings" exact element={<SettingsPage />} />
            <Route path="/resetPassword" exact element={<ResetPassword />} />

            <Route
              path="/:companyID"
              exact
              element={
                <Events
                  companyID={companyID}
                  companyLogo={companyLogo}
                  companyName={companyName}
                />
              }
            />
            <Route
              path="/:companyID/createEvent"
              exact
              element={<CreateEvent />}
            />
            <Route
              path="/:companyID/editEvent/:eventID"
              exact
              element={<EditEvent />}
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
