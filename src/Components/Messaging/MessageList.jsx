/* eslint-disable react/no-array-index-key */
import * as React from "react";
import PropTypes from "prop-types";
import { List, ListItem } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import MessageListItem from "./MessageListItem";
import { auth, storage, db } from "../../Firebase/firebase";

const MessageList = ({ messages, convoId }) => {
  // console.log(findLastSeen(messages, "hypeboy@tok.ki"));

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
    const updatedMessages = messages.map((m) => {
      const { readReceipt, ...res } = m;
      return res;
    });

    const reportedMessageDocId = `${convoId}-${index}`;

    // unreport a reported message
    if (messages[index].reported) {
      updatedMessages[index].reported = false;
      //delete message doc from reportedMessages collection
      try {
        await deleteDoc(doc(db, "reportedMessages", reportedMessageDocId));
      } catch (err) {
        console.log(err);
      }
    }
    // report an unreported message
    else {
      updatedMessages[index].reported = true;

      // add the message to the reportedMessages collection
      await setDoc(doc(db, "reportedMessages", reportedMessageDocId), {
        ...updatedMessages[index],
        convoId,
        index,
      });
    }

    // console.log("updatedMessages", updatedMessages);
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
            sx={{
              justifyContent: alignment,
              "&:hover .messageOptions": {
                // display: "inline-block",
                visibility: "visible",
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
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      attachment: PropTypes.string,
      seenBy: PropTypes.arrayOf(PropTypes.string),
      sender: PropTypes.string,
      // eslint-disable-next-line react/forbid-prop-types
      timestamp: PropTypes.object,
      reported: PropTypes.bool,
      readRecipt: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  convoId: PropTypes.string,
};
export default MessageList;
