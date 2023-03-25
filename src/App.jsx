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
import { CreateCompany2 } from "./Pages/Company/CreateCompany2";
import { CreateRecruiter2 } from "./Pages/Recruiter/CreateRecruiter2";
import { CreateJob2 } from "./Pages/Job/CreateJob2";
import { BrowseJobs2 } from "./Pages/Job/BrowseJobs2";
import { MyJobs2 } from "./Pages/Job/MyJobs2";
import JobApplication2 from "./Pages/Job/JobApplication/JobApplication2";
import { EditJob2 } from "./Pages/Job/EditJob2";
import { JobPostingApplicants2 } from "./Pages/Recruiter/JobPostingApplicants2";
import { JobPosting2 } from "./Pages/Candidate/JobPosting2";
import { ViewMyApp2 } from "./Pages/Candidate/ViewMyApp2";

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

            {/* duplicate paths for job (refactoring) */}
            <Route path="/createCompany2" exact element={<CreateCompany2 />} />
            <Route
              path="/createRecruiter2"
              exact
              element={<CreateRecruiter2 />}
            />
            <Route path="/createJob2" exact element={<CreateJob2 />} />
            <Route path="/browseJobs2" exact element={<BrowseJobs2 />} />
            <Route path="/myJobs2" exact element={<MyJobs2 />} />
            <Route
              path="/jobApplication2/:companyID/:jobID"
              exact
              element={<JobApplication2 />}
            />
            <Route path="/editJob2/:jobID" exact element={<EditJob2 />} />
            <Route
              path="/viewJobPostingApplicants2/:companyID/:jobID"
              exact
              element={<JobPostingApplicants2 />}
            />
            <Route
              path="/viewJobPosting2/:companyID/:jobID"
              exact
              element={<JobPosting2 />}
            />
            <Route path="/viewMyApplications2" exact element={<ViewMyApp2 />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
