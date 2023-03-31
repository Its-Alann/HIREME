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
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "@mui/material";
import { db, auth } from "../../Firebase/firebase";

//lists of pages accesible from the navbar
const pageNamesForApplicant = ["Home", "Network", "Jobs", "Messaging"];
const pageNamesForRecruiter = [
  "Home",
  "Network",
  "Jobs",
  "MyJobs",
  "Messaging",
];
const loggedOutPages = ["Jobs", "Sign Up", "Log In"];
const settings = ["Profile", "Account", "Dashboard"];

const Navbar = () => {
  const [pageNames, setPageNames] = React.useState([
    "Home",
    "Network",
    "Jobs",
    "Messaging",
  ]);
  const [userIsConnected, setUserIsConnected] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  //getting user information
  React.useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userProfile = await getDoc(doc(db, "userProfiles", user.email));
          setUserData(userProfile.data());
          setUserIsConnected(true);
          const recruiter = await getDoc(doc(db, "recruiters", user.uid));
          if (recruiter.exists()) {
            setPageNames(pageNamesForRecruiter);
          } else {
            setPageNames(pageNamesForApplicant);
          }
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
  //const [redirectToPage, setRedirectToPage] = React.useState("");
  //const [user, userLoading, userError] = useAuthState(auth);
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

  //navigation to other pages
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
        navigate("/browseJobs");
        break;
      case "myjobs":
        navigate("/myJobs");
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
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
          <Link href="/" sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
            <Box
              component="img"
              sx={{
                width: "13rem",
                height: "2.5rem",
              }}
              src="https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FHIREME_logotext.png?alt=media&token=f650bdf2-1892-4106-86d3-c8934ca7de67"
            />
          </Link>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              alignItems: "center",
            }}
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
                pageNames.map((page) => (
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
            <Link
              href="/"
              sx={{
                display: { xs: "flex", md: "none" },
                ml: "auto",
                mr: "auto",
              }}
            >
              <Box
                component="img"
                sx={{
                  width: "13rem",
                  height: "2.5rem",
                }}
                src="https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FHIREME_logotext.png?alt=media&token=f650bdf2-1892-4106-86d3-c8934ca7de67"
              />
            </Link>
          </Box>

          {userIsConnected && (
            <>
              <Box
                data-cy="connected-box-test"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex", justifyContent: "end" },
                }}
              >
                {pageNames.map((page) => (
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
                    {page === "MyJobs" && <WorkOutlineOutlinedIcon />}
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
                      alt={
                        //making sure info is defined
                        userData !== undefined &&
                        userData.values !== undefined &&
                        userData.values.firstName !== undefined &&
                        userData.values.firstName
                      }
                      src={
                        userData !== undefined &&
                        userData.values !== undefined &&
                        userData.values.image !== undefined &&
                        userData.values.image
                      }
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
