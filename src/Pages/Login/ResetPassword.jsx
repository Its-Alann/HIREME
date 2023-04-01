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

const ResetPassword = (props) => {
  const antinos = "🖖";
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
          <Box component="form" noValidate sx={{ mt: 1 }} data-cy="formTest">
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

            <Stack justifyContent="center" spacing={1}>
              <Link align="center" href="/" variant="subtitle2">
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

ResetPassword.propTypes = {};

export default ResetPassword;
