/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../../../Components/Navbar/Navbar";
import { NetworkCards } from "../../../Components/Network/NetworkCards";
import { db, auth } from "../../../Firebase/firebase";

const theme = createTheme();

export const ViewNetwork = () => {
  const connectionsRef = collection(db, "network");
  const [connectedUsersId, setConnectedUsersId] = useState([]);

  const user = auth.currentUser;

  //console.log("user: ", user);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //get connected user IDs
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
            console.log("connectedUser", connectedUsersId[0]);
          } catch (err) {
            console.error("err:", err);
          }
        };

        getConnectedUserIDs();
      } else {
        //take you back to the homepage
        //console.log("2:", user);
      }
    });
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xl" sx={{ m: 2 }}>
          <CssBaseline />
          <Box
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            display="flex"
          >
            {/*The array will contain all the connected users*/}
            <Grid
              container
              spacing={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {/* try allUsers.map */}
              {connectedUsersId.map((connectedUserID) => (
                <Grid item>
                  {/*pass in user's name, bio, image and ID*/}
                  {/* <NetworkCards
                    userImage={user.values.image}
                    userFirstName={user.values.firstName}
                    userLastName={user.values.lastName}
                    userBio={user.values.description}
                    userid={user.id}
                  /> */}
                  <NetworkCards connectedUserID={connectedUserID} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
      ;
    </div>
  );
};

export default ViewNetwork;
