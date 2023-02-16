/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { PropTypes } from "prop-types";
import { styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[600]),
  backgroundColor: blue[600],
  "&:hover": {
    backgroundColor: blue[700],
  },
}));

const ColorButtonLightBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[800]),
  backgroundColor: blue[800],
  "&:hover": {
    backgroundColor: blue[900],
  },
}));

export const NetworkCards = ({ connectedUserID }) => {
  const [connectedUser, setConnectedUser] = useState([]);

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
    <div>
      <Box sx={{ width: 300, minWidth: 100 }}>
        <Card variant="outlined" sx={{ p: 1 }}>
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
            <Box display="flex" justifyContent="flex-end">
              <CardActions>
                {/*view profile will go to the user's profile and message will be sent to the */}
                <ColorButtonBlue size="medium">View Profile</ColorButtonBlue>
                <ColorButtonLightBlue size="medium">
                  Message
                </ColorButtonLightBlue>
              </CardActions>
            </Box>
          </>
        </Card>
      </Box>
    </div>
  );
};

NetworkCards.propTypes = {
  connectedUserID: PropTypes.string.isRequired,
};

export default NetworkCards;
