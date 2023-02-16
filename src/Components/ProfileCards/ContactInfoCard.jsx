import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ContactInfoCard = ({ setProfile, profile, currentUserEmail }) => {
  const [editButton, setEditButton] = useState(false);
  const [bday, setBday] = useState();

  const getBday = async () => {
    if (profile.values.dob)
      setBday(
        await profile.values.dob.toDate().toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })
      );
  };

  useEffect(() => {
    // console.log("profile", profile);
    getBday();
  }, [profile]);

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              {" "}
              <Typography variant="h5"> Contact Information </Typography>{" "}
            </Grid>
            <Grid item>
              <EditIcon
                onClick={() => setEditButton(!editButton)}
                style={{ cursor: "pointer" }}
              />

              {/* <Button
                onClick={() =>
                  setProfile((previousState) => ({
                    values: { ...previousState.values, city: "Los Angeles" },
                  }))
                }
              >
                Change state in child, Change City to LA
              </Button> */}
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {editButton === false ? (
                  `Email: ${currentUserEmail}`
                ) : (
                  <TextField
                    id="standard-basic"
                    variant="standard"
                    size="small"
                    value={currentUserEmail}
                  />
                )}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {" "}
                Phone: {profile.values.phoneNumber}{" "}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {" "}
                Address: {profile.values.address}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {" "}
                City: {profile.values.city}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {" "}
                Country: {profile.values.country}{" "}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {" "}
                Postal Code: {profile.values.postalCode}{" "}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="body2"> Birthday: {bday} </Typography>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

ContactInfoCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  currentUserEmail: PropTypes.string,
};

export default ContactInfoCard;
