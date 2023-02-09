import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import SignInGoogleButton from "../../Components/SignInGoogleButton/SignInGoogleButton";
import { auth, provider } from "../../Firebase/firebase";
import Navbar from "../../Components/Navbar/Navbar";

const theme = createTheme();

const SignIn = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!emailError && email && password) {
      console.log({
        email,
        password,
      });
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const { user } = userCredential;
        console.log(user);

        navigate("/");
      } catch (err) {
        console.log("Something went wrong with email/password Sign In");
        console.error(err.code, err.message);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {" "}
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            data-cy="formTest"
          >
            <TextField
              className="TextField"
              type="text"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              data-cy="emailTest"
              inputProps={{
                "aria-label": "email",
              }}
              onBlur={(e) => {
                setEmailError(
                  e.target.value === ""
                    ? false
                    : !EmailValidator.validate(e.target.value)
                );
              }}
              error={emailError}
              helperText={!emailError ? "" : "Please enter valid credentials"}
              variant="standard"
            />
            <TextField
              className="TextField"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              name="signIn"
              inputProps={{ "aria-label": "signIn" }}
            >
              Sign In
            </Button>
            <Stack container justifyContent="center" spacing={2}>
              <Stack item xs align="center">
                <Link href="/" variant="subtitle2">
                  Forgot password?
                </Link>
              </Stack>
              <Stack item>
                <Typography variant="subtitle2" align="center">
                  or you can sign in with
                </Typography>
              </Stack>
              <Stack item margin="auto">
                <SignInGoogleButton data-cy="GoogleTest" />
              </Stack>
            </Stack>
            <Stack container justifyContent="center" alignItems="center">
              <Typography>Don&apos;t have an account?</Typography>
              <Button href="/SignUp" variant="outlined" fullWidth>
                Sign Up
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
