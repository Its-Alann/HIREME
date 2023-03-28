/* eslint-disable react/no-array-index-key */
import * as React from "react";
import PropTypes from "prop-types";
import { List, ListItem } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import MessageListItem from "./MessageListItem";
import { auth, storage, db } from "../../Firebase/firebase";

const MessageList = ({ messages, convoId }) => {
  const openAttachment = (path) => {
    getDownloadURL(ref(storage, `messages/${path}`)).then((url) =>
      window.open(url, "_blank")
    );
  };

  const reportMessage = async (index) => {
    // users cant unreport their own messages
    if (
      messages[index].sender === auth.currentUser.email &&
      messages[index].reported
    ) {
      return;
    }
    const convoRef = doc(db, "messages", convoId);
    const updatedMessages = messages;

    const reportedMessageDocId = `${convoId}-${index}`;

    if (messages[index].reported) {
      updatedMessages[index] = {
        ...messages[index],
        reported: false,
      };

      //delete message doc from reportedMessages collection
      try {
        await deleteDoc(doc(db, "reportedMessages", reportedMessageDocId));
      } catch (err) {
        console.log(err);
      }
    } else {
      updatedMessages[index] = {
        ...messages[index],
        reported: true,
      };

      // add the message to the reportedMessages collection
      await setDoc(doc(db, "reportedMessages", reportedMessageDocId), {
        ...messages[index],
        convoId,
        index,
      });
    }

    // console.log("updatedMessages", updatedMessages);
    await updateDoc(convoRef, {
      messages: updatedMessages,
    });

    console.log("idol", messages[index]);
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
            sx={{
              justifyContent: alignment,
              "&:hover .messageOptions": {
                display: "inline-block",
                color: "grey",
              },
            }}
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
  // eslint-disable-next-line react/forbid-prop-types
  messages: PropTypes.arrayOf(PropTypes.any),
  convoId: PropTypes.string,
};
export default MessageList;
