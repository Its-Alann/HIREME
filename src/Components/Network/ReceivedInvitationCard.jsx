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

export const ReceivedInvitationCard = ({ requestedUserID, currentUser }) => {
  const [requestedUser, setRequestedUser] = useState([]);

  useEffect(() => {
    const getAcceptInvitationUsers = async () => {
      try {
        //console.log(userID);
        const docSnap = await getDoc(doc(db, "userProfiles", requestedUserID));
        const userData = docSnap.data();
        setRequestedUser(userData);
      } catch (err) {
        console.log(err);
      }
    };

    getAcceptInvitationUsers();
  }, []);

  const ignoreInvite = async () => {
    // 1. remove user from invitations.requestUsers collection
    // 2. refresh page to remove user card
    const requestInvitationRequestRef = doc(db, "invitations", currentUser);
    //console.log(requestedUserID);
    try {
      await updateDoc(requestInvitationRequestRef, {
        requestUsers: arrayRemove(requestedUserID),
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
    const requestInvitationRequestRef = doc(db, "invitations", currentUser);
    const currentUserNetworkRef = doc(db, "network", currentUser);
    //console.log(requestedUserID);
    try {
      await updateDoc(requestInvitationRequestRef, {
        requestUsers: arrayRemove(requestedUserID),
      });

      await updateDoc(currentUserNetworkRef, {
        connectedUsers: arrayUnion(requestedUserID),
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
                  src={requestedUser.values.image}
                />
              }
              //title will be the user's name and subheader is their bio
              title={
                requestedUser.values.firstName !== "" &&
                requestedUser.values.lastName !== ""
                  ? `${requestedUser.values.firstName} ${requestedUser.values.lastName}`
                  : "No name"
              }
              subheader={
                //remove != null when incomplete users are removed
                requestedUser.values.description !== "" &&
                requestedUser.values.description != null
                  ? `${requestedUser.values.description}`
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
  requestedUserID: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default ReceivedInvitationCard;
