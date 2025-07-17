import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearErrorMessage } from "../../store/slices/authSlice";
import { CarouselComponent } from "../components/CarouselComponent";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TranslateIcon from "@mui/icons-material/Translate";
import FlashOnIcon from "@mui/icons-material/FlashOn";

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
        mt: 5,
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
        color="text.primary"
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
        color="text.primary"
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
            sm: "1.7rem", // tablets pequeñas
          },
        }}
      >
        Sign in
      </Button>

      <Box mt={6} sx={{ width: "100%" }}>
        <Typography variant="h6" sx={{ mb: 2 }} color="text.primary">
          How does it work?
        </Typography>
        <CarouselComponent />
      </Box>

      <Box
        mt={15}
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={4}
      >
        {[
          {
            icon: (
              <LibraryBooksIcon
                sx={{ fontSize: 50, color: "secondary.main" }}
              />
            ),
            title: "Custom Library",
            desc: "Create your personal collection of verbs and idioms.",
          },
          {
            icon: (
              <TranslateIcon sx={{ fontSize: 50, color: "secondary.main" }} />
            ),
            title: "Real Translations",
            desc: "Accurate and categorized translations for learners.",
          },
          {
            icon: (
              <FlashOnIcon sx={{ fontSize: 50, color: "secondary.main" }} />
            ),
            title: "Fast & Intuitive",
            desc: "Save and find words instantly with a beautiful UI.",
          },
        ].map((item, i) => (
          <Box key={i} width={250} textAlign="center">
            {item.icon}
            <Typography
              variant="h6"
              fontWeight="bold"
              mt={1}
              color="text.primary"
            >
              {item.title}
            </Typography>
            <Typography variant="body2" mt={1} color="text.secondary">
              {item.desc}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Video */}

      <Box mt={20}>
        <Typography
          variant="h5"
          color="text.primary"
          sx={{ mb: 5 }}
          gutterBottom
          fontWeight="bold"
        >
          Watch ZenLingo in action!
        </Typography>

        <Box
          component="iframe"
          src="https://player.cloudinary.com/embed/?cloud_name=ditbq608f&public_id=VIDEOS%2FHALF-LIFE%2FPROYECTOS%20DEMO%2Fzen-lingo_N04THu00_a6o0oi&profile=cld-default"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
      </Box>
    </MotionBox>
  );
};

export default HomePage;
