import { CircularProgress, Stack, Typography } from "@mui/material";

export const DataStatus = ({
  isLoading,
  isError,
  data,
  loadingText = "Cargando datos...",
  errorText = "Ocurrió un error al cargar los datos 😢",
  emptyText = "No hay datos para mostrar 😅",
}) => {
  console.log({ isLoading });
  if (isLoading) {
    return (
      <Stack alignItems="center" mt={4}>
        <CircularProgress />
        <Typography>{loadingText}</Typography>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ mt: 3, textAlign: "center" }}
      >
        {errorText}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
        {emptyText}
      </Typography>
    );
  }

  return null;
};
