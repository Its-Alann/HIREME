import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Fab from "@mui/material/Fab";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  addDoc,
} from "firebase/firestore";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { Autocomplete, TextField, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { auth, db } from "../../Firebase/firebase";

const messagesRef = collection(db, "messages");

//authors is an array
//find a document in the db where the authors match the conversation

//ex converstation with: jo, alice
//current user: yuchen
//authors: [jo, alice, yuchen]

// arr = [alice, jo]
const findConversation = async (authorsList) => {
  authorsList.sort();
  console.log(authorsList);

  // THE AUTHORS MUST BE IN THE DB IN ALPHABETICAL ORDER
  // JUST DO .sort ON THE ARRAY BEFORE WRITING TO THE DOC
  const convoQuery = query(messagesRef, where("authors", "==", authorsList));
  const querySnapshot = await getDocs(convoQuery);

  //create new conversation
  if (querySnapshot.empty) {
    const docRef = await addDoc(collection(db, "messages"), {
      authors: authorsList,
    });
    console.log(
      "findConversation: no existing conversation found, creating new one between",
      authorsList,
      "new id:",
      docRef.id
    );

    return docRef.id;
  }

  console.log(
    "Existing conversations found between",
    authorsList,
    "id:",
    querySnapshot.docs[0].id
  );
  // technically an array, but I expect only one
  return querySnapshot.docs[0].id;
};

const NewConvo = ({ setConvoId }) => {
  // const [authors, setAuthors] = useState([auth.currentUser.email]);
  const antinos = "🖖";

  const [connections, setConnections] = useState([]);

  const [value, setValue] = useState();

  const getConnections = async (currentUser) => {
    const docRef = doc(db, "network", currentUser);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setConnections(docSnap.data().connectedUsers);
    } else {
      console.log("No connection doc found for user", currentUser);
    }
  };

  useEffect(() => {
    console.log("emiail", auth.currentUser.email);
    getConnections(auth.currentUser.email);
  }, []);

  // ! authors will be a list of authors without the current user
  const handleClick = async () => {
    setConvoId(await findConversation([auth.currentUser.email, ...value]));
  };
  //TODO make a form that allows the currentuser to select from a list of contacts (should be a multiselect to allow group chats)
  //TODO add the emails from the search bar to authors state
  return (
    <Grid container spacing={1}>
      <Grid xs>
        <Autocomplete
          // autoComplete
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          multiple
          options={connections} //TODO get a list of contacts
          size="small"
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              variant="standard"
              placeholder="Type a name or multiple names"
            />
          )}
        />
      </Grid>
      <Grid>
        <IconButton size="small" sx={{ p: 0 }} onClick={handleClick}>
          <BorderColorRoundedIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

NewConvo.propTypes = {
  setConvoId: PropTypes.func,
};

export default NewConvo;
