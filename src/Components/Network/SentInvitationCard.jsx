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
import { getDoc, doc, deleteField } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[800]),
  backgroundColor: blue[800],
  "&:hover": {
    backgroundColor: blue[900],
  },
}));

export const SentInvitationCard = ({ userID, currentUser }) => {
  const [sentRequestedUser, setSentRequestedUser] = useState([]);

  useEffect(() => {
    const getSentRequestUsers = async () => {
      try {
        const docSnap = await getDoc(doc(db, "userProfiles", userID));
        const userData = docSnap.data();
        setSentRequestedUser(userData);
        //console.log(userData);
      } catch (err) {
        console.log(err);
      }
    };

    getSentRequestUsers();
  }, []);

  const withdraw = async () => {
    // 1. remove user from invitations.sentRequest
    // 2. remove user card
    const sentUserRequestRef = doc(db, "invitations", currentUser);
    try {
      console.log(5);
    } catch (error) {
      console.log(error);
    }
  };

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
                  src={sentRequestedUser.values.image}
                />
              }
              //title will be the user's name and subheader is their bio
              title={
                sentRequestedUser.values.firstName !== "" &&
                sentRequestedUser.values.lastName !== ""
                  ? `${sentRequestedUser.values.firstName} ${sentRequestedUser.values.lastName}`
                  : "No name"
              }
              subheader={
                //remove != null when incomplete users are removed
                sentRequestedUser.values.description !== "" &&
                sentRequestedUser.values.description != null
                  ? `${sentRequestedUser.values.description}`
                  : "No bio"
              }
            />
            {/*moves the buttons to the right*/}
            <Box display="flex" justifyContent="center">
              <CardActions>
                {/*view profile will go to the user's profile and message will be sent to the */}
                <ColorButtonBlue size="medium" onClick={withdraw}>
                  Withdraw
                </ColorButtonBlue>
              </CardActions>
            </Box>
          </>
        </Card>
      </Box>
    </div>
  );
};

SentInvitationCard.propTypes = {
  userID: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default SentInvitationCard;
