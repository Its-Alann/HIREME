import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import SignInGoogleButton from "../../Components/SignInGoogleButton/SignInGoogleButton";
import { auth, provider } from "../../Firebase/firebase";

const theme = createTheme({
  palette: {
    primary: { main: "#2B2F90" },
    background: { main: "#EAEAEA" },
    gray: { main: "#757575" },
  },
  typography: {
    fontFamily: ["Proxima Nova"],
  },
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

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

      signInWithEmailAndPassword(email, password);

      navigate("/");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 2,
          }}
        >
          <Typography component="h1" variant="h5" color="primary">
            HIRE<em>ME</em> account Sign In
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
              color="primary"
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
              color="primary"
            />

            {error && <Typography color="error">{error.message}</Typography>}

            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1 }}
                color="primary"
                name="signIn"
              >
                Sign In
              </Button>
            )}

            <Stack justifyContent="center" spacing={1}>
              <Link
                align="center"
                href="/resetPassword"
                variant="subtitle2"
                data-testid="forgotPassword"
              >
                Forgot password?
              </Link>
            </Stack>
            <Stack justifyContent="center" spacing={0} sx={{ mt: 3 }}>
              <Typography
                variant="subtitle1"
                align="center"
                color="gray"
                sx={{ fontSize: ".9rem" }}
              >
                or you can sign in with
              </Typography>
              {/* eslint-disable-next-line*/}
              <div align="center">
                <SignInGoogleButton sx={{ m: "auto" }} data-cy="GoogleTest" />
              </div>
            </Stack>
            <Stack
              sx={{ pt: 4 }}
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Typography color="primary">
                Don&apos;t have an account?
              </Typography>
              <Button
                href="/SignUp"
                variant="outlined"
                fullWidth
                color="primary"
                sx={{ mt: 3, mb: 2, py: 1 }}
              >
                Sign Up
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
