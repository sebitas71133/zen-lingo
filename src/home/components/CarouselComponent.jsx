import Slider from "react-slick";
import { Box, Typography } from "@mui/material";

const slides = [
  {
    image: "/carousel/1.jpg",
    title: "Organize and Filter Your Words",
    description:
      "Easily organize and find your words using filters by category, favorites, or tags.",
  },
  {
    image: "/carousel/2.jpg",
    title: "Detailed View with Audio",
    description:
      "See all the details of a word, including examples and notes — and listen to the pronunciation.",
  },
  {
    image: "/carousel/3.jpg",
    title: "Smart Auto-Completion",
    description:
      "Use AI to help you complete fields like definitions, examples, or translations.",
  },
  {
    image: "/carousel/4.jpg",
    title: "Custom Tags",
    description:
      "Create your own tags and assign them to words to stay organized your way.",
  },
  {
    image: "/carousel/5.jpg",
    title: "Your Personal Dashboard",
    description:
      "Track your learning progress and quickly access your favorite content in one place.",
  },
];

export const CarouselComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 3000,
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        width: {
          xs: "70%",
          sm: "100%",
        },
        px: { xs: 2, sm: 0 },
        boxSizing: "border-box",
      }}
    >
      <Slider {...settings} style={{ width: "100%" }}>
        {slides.map((slide, index) => (
          <Box
            key={index}
            sx={{
              px: 2,
              py: 3,
              textAlign: "center",
              color: "palette.text.primary",
            }}
          >
            <Box
              component="img"
              src={slide.image}
              alt={slide.title}
              sx={{
                width: "100%",
                borderRadius: 4,
                boxShadow: 3,
                height: "auto",
                mb: 2,
                objectFit: "cover",
              }}
            />
            <Typography variant="h6" fontWeight="bold">
              {slide.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
              {slide.description}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
