import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid2,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";

import { useSelector } from "react-redux";
import { useAuthStore } from "../hooks/useAuthStore";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export const LoginPage = () => {
  const { isLoading, errorMessage } = useSelector((state) => state.auth);

  const { checkingAuthenticaction, signInWithEmailPassowrdThunk } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const onGoogleSignIn = async () => {
    await checkingAuthenticaction();
  };

  const onEmailPasswordSignIn = async () => {
    const email = watch("email");
    const password = watch("password");
    await signInWithEmailPassowrdThunk({ email, password });
  };

  return (
    <MotionBox
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ minHeight: "450px" }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, color: "text.primary", ml: 2, opacity: 0.6 }}
          >
            {"Please enter your details"}
          </Typography>
          <Typography
            variant="body"
            sx={{ mb: 1, color: "text.primary", ml: 2, opacity: 0.6 }}
          >
            {"user : zen@demo.com | pass : 123456"}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mb: 4,
              color: "text.primary",
              ml: 2,
              fontWeight: "800",
              letterSpacing: 2,
              opacity: 0.8,
            }}
          >
            {"Welcome back"}
          </Typography>
          <Grid2 container>
            <Grid2
              item
              xs={12}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
              width={"100%"}
            >
              <TextField
                label="Email address"
                type="email"
                placeholder="correo@google.com"
                sx={{
                  width: "90%",
                  "& .MuiInputLabel-root": {
                    color: "gray",
                    fontSize: "0.9rem",
                  },
                }}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid2>

            <Grid2
              item
              xs={12}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
              width={"100%"}
            >
              <TextField
                label="Password"
                type="password"
                placeholder="........"
                sx={{
                  width: "90%",
                  "& .MuiInputLabel-root": {
                    color: "gray",
                    fontSize: "0.9rem",
                  },
                }}
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid2>

            <Grid2 container spacing={2} sx={{ mb: 2, mt: 4 }} width={"100%"}>
              <Grid2
                item
                xs={12}
                // md={6}
                sx={{ display: "flex", justifyContent: "center" }}
                mb={1}
                width={"100%"}
              >
                <Button
                  variant="contained"
                  sx={{ width: "90%", textTransform: "none" }}
                  type="submit"
                  disabled={isLoading}
                  onClick={onEmailPasswordSignIn}
                >
                  Sign in
                </Button>
              </Grid2>
              <Grid2
                xs={12}
                // md={6}
                sx={{ display: "flex", justifyContent: "center" }}
                width={"100%"}
              >
                <Button
                  variant="outlined"
                  sx={{ width: "90%", textTransform: "none" }}
                  disabled={isLoading}
                  type="submit"
                  onClick={onGoogleSignIn}
                >
                  <Avatar
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    alt="Google Icon"
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography
                    variant="h7"
                    sx={{ ml: 1, color: "text.primary", opacity: 0.8 }}
                  >
                    Sign in with Google
                  </Typography>
                </Button>
              </Grid2>
            </Grid2>
            <Grid2
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
              width={"100%"}
            >
              {errorMessage && (
                <Alert sx={{ width: "90%" }} severity="error">
                  {errorMessage}
                </Alert>
              )}
            </Grid2>

            <Grid2
              container
              direction="row"
              justifyContent="center"
              width={"100%"}
            >
              <Typography
                variant="body2"
                sx={{ mr: 2, opacity: 0.6, color: "text.primary" }}
              >
                Don't have an account?{" "}
              </Typography>
              <Link
                variant="body2"
                component={RouterLink}
                to="/auth/register"
                sx={{ color: "primary.main" }}
                disabled={isLoading}
              >
                Sign up
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </form>
    </MotionBox>
  );
};
