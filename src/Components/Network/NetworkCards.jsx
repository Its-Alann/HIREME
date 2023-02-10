/* eslint-disable react/function-component-definition */
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[600]),
  backgroundColor: blue[600],
  "&:hover": {
    backgroundColor: blue[700],
  },
}));

const ColorButtonLightBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[800]),
  backgroundColor: blue[800],
  "&:hover": {
    backgroundColor: blue[900],
  },
}));

export default function NetworkCards(props) {
  return (
    <Box sx={{ width: 300, minWidth: 100 }}>
      <Card variant="outlined">
        <>
          <CardHeader
            avatar={
              //source will be the user's image
              <Avatar
                aria-label="user"
                sx={{ width: 56, height: 56 }}
                src="https://plus.unsplash.com/premium_photo-1664303625239-cd96985b1ae4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
              />
            }
            //title will be the user's name and subheader is their bio
            title="Jane Doe"
            subheader="The next Elon Musk"
          />
          {/*moves the buttons to the right*/}
          <Box display="flex" justifyContent="flex-end">
            <CardActions>
              {/*view profile will go to the user's profile and message will be sent to the */}
              <ColorButtonBlue size="medium">View Profile</ColorButtonBlue>
              <ColorButtonLightBlue size="medium">Message</ColorButtonLightBlue>
            </CardActions>
          </Box>
        </>
      </Card>
    </Box>
  );
}
