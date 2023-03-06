/* eslint-disable react/no-array-index-key */
import * as React from "react";
import PropTypes from "prop-types";
import { List, ListItem } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import MessageListItem from "./MessageListItem";
import { auth, storage } from "../../Firebase/firebase";

const MessageList = ({ messages }) => {
  const openAttachment = (path) => {
    getDownloadURL(ref(storage, `messages/${path}`)).then((url) =>
      window.open(url, "_blank")
    );
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
              timestamp={message.timestamp.toDate()}
              content={message.content}
              attachment={message.attachment}
              sender={message.sender}
              alignment={alignment}
              openAttachment={openAttachment}
              index={i}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(),
};
export default MessageList;
