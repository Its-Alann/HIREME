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

const NewConvo = ({ selectConvo, getConversationId, getOtherAuthors }) => {
  const antinos = "🖖";

  const [connections, setConnections] = useState([]);

  const [value, setValue] = useState([]);

  const getConnections = async (currentUser) => {
    const docRef = doc(db, "network", currentUser);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log(docSnap.data());
      setConnections(docSnap.data().connectedUsers);
    } else {
      console.log("No connection doc found for user", currentUser);
    }
  };

  // load currentUser's connections in the options
  useEffect(() => {
    // console.log("emiail", auth.currentUser.email);
    getConnections(auth.currentUser.email);
  }, []);

  // ! authors will be a list of authors without the current user
  const handleClick = async () => {
    const list = value.sort();
    // console.log("list", list);
    const obj = { otherAuthors: list, mostRecent: new Date() };
    // console.log("obj", obj);
    const names = await getOtherAuthors(obj);
    // console.log("names", names.names);
    const emails = [auth.currentUser.email, ...value];
    selectConvo(await getConversationId(emails), names.names, 99, emails);
  };
  //TODO make a form that allows the currentuser to select from a list of contacts (should be a multiselect to allow group chats)
  //TODO add the emails from the search bar to authors state
  return (
    <Grid container spacing={1}>
      <Grid xs>
        <Autocomplete
          data-cy="selectConnections"
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
        <IconButton
          data-cy="submitConnections"
          size="small"
          sx={{ p: 0 }}
          onClick={handleClick}
          disabled={value.length < 1}
        >
          <BorderColorRoundedIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

NewConvo.propTypes = {
  selectConvo: PropTypes.func,
  getConversationId: PropTypes.func,
  getOtherAuthors: PropTypes.func,
};

export default NewConvo;
