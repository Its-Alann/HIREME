import * as React from "react";
import {
  doc,
  collection,
  getDoc,
  query,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";
import { Stack, Box, Button, Typography, Container } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import { auth, db } from "../../Firebase/firebase";
import JobCard from "../../Components/Jobs/JobCard";

export const ViewProfile = () => {
  const { userEmail } = useParams();
  const [currentUserID, setCurrentUserID] = React.useState(null);
  const [profile, setProfile] = React.useState(null);

  async function getProfile() {
    const profileSnapshot = await getDoc(doc(db, "userProfiles", userEmail));
    if (profileSnapshot.exists()) {
      const profileData = profileSnapshot.data();
      console.log(profileData);
      if (profileData.values) {
        setProfile(profileData.values);
      }
    }
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserID(user.uid);
      }
    });
  }, []);

  React.useEffect(() => {
    getProfile();
  }, [userEmail]);

  if (profile) {
    return (
      <>
        <Typography variant="h4">View Someone profile</Typography>
        <Typography>{profile.firstName || " no first name "}</Typography>
        <Typography>{profile.lastName || " no last name "}</Typography>
        <Box
          component="img"
          sx={{
            // objectFit: "cover",
            width: "6rem",
            height: "6rem",
            mr: 2,
          }}
          src={
            profile.image
              ? profile.image
              : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
          }
        />

        <Typography>And some other info (not complete)</Typography>
      </>
    );
  }
  return <Typography variant="h4">nothing found</Typography>;
};
export default ViewProfile;
