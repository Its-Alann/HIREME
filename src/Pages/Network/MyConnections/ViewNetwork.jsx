/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { NetworkCards } from "../../../Components/Network/NetworkCards";
import image2 from "../../../Assets/images/390image2.svg";

const theme = createTheme();

export const ViewNetwork = ({
  allUserProfiles,
  networkConnections,
  currentUserEmail,
}) => {
  const [connectedUsersId, setConnectedUsersId] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [showingConnections, setShowingConnections] = useState([]);
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
    setShowingConnections(paginate(connectedUsersId, pageSize, pageNumber));
    console.log(showingConnections);
  }, [pageNumber, connectedUsersId]);

  useEffect(() => {
    setConnectedUsersId(networkConnections);
    setCurrentUser(currentUserEmail);
  }, [networkConnections]);

  useEffect(() => {
    setAllUsers(allUserProfiles);
  }, [allUserProfiles]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xxl"
        justifyContent="center"
        alignItems="center"
      >
        <CssBaseline />
        <Stack>
          <Box justifyContent="center" alignItems="center" display="flex">
            {showingConnections?.length > 0 && showingConnections != null ? (
              <Stack alignItems="center">
                <Grid
                  container
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {showingConnections.map((connectedUserID) => (
                    <Grid item sx={{ m: 2 }}>
                      <NetworkCards
                        allUserProfiles={allUsers}
                        connectedUserID={connectedUserID}
                        currentUser={currentUser}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
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
                <Typography variant="h5" sx={{ ml: 1 }}>
                  No connections to show
                </Typography>
              </>
            )}
          </Box>
          {connectedUsersId?.length > pageSize ? (
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
                  pageNumber === Math.ceil(connectedUsersId.length / pageSize)
                }
              >
                Next
              </Button>
            </Box>
          ) : null}
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

ViewNetwork.propTypes = {
  allUserProfiles: PropTypes.arrayOf(PropTypes.Object).isRequired,
  networkConnections: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentUserEmail: PropTypes.string.isRequired,
};

export default ViewNetwork;
