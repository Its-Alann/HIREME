/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { ref, getDownloadURL } from "firebase/storage";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { PropTypes } from "prop-types";
import { styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { getDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import { db, storage } from "../../Firebase/firebase";

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
  const { t, i18n } = useTranslation();
  const [imageUrl, setImageUrl] = useState({});

  const getProfilePicture = async () => {
    //Get profile picture
    console.log(possibleConnectionUserId);
    const profilePictureLink = `${possibleConnectionUserId}-profilePicture`;
    const imageRef = ref(storage, `profile-pictures/${profilePictureLink}`);
    getDownloadURL(imageRef)
      // eslint-disable-next-line no-shadow
      .then((imageUrl) => {
        setImageUrl(imageUrl);
      })
      .catch((error) => {
        setImageUrl(null);
        console.log(error.message, "error getting the image url");
      });
  };

  useEffect(() => {
    // console.log(connectedUserID);
    // console.log(allUserProfiles);
    const findPossibleConnectionUserProfile = allUserProfiles.find(
      (el) => el.id === possibleConnectionUserId
    );
    // console.log(findConnectUserProfile);
    setPossibleConnectionUser(findPossibleConnectionUserProfile);
    getProfilePicture();
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
      let userReceivingInvitationNotificationsSnap = await getDoc(
        userReceivingInvitationNotificationsRef
      );

      // Check if the document exists
      if (userReceivingInvitationNotificationsSnap.exists()) {
        console.log("Notification document exists for this user");
      } else {
        console.log("Notification document exists for this user");
        console.log("Creating notification document for this user!");
        console.log(possibleConnectionUserId);
        // Add user email to notifications collection
        await setDoc(doc(db, "notifications", possibleConnectionUserId), {
          notifications: [],
          notificationForJobs: true,
          notificationForConnections: true,
        });
        userReceivingInvitationNotificationsSnap = await getDoc(
          userReceivingInvitationNotificationsRef
        );
      }
      // Check if the user receiving the notification has the setting turned on
      if (
        userReceivingInvitationNotificationsSnap.data()
          .notificationForConnections === true
      ) {
        const currentUserRef = doc(db, "userProfiles", currentUser);
        const currentUserSnap = await getDoc(currentUserRef);
        const currentDate = new Date();
        await updateDoc(userReceivingInvitationNotificationsRef, {
          notifications: arrayUnion(
            ...[
              {
                type: "connections",
                content: `Invitation sent from: ${
                  currentUserSnap.data().values.firstName
                } ${currentUserSnap.data().values.lastName}`,
                timestamp: currentDate,
              },
            ]
          ),
        });
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
                      src={imageUrl}
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
                    {t("SendInvitation")}
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
