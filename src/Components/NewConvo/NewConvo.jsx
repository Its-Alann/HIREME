import React, { useState } from "react";
import Fab from "@mui/material/Fab";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Autocomplete, Grid, TextField, Button } from "@mui/material";
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
  // console.log(authorsList);

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

// ! authors will be a list of authors without the current user
const handleClick = async (authors) => {
  const conversationID = await findConversation([
    "ryan.p.wong2000@gmail.com",
    "rck2021@gmail.com",
  ]);
  // authors.sort();
  // const conversationID = await findConversation(authors);

  console.log(conversationID);
};

const NewConvo = () => {
  // const [authors, setAuthors] = useState([auth.currentUser.email]);
  const antinos = "🖖";
  //TODO make a form that allows the currentuser to select from a list of contacts (should be a multiselect to allow group chats)
  //TODO add the emails from the search bar to authors state
  return (
    <Grid container>
      <Grid item xs={11}>
        <Autocomplete
          autoComplete
          multiple
          options={["so", "wiz khalifa", "macklemore"]} //TODO get a list of contacts
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
      <Grid item align="right" xs={1}>
        <Fab
          aria-label="add"
          type="button"
          onClick={() => {
            handleClick();
          }}
        >
          <AddBoxIcon />
        </Fab>
      </Grid>
    </Grid>
  );
};

export default NewConvo;
