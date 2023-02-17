import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { Button } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import { Grid, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  listAll,
} from "firebase/storage";
import FileUpload from "../FileUpload/FileUpload";
import { app, db, storage } from "../../Firebase/firebase";

const theme = createTheme();

const bobId = "billybob@gmail.com";
const aliID = "aliceykchen01@gmail.com";

const auth = getAuth();

const SendChat = ({ conversationID, myUser }) => {
  // const SendChat = ({ conversationID }) => {
  const [messageContent, setMessageContent] = useState("");
  const [url, setUrl] = useState();

  const [file, setFile] = useState();

  const [isUploading, setIsUploading] = useState(false);

  const onFileUpload = () => {
    if (!file) return;
    const storageRef = ref(storage, `/messages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setIsUploading(true);
      },
      (error) => {
        console.log("error", error);
      },
      async () => {
        const downloadedUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadedUrl);
        setIsUploading(false);
        setMessageContent(`${messageContent} ${downloadedUrl}`);
      }
    );
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    e.preventDefault();
  };

  const handleClick = async () => {
    // Format a new message
    const timestamp = Timestamp.now();
    if (myUser) {
      console.log(myUser);
    } else {
      console.log("Not exist current user");
    }
    const sender = myUser;
    const newMessage = {
      content: messageContent,
      timestamp,
      sender,
    };

    console.log(newMessage, newMessage.timestamp.toDate());

    // SENDS TO THE DB
    // ex id: "17k4dPDcymw3GcNjSCSG"
    if (newMessage.content) {
      await updateDoc(doc(db, "messages", conversationID), {
        messages: arrayUnion(newMessage),
      });
    }
  };

  return (
    <Grid container style={{}}>
      <Grid item xs={2} align="center">
        <FileUpload onFileChange={onFileChange} onFileUpload={onFileUpload} />
      </Grid>
      <Grid item xs>
        <TextField
          id="outlined-basic-email"
          label="Type Something"
          fullWidth
          onChange={(e) => setMessageContent(e.target.value)}
          value={messageContent}
        />
      </Grid>

      <Grid item xs={2} align="right">
        <Fab
          color="secondary"
          aria-label="add"
          type="button"
          disabled={isUploading}
          onClick={() => {
            handleClick();
            setMessageContent("");
          }}
        >
          <SendIcon />
        </Fab>
      </Grid>
    </Grid>
  );
};

SendChat.propTypes = {
  conversationID: PropTypes.string,
  myUser: PropTypes.string, //email
};

export default SendChat;
