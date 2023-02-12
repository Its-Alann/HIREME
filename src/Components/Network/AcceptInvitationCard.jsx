/* eslint-disable react/function-component-definition */
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { PropTypes } from "prop-types";
import { styled } from "@mui/material/styles";
import { blueGrey, blue } from "@mui/material/colors";

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[600]),
  backgroundColor: blue[600],
  "&:hover": {
    backgroundColor: blue[700],
  },
}));

const ColorButtonBlueGray = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blueGrey[400]),
  backgroundColor: blueGrey[400],
  "&:hover": {
    backgroundColor: blueGrey[500],
  },
}));

const AcceptInvitationCard = ({
  userImage,
  userFirstName,
  userLastName,
  userBio,
  userID,
}) => (
  <Box sx={{ width: 300, minWidth: 100 }}>
    <Card variant="outlined">
      <>
        <CardHeader
          avatar={
            //source will be the user's image
            <Avatar
              aria-label="user"
              sx={{ width: 56, height: 56 }}
              src={userImage}
            />
          }
          //title will be the user's name and subheader is their bio
          title={
            userFirstName !== "" && userLastName !== ""
              ? `${userFirstName} ${userLastName}`
              : "No name"
          }
          subheader={
            //remove != null when incomplete users are removed
            userBio !== "" && userBio != null ? `${userBio}` : "No bio"
          }
        />
        {/*moves the buttons to the right*/}
        <Box display="flex" justifyContent="flex-end">
          <CardActions>
            {/*view profile will go to the user's profile and message will be sent to the */}
            <ColorButtonBlueGray size="medium">Ignore</ColorButtonBlueGray>
            <ColorButtonBlue size="medium">Accept</ColorButtonBlue>
          </CardActions>
        </Box>
      </>
    </Card>
  </Box>
);

AcceptInvitationCard.propTypes = {
  userImage: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
  userLastName: PropTypes.string.isRequired,
  userBio: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
};

export default AcceptInvitationCard;
