import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { Button, Stack, Box } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Fab from "@material-ui/core/Fab";
import { SendRoundedIcon, Clear } from "@mui/icons-material";
import { TextField } from "@material-ui/core";
import Grid from "@mui/material/Unstable_Grid2";
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
        // setMessageContent(`${messageContent} ${downloadedUrl}`);
      }
    );
  };

  const onFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    setMessageContent(e.target.files[0].name);
    console.log("file", e.target.files[0]);
  };

  const handleSend = async () => {
    if (!messageContent) {
      console.log("NO CONTETN");
      return;
    }
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
    await updateDoc(doc(db, "messages", conversationID), {
      messages: arrayUnion(newMessage),
    });
  };

  return (
    <Stack>
      {file && (
        <Box id="image-preview" sx={{ height: 56, bgcolor: "violet" }}>
          File: {file.name}
        </Box>
      )}

      <Grid className="sendChatContainer" container>
        <Grid xs={2} align="center" sx={{ height: 56 }}>
          <FileUpload onFileChange={onFileChange} onFileUpload={onFileUpload} />
        </Grid>
        <Grid xs justifyItems="center" sx={{ height: 56, p: 1 }}>
          <TextField
            hiddenLabel
            id="outlined-basic-email"
            placeholder="Type Something"
            fullWidth
            onChange={(e) => setMessageContent(e.target.value)}
            value={messageContent}
            sx={{ m: 0 }}
          />
        </Grid>

        <Grid
          xs={2}
          align="center"
          justifyItems="center"
          sx={{ height: 56, p: 1 }}
        >
          <Fab
            color="primary"
            aria-label="add"
            type="button"
            size="small"
            disabled={isUploading}
            onClick={async () => {
              await handleSend();
              setMessageContent("");
            }}
            sx={{ p: 1 }}
          >
            <SendRoundedIcon />
          </Fab>
        </Grid>
      </Grid>
    </Stack>
  );
};

SendChat.propTypes = {
  conversationID: PropTypes.string,
  myUser: PropTypes.string, //email
};

export default SendChat;
