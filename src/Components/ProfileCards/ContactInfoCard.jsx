import { React, useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ContactInfoCard = () => {
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
                {editButton === true ? (
                  "something.something@gmail.com"
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
