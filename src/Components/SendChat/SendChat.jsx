import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import {
  IconButton,
  Stack,
  Box,
  TextField,
  Typography,
  Button,
  Popover,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import Fab from "@mui/material/Fab";
import { SendRounded as SendRoundedIcon, Clear } from "@mui/icons-material";
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
import { useTranslation } from "react-i18next";
import EmojiPicker from "emoji-picker-react";
import FileUpload from "../FileUpload/FileUpload";
import { app, db, storage } from "../../Firebase/firebase";
import EmojiPickerButton from "../EmojiPicker/EmojiPickerButton";

const SendChat = ({ conversationID, myUser, selectedIndex }) => {
  const { t, i18n } = useTranslation();

  // const SendChat = ({ conversationID }) => {
  const [messageContent, setMessageContent] = useState("");
  const [url, setUrl] = useState();
  const [showPicker, setShowPicker] = useState(false);

  const [file, setFile] = useState();

  const [isUploading, setIsUploading] = useState(false);

  const [fileStorageRef, setFileStorageRef] = useState();

  const [uploadProgress, setUploadProgress] = useState(0);

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
        setUploadProgress(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.log("ERROR onFileUpload()", error);
      },
      async () => {
        const downloadedUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadedUrl);
        setIsUploading(false);
        // setMessageContent(downloadedUrl);
        console.log(`uploaded ${file.name} to storage!`);
      }
    );
  };

  const onFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    console.log("file", e.target.files[0]);
  };

  const deleteFile = async () => {
    if (!fileStorageRef) return;
    //delete from storage
    try {
      await deleteObject(fileStorageRef);
      console.log(`${file.name} deleted from storage!`);
    } catch (err) {
      console.log(err);
    }
  };

  const clearPreview = () => {
    setFile(null);
    setFileStorageRef(null);
    setMessageContent("");
  };

  const handleFileClear = () => {
    deleteFile().then(() => {
      clearPreview();
    });
  };

  const handleSend = async () => {
    if (!messageContent && !file) {
      console.log("NO CONTETN");
      return;
    }
    // Format a new message
    const timestamp = Timestamp.now();
    if (myUser) {
      console.log(myUser);
    } else {
      console.log("Not exist current user");
      return;
    }
    const sender = myUser;
    const newMessage = {
      timestamp,
      sender,
      seenBy: [myUser],
    };

    if (file) {
      newMessage.attachment = file.name;
    } else {
      newMessage.content = messageContent;
    }

    console.log(newMessage, newMessage.timestamp.toDate());

    // SENDS TO THE DB
    // ex id: "17k4dPDcymw3GcNjSCSG"
    await updateDoc(doc(db, "messages", conversationID), {
      messages: arrayUnion(newMessage),
    });

    clearPreview();
  };

  useEffect(
    //uplaod file to cloud storage
    uploadFile,
    [file]
  );

  return (
    <Stack>
      <Grid className="sendChatContainer" container>
        <Grid xs justifyItems="center" sx={{ height: 56 }}>
          {file ? (
            isUploading ? (
              <Grid container>
                <Typography variant="caption" noWrap>
                  {t("Uploading")}
                  {file.name} ...
                </Typography>
                <Typography variant="caption">{uploadProgress}%</Typography>
              </Grid>
            ) : (
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
            )
          ) : (
            <TextField
              variant="standard"
              hiddenLabel
              id="message-input"
              placeholder={t("TypeSomething")}
              fullWidth
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") await handleSend();
              }}
              value={messageContent}
              sx={{ m: 0 }}
              autoComplete="off"
            />
          )}
        </Grid>

        {messageContent === "" && !file && (
          <Grid
            xs={1}
            alignItems="center"
            justifyContent="center"
            sx={{ display: "flex", height: 56 }}
          >
            <FileUpload
              onFileChange={onFileChange}
              id="fileUpload"
              name="fileUpload"
            />
          </Grid>
        )}
        {!file && (
          <Grid
            xs={1}
            align="center"
            data-cy="emojiPickerButton"
            justifyContent="center"
            sx={{ display: "flex", height: 56 }}
          >
            <EmojiPickerButton
              setMessageContent={setMessageContent}
              setShowPicker={setShowPicker}
            />
          </Grid>
        )}
        <Grid
          xs={1}
          align="center"
          justifyContent="center"
          sx={{ display: "flex", height: 56 }}
        >
          <IconButton
            data-cy="send-button"
            color="primary"
            aria-label="add"
            type="button"
            size="small"
            disabled={isUploading}
            onClick={async () => {
              await handleSend();
            }}
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
  selectedIndex: PropTypes.number,
};

export default SendChat;
