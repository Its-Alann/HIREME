import { React, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Grid, IconButton } from "@mui/material";
import { getAuth } from "firebase/auth";
import PropTypes from "prop-types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/firebase";

const ProfilePicture = ({ urlProfilePicture, visitingProfile }) => {
  // const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [hidden, setHidden] = useState(true);
  const [newPicture, setNewPicture] = useState(false);

  const handleSubmit = (image) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const profilePictureLink = `${user.email}-profilePicture`;
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
          setNewPicture(true);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setHidden(false);
      handleSubmit(e.target.files[0]);
    }
  };

  return (
    <Grid alignItems="center" justifyContent="center" display="flex">
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
          src={
            urlProfilePicture !== undefined && newPicture === false
              ? urlProfilePicture
              : url
          }
          sx={{
            width: 200,
            height: 200,
            cursor: "pointer",
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
          {!visitingProfile ? "Upload Picture" : null}
        </Avatar>
        {/* <button
          onClick={handleSubmit}
          justifyContent="center"
          textAlign="center"
          type="submit"
          hidden={hidden}
        >
          Submit
        </button> */}
      </label>
    </Grid>
  );
};

ProfilePicture.propTypes = {
  urlProfilePicture: PropTypes.string,
  visitingProfile: PropTypes.bool,
};

export default ProfilePicture;
