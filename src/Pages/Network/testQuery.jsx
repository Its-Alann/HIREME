/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, auth } from "../../Firebase/firebase";

const theme = createTheme();

export const Test = () => {
  const usersRef = collection(db, "userProfiles");
  const connectionsRef = collection(db, "network");
  const [connectedUsersId, setConnectedUsersId] = useState([]);
  const [arrayOfConnectedUsers, updateArrayOfConnectedUsers] = useState([]);

  const user = auth.currentUser;
  console.log(user);

  useEffect(() => {
    const getConnectedUserIDs = async () => {
      // READ DATA
      try {
        // get data from reference collection

        const q = query(connectionsRef, where("user", "==", user.email));
        //const data = await getDocs(connectionsRef);
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
          // all users is an array of users
          ...doc.data(),
          id: doc.id,
        }));
        setConnectedUsersId(users[0].connectedUsers);
        //console.log(connectedUsersId[0]);
      } catch (err) {
        console.error(err);
      }
    };

    getConnectedUserIDs();
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xl" sx={{ m: 2 }}>
          <CssBaseline />
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Test;
