import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IconButton, Stack } from "@mui/material";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebase";

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
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const handleSubmit = async (event) => {
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const success = await sendPasswordResetEmail(email);
    if (success) {
      alert("Sent email");
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
          <Typography component="h1" variant="h4" color="primary">
            Forgot password?
          </Typography>
          <Typography variant="caption">
            You will receive an email to reset your password
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            data-cy="formTest"
            onSubmit={handleSubmit}
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
              variant="standard"
              color="primary"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1 }}
              color="primary"
              name="resetPassword"
            >
              Reset password
            </Button>

            <Stack justifyContent="center" spacing={1}>
              <IconButton aria-label="back" href="/login">
                <ArrowBackRoundedIcon />
              </IconButton>
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
