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
import { blueGrey, blue } from "@mui/material/colors";
import {
  getDoc,
  doc,
  arrayRemove,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[600]),
  backgroundColor: blue[600],
  "&:hover": {
    backgroundColor: blue[700],
  },
}));

const ColorButtonBlueGray = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blueGrey[400]),
  backgroundColor: blueGrey[400],
  "&:hover": {
    backgroundColor: blueGrey[500],
  },
}));

export const ReceivedInvitationCard = ({
  receivedInvitationUserID,
  currentUser,
}) => {
  const [receivedInvitationUser, setReceivedInvitationUser] = useState([]);

  useEffect(() => {
    const getAcceptInvitationUsers = async () => {
      try {
        const docSnap = await getDoc(
          doc(db, "userProfiles", receivedInvitationUserID)
        );
        const userData = docSnap.data();
        setReceivedInvitationUser(userData);
      } catch (err) {
        console.log(err);
      }
    };

    getAcceptInvitationUsers();
  }, []);

  const ignoreInvite = async () => {
    // 1. remove user from invitations.requestUsers collection
    // 2. refresh page to remove user card
    const receivedInvitationRef = doc(db, "invitations", currentUser);
    try {
      await updateDoc(receivedInvitationRef, {
        receivedInvitations: arrayRemove(receivedInvitationUserID),
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const acceptInvite = async () => {
    // 1. add user to network collection
    // 2. remove them from the invitations.requestUsers collection
    // 3. refresh the page to remove user card
    const receivedInvitationRef = doc(db, "invitations", currentUser);
    const currentUserNetworkRef = doc(db, "network", currentUser);
    try {
      await updateDoc(receivedInvitationRef, {
        receivedInvitations: arrayRemove(receivedInvitationUserID),
      });

      await updateDoc(currentUserNetworkRef, {
        connectedUsers: arrayUnion(receivedInvitationUserID),
      });
      window.location.reload();
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
                  src={receivedInvitationUser.values.image}
                />
              }
              //title will be the user's name and subheader is their bio
              title={
                receivedInvitationUser.values.firstName !== "" &&
                receivedInvitationUser.values.lastName !== ""
                  ? `${receivedInvitationUser.values.firstName} ${receivedInvitationUser.values.lastName}`
                  : "No name"
              }
              subheader={
                //remove != null when incomplete users are removed
                receivedInvitationUser.values.description !== "" &&
                receivedInvitationUser.values.description != null
                  ? `${receivedInvitationUser.values.description}`
                  : "No bio"
              }
            />
            {/*moves the buttons to the right*/}
            <Box display="flex" justifyContent="flex-end">
              <CardActions>
                {/*view profile will go to the user's profile and message will be sent to the */}
                <ColorButtonBlueGray size="medium" onClick={ignoreInvite}>
                  Ignore
                </ColorButtonBlueGray>
                <ColorButtonBlue size="medium" onClick={acceptInvite}>
                  Accept
                </ColorButtonBlue>
              </CardActions>
            </Box>
          </>
        </Card>
      </Box>
    </div>
  );
};

ReceivedInvitationCard.propTypes = {
  receivedInvitationUserID: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default ReceivedInvitationCard;
