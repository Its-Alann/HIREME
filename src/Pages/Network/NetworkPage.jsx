import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { Route, Link, Routes } from "react-router-dom";
import { PropTypes } from "prop-types";
import Navbar from "../../Components/Navbar/Navbar";
import { ViewNetwork } from "./MyConnections/ViewNetwork";
import { SentInvitation } from "./Invitation/SentInvitation";
import { ReceivedInvitation } from "./Invitation/ReceivedInvitation";
import { NetworkPossibleConnections } from "./NetworkPossibleConnections";

const theme = createTheme({
  palette: {
    primary: { main: "#2B2F90" },
    background: { main: "#EAEAEA" },
    gray: { main: "#757575" },
  },
  /* typography: {
    fontFamily: ["Proxima Nova"],
  },*/
});

/*const LinkTab = (props) => (
  <Tab
    component={Link}
    to={props.href}
    onClick={(event) => {
      event.preventDefault();
    }}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);*/

const NetworkPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ backgroundColor: "#EAEAEA", height: "100vh" }}>
      <Divider />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth={false}>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="nav tabs example"
            >
              <Tab label="My Network" value={0} data-cy="NetworkTab" />
              <Tab
                label="Received Invitations"
                value={1}
                data-cy="ReceivedInvitationTab"
              />
              <Tab
                label="Sent Invitation"
                value={2}
                data-cy="SentInvitationTab"
              />
              <Tab
                label="Possible Connections"
                value={3}
                data-cy="PossibleConnectionsTab"
              />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 0}>
            <ViewNetwork />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 1}>
            <ReceivedInvitation />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 2}>
            <SentInvitation />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 3}>
            <NetworkPossibleConnections />
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

/*LinkTab.propTypes = {
  href: PropTypes.string.isRequired,
};*/

export default NetworkPage;
