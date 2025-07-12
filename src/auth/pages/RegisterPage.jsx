import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Grid2,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useAuthStore } from "../hooks/useAuthStore";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export const RegisterPage = () => {
  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm();

  const { createUserWithEmailPasswordThunk } = useAuthStore();

  const { isLoading, errorMessage } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    await createUserWithEmailPasswordThunk;
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
            variant="h4"
            sx={{
              mb: 4,
              color: "text.primary",
              ml: 3,
              fontWeight: "800",
              letterSpacing: 2,
              opacity: 0.8,
            }}
          >
            {"Sign up for free"}
          </Typography>
          <Grid2 container sx={{ display: "flex" }}>
            <Grid2
              item
              xs={12}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
              width={"100%"}
            >
              <TextField
                label="Nombre completo"
                type="text"
                placeholder="Nombre completo"
                sx={{
                  width: "90%",
                  "& .MuiInputLabel-root": {
                    color: "gray",
                    fontSize: "0.9rem",
                  },
                }}
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid2>

            <Grid2
              item
              xs={12}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
              width={"100%"}
            >
              <TextField
                label="Correo"
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
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
                sx={{
                  width: "90%",
                  "& .MuiInputLabel-root": {
                    color: "gray",
                    fontSize: "0.9rem",
                  },
                }}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "It must contain at least 6 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "It must contain at most 20 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid2>

            <Grid2 container spacing={2} sx={{ mb: 2, mt: 4 }} width={"100%"}>
              <Grid2
                item
                xs={12}
                spacing={2}
                sx={{ mb: 2, mt: 1, display: "flex", justifyContent: "center" }}
                width={"100%"}
              >
                <Button
                  variant="contained"
                  sx={{
                    width: "90%",
                    textTransform: "none",
                  }}
                  type="submit"
                  disabled={isLoading}
                >
                  Sign up
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
              item
              container
              direction="row"
              justifyContent="center"
              width={"100%"}
            >
              <Typography
                variant="body2"
                sx={{ mr: 2, opacity: 0.6, color: "text.primary" }}
              >
                Do you have an account?
              </Typography>
              <Link
                variant="body2"
                component={RouterLink}
                to="/auth/login"
                sx={{ color: "palette.primary" }}
                disabled={isLoading}
              >
                Sign in
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </form>
    </MotionBox>
  );
};
