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
import { getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import SendIcon from "@mui/icons-material/Send";
import { db } from "../../Firebase/firebase";

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[800]),
  backgroundColor: blue[800],
  "&:hover": {
    backgroundColor: blue[900],
  },
}));

export const PossibleConnectionCard = ({
  allUserProfiles,
  possibleConnectionUserId,
  currentUser,
}) => {
  const [possibleConnectionUser, setPossibleConnectionUser] = useState([]);

  useEffect(() => {
    // console.log(connectedUserID);
    // console.log(allUserProfiles);
    const findPossibleConnectionUserProfile = allUserProfiles.find(
      (el) => el.id === possibleConnectionUserId
    );
    // console.log(findConnectUserProfile);
    setPossibleConnectionUser(findPossibleConnectionUserProfile);
  }, [allUserProfiles, possibleConnectionUserId]);

  const sendInvitation = async () => {
    const currentUserSendingInvitationRef = doc(db, "invitations", currentUser);
    const userReceivingInvitationRef = doc(
      db,
      "invitations",
      possibleConnectionUserId
    );

    try {
      await updateDoc(currentUserSendingInvitationRef, {
        sentInvitations: arrayUnion(possibleConnectionUserId),
      });

      await updateDoc(userReceivingInvitationRef, {
        receivedInvitations: arrayUnion(currentUser),
      });

      // Add notification for user receiving invitation
      const userReceivingInvitationNotificationsRef = doc(
        db,
        "notifications",
        possibleConnectionUserId
      );
      const userReceivingInvitationNotificationsSnap = await getDoc(
        userReceivingInvitationNotificationsRef
      );
      // Check if the user receiving the notification has the setting turned on
      if(userReceivingInvitationNotificationsSnap.data().notificationForConnections === true)
      {
        const currentUserRef = doc(db, "userProfiles", currentUser);
        const currentUserSnap = await getDoc(currentUserRef);
        const currentDate = new Date();
        await updateDoc(userReceivingInvitationNotificationsRef, {
        notifications: arrayUnion(...[{
          type: "connections",
          content: `Invitation sent from: ${currentUserSnap.data().values.firstName} ${currentUserSnap.data().values.lastName}`,
          timestamp: currentDate,
        }])
        })
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {possibleConnectionUserId ? (
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
                      src={possibleConnectionUser.values.image}
                    />
                  }
                  //title will be the user's name and subheader is their bio
                  title={
                    possibleConnectionUser.values.firstName !== "" &&
                    possibleConnectionUser.values.lastName !== ""
                      ? `${possibleConnectionUser.values.firstName} ${possibleConnectionUser.values.lastName}`
                      : "No name"
                  }
                  subheader={
                    //remove != null when incomplete users are removed
                    possibleConnectionUser.values.description !== "" &&
                    possibleConnectionUser.values.description != null
                      ? possibleConnectionUser.values.description.length <= 24
                        ? `${possibleConnectionUser.values.description}`
                        : `${possibleConnectionUser.values.description.substring(
                            0,
                            21
                          )} ...`
                      : "No bio"
                  }
                />
                {/*moves the buttons to the right*/}
                <Box display="flex" justifyContent="center">
                  {
                    // <CardActions>
                  }
                  {/*view profile will go to the user's profile and message will be sent to the */}
                  <ColorButtonBlue
                    size="medium"
                    onClick={sendInvitation}
                    data-cy={`invitationButton${
                      possibleConnectionUser?.values?.firstName ?? ""
                    }`}
                    id={`invitationButton${
                      possibleConnectionUser?.values?.firstName ?? ""
                    }`}
                    sx={{ mb: 1 }}
                  >
                    Send Invitation
                  </ColorButtonBlue>
                  {
                    //</CardActions>
                  }
                </Box>
              </>
            </Card>
          </Box>
        </div>
      ) : null}
    </>
  );
};

PossibleConnectionCard.propTypes = {
  allUserProfiles: PropTypes.arrayOf(PropTypes.Object).isRequired,
  possibleConnectionUserId: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default PossibleConnectionCard;
