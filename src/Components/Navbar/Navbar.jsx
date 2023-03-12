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
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { useNavigate } from "react-router-dom";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../Firebase/firebase";

const pages = ["Home", "Network", "Jobs", "Messaging"];
const loggedOutPages = ["Jobs", "Sign Up", "Log In"];
const settings = ["Profile", "Account", "Dashboard"];

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
          console.log(err);
        }
      } else {
        setUserIsConnected(false);
      }
    });
  }, []);
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [redirectToPage, setRedirectToPage] = React.useState("");
  const [user, userLoading, userError] = useAuthState(auth);
  const [signOut, logoutLoading, logoutError] = useSignOut(auth);

  let redirectToPage2 = "";
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNavMenu = () => {
    console.log(redirectToPage);
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
      /*
      case "profile":
        break;
      case "account":
        break;
      case "dashboard":
        break;*/
      case "logout":
        setUserIsConnected(false);
        signOut(auth);
        navigate("/");
        break;
      case "jobs":
        break;
      case "sign up":
        navigate("/SignUp");
        break;
      case "log in":
        navigate("/login");
        break;
      default:
        break;
    }
    setAnchorElNav(null);
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
            variant="h5"
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

          <Box
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            data-cy="phone-menu-test"
          >
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
              data-cy="phone-appbar-test"
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
              {userIsConnected &&
                pages.map((page) => (
                  <MenuItem
                    key={page}
                    data-cy={`${page}-phone-test`}
                    onClick={() => {
                      redirectToPage2 = page;
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              {!userIsConnected &&
                loggedOutPages.map((page) => (
                  <MenuItem
                    key={page}
                    data-cy={`${page}-logged-out-test`}
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
            href="/"
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

          {userIsConnected && (
            <>
              <Box
                data-cy="connected-box-test"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex", justifyContent: "end" },
                }}
              >
                {pages.map((page) => (
                  <Button
                    key={page}
                    data-cy={`${page}-test`}
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
                    {page === "Jobs" && <WorkOutlineOutlinedIcon />}
                    {page}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0, marginLeft: "1%" }} data-cy="userBox">
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                    data-cy="userMenu"
                  >
                    <Avatar
                      style={{ border: "2px solid #2B2F90" }}
                      alt={userData?.values?.firstName}
                      src={userData?.values?.image}
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
                      data-cy={`${setting}-phone-test`}
                      onClick={() => {}}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={() => {
                      redirectToPage2 = "logout";
                      handleCloseUserMenu();
                      handleCloseNavMenu();
                    }}
                    data-cy="logout-test"
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </>
          )}

          {!userIsConnected && (
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex", justifyContent: "end" },
              }}
            >
              {loggedOutPages.map((page) => (
                <Button
                  key={page}
                  data-cy={`${page}-test`}
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
                  {page === "Jobs" && <WorkOutlineOutlinedIcon />}
                  {page === "Sign Up" && <PersonOutlineOutlinedIcon />}
                  {page === "Log In" && <LoginOutlinedIcon />}
                  {page}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
