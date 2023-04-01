import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { SentInvitationCard } from "../../../Components/Network/SentInvitationCard";
import image2 from "../../../Assets/images/390image2.svg";

const theme = createTheme();

export const SentInvitation = ({
  allUserProfiles,
  sentInvitationsID,
  currentUserEmail,
}) => {
  const [sentRequestsUserID, setSentRequestsUserID] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [showingSentInvites, setShowingSentInvites] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 15;

  function paginate(arr, pageSizeSelected, pageNum) {
    return arr.slice(
      (pageNum - 1) * pageSizeSelected,
      pageNum * pageSizeSelected
    );
  }

  const nextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    setPageNumber(pageNumber - 1);
  };

  useEffect(() => {
    setShowingSentInvites(paginate(sentRequestsUserID, pageSize, pageNumber));
    console.log(showingSentInvites);
  }, [pageNumber, sentRequestsUserID]);

  useEffect(() => {
    setSentRequestsUserID(sentInvitationsID);
    setCurrentUser(currentUserEmail);
    //console.log(currentUserEmail);
  }, [sentInvitationsID, currentUserEmail]);

  useEffect(() => {
    setAllUsers(allUserProfiles);
  }, [allUserProfiles]);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xxl" sx={{ m: 2 }}>
          <CssBaseline />
          <Stack>
            <Box justifyContent="center" alignItems="center" display="flex">
              {showingSentInvites?.length > 0 && showingSentInvites != null ? (
                <Grid
                  container
                  spacing={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {showingSentInvites.map((userID) => (
                    <Grid item data-cy="invitationsGrid">
                      <SentInvitationCard
                        allUserProfiles={allUsers}
                        userID={userID}
                        currentUser={currentUser}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <>
                  <Box
                    component="img"
                    justifyContent="center"
                    sx={{
                      width: 0.3,
                      height: 0.3,
                    }}
                    src={image2}
                    // alt="Trees"
                  />
                  <Stack alignItems="center" sx={{ ml: 1 }}>
                    <Typography variant="h5">You have not sent</Typography>
                    <Typography variant="h5">any invitations</Typography>
                  </Stack>
                </>
              )}
              {/*The array will contain all the connected users*/}
            </Box>
            {sentRequestsUserID?.length > pageSize ? (
              <Box sx={{ mt: 2 }}>
                <Button
                  id="Button-Previous"
                  onClick={prevPage}
                  disabled={pageNumber === 1}
                >
                  Prev
                </Button>
                <Button
                  id="Button-Next"
                  onClick={nextPage}
                  disabled={
                    pageNumber ===
                    Math.ceil(sentRequestsUserID.length / pageSize)
                  }
                >
                  Next
                </Button>
              </Box>
            ) : null}
          </Stack>
        </Container>
      </ThemeProvider>
    </div>
  );
};

SentInvitation.propTypes = {
  allUserProfiles: PropTypes.arrayOf(PropTypes.Object).isRequired,
  sentInvitationsID: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentUserEmail: PropTypes.string.isRequired,
};

export default SentInvitation;
