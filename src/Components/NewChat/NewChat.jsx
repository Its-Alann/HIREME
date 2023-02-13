import React from "react";
import Fab from "@material-ui/core/Fab";
import AddBox from "@material-ui/icons/AddBox";
import Button from "@mui/material/Button";
import { getAuth } from "firebase/auth";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";

const messagesRef = collection(db, "messages");

//authors is an array
const findConversation = (authors) => {
  //check if conversation already exists
  //find a document in the db where the authors match the conversation

  //ex converstation with: jo, alice
  //current user: yuchen
  //authors: [jo, alice, yuchen]

  // arr = [alice, jo]
  const convoQuery = query(
    messagesRef,
    where("authors", "array-contains-any", authors)
  );
};

// const createNewConversation = () => {

// }

const handleClick = (props) => {
  //create a new conversation
  const timestamp = Date().toLocaleUpperCase();
  const sender = auth.currentUser.email;
  // const sender = billybob@gmail.com; //for testing
  const newMessage = {
    content: props.messageContent,
    timestamp,
    sender,
  };
};

/*
props {
  authors: [...people]
}
*/

const NewChat = (props) => (
  <Fab color="orange" aria-label="add">
    <Button
      type="button"
      onClick={() => {
        handleClick(props);
      }}
    >
      <AddBox />
    </Button>
  </Fab>
);

export default NewChat;
