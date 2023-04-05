import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { ReceivedInvitationCard } from "../../../Components/Network/ReceivedInvitationCard";
import image2 from "../../../Assets/images/390image2.svg";

const theme = createTheme();

export const ReceivedInvitation = ({
  receivedInvitationIDs,
  currentUserEmail,
}) => {
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [showingReceivedInvites, setShowingReceivedInvites] = useState([]);
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
    setShowingReceivedInvites(
      paginate(receivedInvitations, pageSize, pageNumber)
    );
    //console.log(showingReceivedInvites);
  }, [pageNumber, receivedInvitations]);

  useEffect(() => {
    setReceivedInvitations(receivedInvitationIDs);
    setCurrentUser(currentUserEmail);
  }, [receivedInvitationIDs]);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xxl">
          <CssBaseline />
          <Stack>
            <Box justifyContent="center" alignItems="center" display="flex">
              {/*The array will contain all the connected users*/}
              {showingReceivedInvites?.length > 0 &&
              showingReceivedInvites != null ? (
                <Grid
                  container
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {showingReceivedInvites.map((requestedUserID) => (
                    <Grid item sx={{ m: 2 }}>
                      <ReceivedInvitationCard
                        receivedInvitationUserID={requestedUserID}
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
                    <Typography variant="h5">You have not received</Typography>
                    <Typography variant="h5">any invitations</Typography>
                  </Stack>
                </>
              )}
            </Box>
            {receivedInvitationIDs?.length > pageSize ? (
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
                    Math.ceil(receivedInvitationIDs.length / pageSize)
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

ReceivedInvitation.propTypes = {
  receivedInvitationIDs: PropTypes.arrayOf(PropTypes.Object).isRequired,
  currentUserEmail: PropTypes.string.isRequired,
};

export default ReceivedInvitation;
