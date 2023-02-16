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

const ContactInfoCard = ({ setProfile, profile }) => {
  const [editButton, setEditButton] = useState(false);

  useEffect(() => {
    console.log("props received");
    console.log(profile);
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
              <Button
                onClick={() =>
                  setProfile((previousState) => ({
                    values: { ...previousState.values, city: "Los Angeles" },
                  }))
                }
              >
                Change state in child, Change City to LA
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Typography variant="body2">
                {editButton === false ? (
                  "email"
                ) : (
                  <TextField
                    id="standard-basic"
                    variant="standard"
                    size="small"
                    value="something.something@gmail.com"
                  />
                )}
                {/* Email: something.something@gmail.com{" "} */}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2"> Phone: 123-456-7890 </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {" "}
                Address: 123 Rue Somewhere{" "}
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
              <Typography variant="body2"> Country: Canada </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2"> Postal Code: Y1X 2Z3 </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="body2"> Date of Birth: January 1 </Typography>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

ContactInfoCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
};

export default ContactInfoCard;
