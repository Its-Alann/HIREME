import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { List, ListItem } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

// get our sender s email
//const user = auth.currentUser.email;
//
const user = "billybob@gmail.com";
const messagesRefProfile = collection(db, "userProfiles");
const messagesRef = collection(db, "messages");
// let conversationUser = "";

const ConnectionList = (props) => {
  const [dmList, setDmList] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // get all names of user's receivers
  const getAllReceivers = async () => {
    let querySnapshot = await getDocs(collection(db, "messages"));
    const allAuthors = [];
    querySnapshot.forEach((doc) => {
      // If the user is a participant in the conversation
      //  then add the rest of the participants
      if (doc.data().authors.includes(user)) {
        const recipients = doc
          .data()
          .authors.filter((author) => author !== user);

        allAuthors.push(recipients);
      }

      setDmList(allAuthors);
    });

    querySnapshot = await getDocs(collection(db, "userProfiles"));
    const allUsers = [];
    querySnapshot.forEach((doc) => {
      // If the user is a participant in the conversation
      //  then add the name of the participants
      const userID = doc.id;
      console.log(allAuthors);
      allAuthors.forEach((el) => {
        console.log(el[0] === userID);
        if (el[0] === userID) {
          allUsers.push(
            `${doc.data().values.firstName} ${doc.data().values.lastName}`
          );
        }
        setProfiles(allUsers);
      });
    });
  };

  useEffect(() => {
    // display automatically the names of the user's receivers
    getAllReceivers();
    console.log(profiles);
  }, []);

  const hello = "hello";
  return (
    <List>
      {profiles.map((el) => (
        <ListItem>{el}</ListItem>
      ))}
    </List>
  );
};

// ConnectionList.propTypes = {
//   connections: PropTypes.arrayOf(PropTypes.any),
// };
export default ConnectionList;
