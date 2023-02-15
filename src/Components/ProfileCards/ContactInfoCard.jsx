import { React, useEffect, useState } from "react";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Grid,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { app } from "../../Firebase/firebase";

const ContactInfoCard = () => {
  const [userData, setUserData] = useState();
  const getCurrentUser = async () => {
    const db = getFirestore(app);
    const auth = getAuth();
    const docRef = doc(db, "userProfiles", auth.currentUser.email);
    const unsub = onSnapshot(docRef, (docu) => {
      if (docu.exists()) {
        setUserData(docu.data().values);
      }
    });
    return unsub;
  };

  useEffect(() => {
    getCurrentUser();
    console.log("Here");
  }, []);

  const [editButton, setEditButton] = useState(false);
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
              <Typography variant="body2"> City: Some City </Typography>
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

export default ContactInfoCard;
