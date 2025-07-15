import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearErrorMessage } from "../../store/slices/authSlice";
import { CarouselComponent } from "../components/CarouselComponent";

const MotionBox = motion.create(Box);

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoToLogin = () => {
    dispatch(clearErrorMessage());
    navigate("auth");
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      sx={{
        color: "#fff",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        fontWeight="bold"
        sx={{
          fontSize: {
            xs: "1.5rem", // tamaño para celulares
            sm: "2rem", // tablets pequeñas
            md: "2.5rem", // laptops
            lg: "3rem", // pantallas grandes
          },
        }}
      >
        Welcome to ZenLingo!
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 4,
          fontSize: {
            xs: "0.8rem", // tamaño para celulares
            sm: "1rem", // tablets pequeñas
            md: "2rem", // laptops
            lg: "2rem", // pantallas grandes
          },
        }}
      >
        Build your personal English library with verbs, idioms and more.
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        size="large"
        onClick={handleGoToLogin}
        sx={{
          px: 5,
          py: 1.5,
          fontSize: {
            xs: "1.5rem", // tamaño para celulares
            sm: "2rem", // tablets pequeñas
          },
        }}
      >
        Sign in
      </Button>

      <Box mt={6} sx={{ width: "100%" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          How does it work?
        </Typography>
        <CarouselComponent />
      </Box>
    </MotionBox>
  );
};

export default HomePage;
