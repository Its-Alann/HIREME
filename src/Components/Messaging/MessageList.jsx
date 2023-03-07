/* eslint-disable react/no-array-index-key */
import * as React from "react";
import PropTypes from "prop-types";
import { List, ListItem } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import MessageListItem from "./MessageListItem";
import { auth, storage, db } from "../../Firebase/firebase";

const MessageList = ({ messages, convoId }) => {
  const openAttachment = (path) => {
    getDownloadURL(ref(storage, `messages/${path}`)).then((url) =>
      window.open(url, "_blank")
    );
  };

  const reportMessage = async (index) => {
    const convoRef = doc(db, "messages", convoId);
    const updatedMessages = messages;
    updatedMessages[index] = {
      ...messages[index],
      reported: true,
    };
    console.log("updatedMessages", updatedMessages);
    await updateDoc(convoRef, {
      messages: updatedMessages,
    });
  };

  return (
    <List data-cy="messageList">
      {messages.map((message, i) => {
        const alignment =
          message.sender === auth.currentUser.email ? "right" : "left";
        return (
          <ListItem
            data-testid="messageListItem"
            key={i}
            style={{ justifyContent: alignment }}
          >
            <MessageListItem
              message={message}
              alignment={alignment}
              openAttachment={openAttachment}
              index={i}
              reportMessage={reportMessage}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(),
  convoId: PropTypes.string,
};
export default MessageList;
