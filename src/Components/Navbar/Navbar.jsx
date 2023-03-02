import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase";

const pages = ["Home", "Network", "Possible Connections", "Messaging"];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Navbar = () => {
  const [userIsConnected, setUserIsConnected] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  React.useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserIsConnected(true);
        try {
          const dbInfo = await getDoc(doc(db, "userProfiles", user.email));
          const userInfo = dbInfo.data();
          setUserData(userInfo);
        } catch (err) {
          console.error(err);
        }
      }
    });
  }, []);
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  let redirectToPage2 = "";
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    console.log("redirectToPage2", redirectToPage2);
    switch (redirectToPage2.toLowerCase()) {
      case "messaging":
        navigate("/messaging");
        break;
      case "home":
        navigate("/");
        break;
      case "network":
        navigate("/network");
        break;
      case "possible connections":
        navigate("/possibleconnections");
        break;
      case "profile":
        //to implement when page is created
        break;
      case "account":
        //to implement when page is created
        break;
      case "dashboard":
        //to implement when page is created
        break;
      case "logout":
        setUserIsConnected(false);
        signOut(auth);
        navigate("/");
        break;
      default:
        break;
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="background">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            color="primary"
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "primary",
              textDecoration: "none",
            }}
          >
            HIRE<i>ME</i>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    redirectToPage2 = page;
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            color="primary"
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "primary",
              textDecoration: "none",
            }}
          >
            HIRE<i>ME</i>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex", justifyContent: "end" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  redirectToPage2 = page;
                  handleCloseNavMenu();
                }}
                sx={{
                  my: 2,
                  color: "main",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {page === "Home" && <HomeOutlined />}
                {page === "Messaging" && <MessageOutlinedIcon />}
                {page === "Network" && <GroupsOutlinedIcon />}
                {page === "Possible Connections" && <WorkOutlineOutlinedIcon />}
                {page}
              </Button>
            ))}
          </Box>

          {userIsConnected && (
            <Box sx={{ flexGrow: 0, marginLeft: "1%" }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    style={{ border: "2px solid #2B2F90" }}
                    alt={userData.values.firstName}
                    src={userData.values.image}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      redirectToPage2 = setting;
                      handleCloseUserMenu();
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
