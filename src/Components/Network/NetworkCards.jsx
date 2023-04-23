/* eslint-disable react/function-component-definition */
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
// import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
// import { Link } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { PropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, storage } from "../../Firebase/firebase";

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

export const NetworkCards = ({
  allUserProfiles,
  connectedUserID,
  currentUser,
}) => {
  const [connectedUser, setConnectedUser] = useState([]);
  const [open, setOpen] = React.useState(false);
  const { t, i18n } = useTranslation();
  const [imageUrl, setImageUrl] = useState({});
  const navigate = useNavigate();

  // console.log("currentUser", currentUser);
  // console.log("connectedUserID", connectedUserID);

  const getProfilePicture = async () => {
    //Get profile picture
    console.log(connectedUserID);
    const profilePictureLink = `${connectedUserID}-profilePicture`;
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

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

  const findConversationId = async () => {
    const messagesRef = collection(db, "messages");

    const authorList = [connectedUserID, currentUser].sort();
    console.log(authorList);

    const querySnapshot = await getDocs(
      query(messagesRef, where("authors", "==", authorList))
    );

    const matchingDocs = [];

    querySnapshot.forEach((document) => {
      if (
        document.data().authors.includes(currentUser) &&
        document.data().authors.includes(connectedUserID)
      ) {
        matchingDocs.push({ id: document.id });
      }
    });

    if (matchingDocs.length > 1) {
      console.log("more than one convo matched ERROR");
      return undefined;
    }

    //if the convo doesn't exist, create it
    if (matchingDocs?.[0]?.id === undefined) {
      const docRef = await addDoc(collection(db, "messages"), {
        authors: authorList,
        messages: [],
      });
      return docRef.id;
    }

    return matchingDocs?.[0]?.id;
  };

  useEffect(() => {
    // console.log(connectedUserID);
    // console.log(allUserProfiles);
    const findConnectUserProfile = allUserProfiles.find(
      (el) => el.id === connectedUserID
    );
    // console.log(findConnectUserProfile);
    setConnectedUser(findConnectUserProfile);
    getProfilePicture();
    console.log(5);
  }, [allUserProfiles, connectedUserID]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {connectedUser ? (
        <ThemeProvider theme={theme2}>
          <div>
            <Box sx={{ width: 300, minWidth: 100 }}>
              <Card
                variant="outlined"
                sx={{ p: 1 }}
                data-cy="userProfileInNetwork"
              >
                <>
                  <Stack direction="row" justifyContent="space-between">
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
                        connectedUser.values.firstName !== "" &&
                        connectedUser.values.lastName !== ""
                          ? `${connectedUser.values.firstName} ${connectedUser.values.lastName}`
                          : "No name"
                      }
                      subheader={
                        //remove != null when incomplete users are removed
                        connectedUser.values.description !== "" &&
                        connectedUser.values.description != null
                          ? connectedUser.values.description.length <= 24
                            ? `${connectedUser.values.description}`
                            : `${connectedUser.values.description.substring(
                                0,
                                21
                              )} ...`
                          : "No bio"
                      }
                    />
                    <Button onClick={handleClickOpen}>
                      <PersonRemoveIcon />
                    </Button>
                  </Stack>

                  {/*moves the buttons to the right*/}
                  <Box display="flex" flexDirection="column">
                    <CardActions>
                      {/*view profile will go to the user's profile and message will be sent to the */}
                      <Link
                        to={`/editProfile/${connectedUser.values.firstName}${connectedUser.values.lastName}`}
                        state={{ userID: connectedUserID }}
                      >
                        <ColorButtonBlue size="medium" sx={{ mx: 1 }}>
                          {t("ViewProfile")}
                        </ColorButtonBlue>
                      </Link>
                      {/* <Link to="/messaging" style={{ textDecoration: "none" }}> */}
                      <ColorButtonLightBlue
                        variant="outlined"
                        onClick={() => navigate("/messaging")}
                      >
                        {t("Message")}
                      </ColorButtonLightBlue>
                      {/* </Link> */}

                      {/* import PersonRemoveIcon from '@mui/icons-material/PersonRemove'; use this icon instead of the button */}
                      {/* <ColorButtonRed
                    size="medium"
                    variant="outlined"
                    onClick={handleClickOpen}
                  >
                    Remove Connection
                  </ColorButtonRed> */}

                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          Remove{" "}
                          {`${connectedUser?.values?.firstName ?? ""} ${
                            connectedUser?.values?.lastname ?? ""
                          }`}
                          from your connections?
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            The user will not be notified that you have removed
                            him from your connections
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button
                            onClick={removeConnection}
                            autoFocus
                            style={{ color: "red" }}
                          >
                            Remove user
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </CardActions>
                  </Box>
                </>
              </Card>
            </Box>
          </div>
        </ThemeProvider>
      ) : null}
    </>
  );
};

NetworkCards.propTypes = {
  allUserProfiles: PropTypes.arrayOf(PropTypes.Object).isRequired,
  connectedUserID: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default NetworkCards;
