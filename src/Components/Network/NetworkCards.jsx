/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { PropTypes } from "prop-types";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { getDoc, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const theme2 = createTheme({
  palette: {
    primary: { main: "#2B2F90" },
    background: { main: "#EAEAEA" },
    gray: { main: "#757575" },
  },
  typography: {
    fontFamily: ["Proxima Nova"],
    fontSize: 15,
  },
});

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: "#EAEAEA",
  backgroundColor: "#2B2F90",
  "&:hover": {
    backgroundColor: "#2B2F60",
  },
}));

const ColorButtonLightBlue = styled(Button)(({ theme }) => ({
  color: "#2B2F90",
}));
const ColorButtonRed = styled(Button)(({ theme }) => ({
  backgroundColor: "red",
  size: "15px",
  fontSize: "10px",
  color: "white",
  border: "none",
  "&:hover": {
    backgroundColor: "red",
    size: "15px",
    fontSize: "10px",
    color: "white",
    border: "none",
  },
}));

export const NetworkCards = ({ connectedUserID, currentUser }) => {
  const [connectedUser, setConnectedUser] = useState([]);

  const removeConnection = async () => {
    const currentUserNetworkRef = doc(db, "network", currentUser);
    const connectedUserNetworkRef = doc(db, "network", connectedUserID);

    try {
      await updateDoc(currentUserNetworkRef, {
        connectedUsers: arrayRemove(connectedUserID),
      });

      await updateDoc(connectedUserNetworkRef, {
        connectedUsers: arrayRemove(currentUser),
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getConnectedUsers = async () => {
      try {
        const docSnap = await getDoc(doc(db, "userProfiles", connectedUserID));
        const userData = docSnap.data();
        setConnectedUser(userData);
      } catch (err) {
        console.log(err);
      }
    };

    getConnectedUsers();
  }, []);

  return (
    <ThemeProvider theme={theme2}>
      <div>
        <Box sx={{ width: 300, minWidth: 100 }}>
          <Card variant="outlined" sx={{ p: 1 }} data-cy="userProfileInNetwork">
            <>
              <CardHeader
                avatar={
                  //source will be the user's image
                  <Avatar
                    aria-label="user"
                    sx={{ width: 56, height: 56 }}
                    src={connectedUser.values.image}
                  />
                }
                //title will be the user's name and subheader is their bio
                title={
                  connectedUser.values.firstName !== "" &&
                  connectedUser.values.lastName !== ""
                    ? `${connectedUser.values.firstName} ${connectedUser.values.lastName}`
                    : "No name"
                }
                subheader={
                  //remove != null when incomplete users are removed
                  connectedUser.values.description !== "" &&
                  connectedUser.values.description != null
                    ? `${connectedUser.values.description}`
                    : "No bio"
                }
              />
              {/*moves the buttons to the right*/}
              <Box display="flex" flexDirection="column">
                <CardActions>
                  {/*view profile will go to the user's profile and message will be sent to the */}

                  <ColorButtonBlue size="medium">View Profile</ColorButtonBlue>
                  <ColorButtonLightBlue variant="outlined">
                    Message
                  </ColorButtonLightBlue>
                  <ColorButtonRed
                    size="medium"
                    variant="outlined"
                    onClick={removeConnection}
                  >
                    Remove Connection
                  </ColorButtonRed>
                </CardActions>
              </Box>
            </>
          </Card>
        </Box>
      </div>
    </ThemeProvider>
  );
};

NetworkCards.propTypes = {
  connectedUserID: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default NetworkCards;
