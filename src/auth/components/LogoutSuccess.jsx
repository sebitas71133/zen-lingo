import { Typography, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useEffect, useState } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { wordApi } from "../../services/wordApi";
import { phrasesApi } from "../../services/phrasesApi";
import { verbsApi } from "../../services/verbsApi";
import { textsApi } from "../../services/textsApi";
import { tagsApi } from "../../services/tagsApi";

export const LogoutSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(2);

  const { logoutTotal } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
      logoutTotal();
      dispatch(wordApi.util.resetApiState());
      dispatch(phrasesApi.util.resetApiState());
      dispatch(verbsApi.util.resetApiState());
      dispatch(textsApi.util.resetApiState());
      dispatch(tagsApi.util.resetApiState());
      //dispatch(apiSlice.util.resetApiState());
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, dispatch]);

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <LogoutIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Sesión cerrada
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Has cerrado sesión exitosamente.
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: 24 }}>
        Redirigiendo en {countdown}...
      </Typography>
    </Container>
  );
};
