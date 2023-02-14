import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route, Link, Routes } from "react-router-dom";
import { PropTypes } from "prop-types";
import Navbar from "../../Components/Navbar/Navbar";
import { ViewNetwork } from "./MyConnections/ViewNetwork";
import { AcceptInvitation } from "./Invitation/AcceptInvitation";
import { SentInvitation } from "./Invitation/SentInvitation";

const theme = createTheme();

const LinkTab = (props) => (
  <Tab
    component={Link}
    to={props.href}
    onClick={(event) => {
      event.preventDefault();
    }}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export const Network = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Container component="main" maxWidth="xl" sx={{ m: 2 }}>
          <CssBaseline />
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="nav tabs example"
            >
              <LinkTab
                label="My Network"
                value={0}
                href="/myNetwork"
                component={Link}
              />
              <Tab label="Invitations" value={1} />
              <Tab label="Sent Requests" value={2} />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 0}>
            <ViewNetwork />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 1}>
            <AcceptInvitation />
          </Box>

          <Box sx={{ p: 3 }} hidden={value !== 2}>
            <SentInvitation />
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

LinkTab.propTypes = {
  href: PropTypes.string.isRequired,
};

export default Network;
