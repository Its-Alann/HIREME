import React from "react";
import { Grid, Box, TextField, Avatar } from "@mui/material";

const EditProfile = () => {
  const something = "";

  return (
    <div>
      <Grid container>
        <Grid item md="3">
          <Grid container my={5}>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
        </Grid>
        <Grid item md="9" margin="auto">
          <Grid container direction="column">
            <Grid container>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="First Name"
                    variant="standard"
                  />
                </Grid>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="Last Name"
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="School Name"
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="City"
                    variant="standard"
                  />
                </Grid>
                <Grid item mx={5}>
                  <TextField
                    id="standard-basic"
                    label="Country"
                    variant="standard"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditProfile;
