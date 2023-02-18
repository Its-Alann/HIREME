import { React, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Grid, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, app } from "../../Firebase/firebase";

const db = getFirestore(app);

const ProfilePicture = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [hidden, setHidden] = useState(true);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setHidden(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const profilePictureLink = `${user.email}-profilePicture`;

      await setDoc(doc(db, "userProfiles", user.email), {
        profilePictureLink,
      });
      const imageRef = ref(storage, `profile-pictures/${profilePictureLink}`);
      uploadBytes(imageRef, image)
        .then(() => {
          getDownloadURL(imageRef)
            // eslint-disable-next-line no-shadow
            .then((url) => {
              setUrl(url);
            })
            .catch((error) => {
              console.log(error.message, "error getting the image url");
            });
          setImage(null);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid container alignItems="center" justifyContent="center">
      <label htmlFor="contained-button-file">
        <IconButton>
          <input
            accept="image/*"
            id="contained-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </IconButton>
        <Avatar
          alt="Upload Image"
          src={url}
          sx={{
            width: 200,
            height: 200,
          }}
          textAlign="center"
          alignItems="center"
          justifyContent="center"
          style={{
            backgroundColor: "white",
            border: "solid",
            borderColor: "#263aaf",
            color: "#263aaf",
          }}
        >
          Upload Picture
        </Avatar>
        <button onClick={handleSubmit} type="submit" hidden={hidden}>
          Submit
        </button>
      </label>
    </Grid>
  );
};

export default ProfilePicture;
