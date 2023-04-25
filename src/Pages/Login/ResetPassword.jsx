import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IconButton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import * as EmailValidator from "email-validator";
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
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const [emailError, setEmailError] = useState(false);

  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const success = await sendPasswordResetEmail(email);
    if (success) {
      alert("Sent email");
    }
    if (error) console.log(error.message);
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
            {t("Forgotpassword?")}
          </Typography>
          <Typography variant="caption">
            {t("Youwillreceiveanemailtoresetyourpassword")}
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1, minWidth: "300px" }}
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
              onBlur={(e) => {
                setEmailError(
                  e.target.value === ""
                    ? false
                    : !EmailValidator.validate(e.target.value)
                );
              }}
              error={emailError}
              helperText={!emailError ? "" : t("Pleaseentervalidcredentials")}
              variant="standard"
              color="primary"
            />
            {error && (
              <Typography color="error">{t("Usernotfound")}</Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1 }}
              color="primary"
              name="resetPassword"
              disableTouchRipple
              disabled={emailError}
              data-cy="resetSubmit"
            >
              {t("Resetpassword")}
            </Button>

            <Stack justifyContent="center" spacing={1}>
              <IconButton aria-label="back" href="/login" sx={{ m: "auto" }}>
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
                {t("Don&apos;thaveanaccount?")}
              </Typography>
              <Button
                href="/SignUp"
                variant="outlined"
                fullWidth
                color="primary"
                sx={{ mt: 3, mb: 2, py: 1 }}
              >
                {t("Sign Up")}
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
