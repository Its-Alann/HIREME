import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { IconButton, Stack, Box } from "@mui/material";
import { getAuth } from "firebase/auth";
import Fab from "@material-ui/core/Fab";
import { SendRounded as SendRoundedIcon, Clear } from "@mui/icons-material";
import { TextField, Typography } from "@material-ui/core";
import Grid from "@mui/material/Unstable_Grid2";
import PropTypes from "prop-types";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  listAll,
  deleteObject,
} from "firebase/storage";
import FileUpload from "../FileUpload/FileUpload";
import { app, db, storage } from "../../Firebase/firebase";

const SendChat = ({ conversationID, myUser }) => {
  // const SendChat = ({ conversationID }) => {
  const [messageContent, setMessageContent] = useState("");
  const [url, setUrl] = useState();

  const [file, setFile] = useState();

  const [isUploading, setIsUploading] = useState(false);

  const [fileStorageRef, setFileStorageRef] = useState();

  const uploadFile = () => {
    if (!file) return;
    const storageRef = ref(storage, `/messages/${file.name}`);
    setFileStorageRef(storageRef);

    const metadata = {
      customMetadata: {
        conversationID,
      },
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setIsUploading(true);
      },
      (error) => {
        console.log("ERROR onFileUpload()", error);
      },
      async () => {
        const downloadedUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadedUrl);
        setIsUploading(false);
        console.log(`uploaded ${file} to storage!`);
      }
    );
  };

  const onFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    console.log("file", e.target.files[0]);
  };

  const handleFileClear = async () => {
    //delete from storage
    try {
      await deleteObject(fileStorageRef);
      console.log(`${file.name} deleted from storage!`);
      setFile(null);
      setFileStorageRef(null);
    } catch (err) {
      console.log(err);
    }
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

    setFileStorageRef();
  };

  useEffect(
    //uplaod file to cloud storage
    uploadFile,
    [file]
  );

  return (
    <Stack>
      <Grid className="sendChatContainer" container>
        <Grid xs justifyItems="center" sx={{ height: 56, p: 1 }}>
          {file ? (
            <Box
              id="file-preview"
              sx={{
                maxHeight: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {file.type.includes("image") && (
                <Box
                  component="img"
                  src={url}
                  alt={file.name}
                  sx={{ width: 36, height: 36, p: 1, display: "inline-flex" }}
                  xs
                />
              )}
              <Typography variant="caption" noWrap xs>
                {file.name}
              </Typography>
              <IconButton onClick={handleFileClear}>
                <Clear />
              </IconButton>
            </Box>
          ) : (
            <TextField
              hiddenLabel
              id="message-input"
              placeholder="Type Something"
              fullWidth
              onChange={(e) => setMessageContent(e.target.value)}
              value={messageContent}
              sx={{ m: 0 }}
            />
          )}
        </Grid>

        {messageContent === "" && (
          <Grid
            xs={1}
            alignItems="center"
            justifyContent="center"
            sx={{ display: "flex", height: 56 }}
          >
            <FileUpload onFileChange={onFileChange} />
          </Grid>
        )}

        <Grid
          xs={1}
          align="center"
          justifyContent="center"
          sx={{ display: "flex", height: 56 }}
        >
          <IconButton
            color="primary"
            aria-label="add"
            type="button"
            size="small"
            disabled={isUploading}
            onClick={async () => {
              await handleSend();
              setMessageContent("");
            }}
            // sx={{ p: 1 }}
          >
            <SendRoundedIcon color="primary" />
          </IconButton>
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
