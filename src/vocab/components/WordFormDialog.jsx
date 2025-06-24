import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Chip,
  Box,
  Autocomplete,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useWordStore } from "../hooks/useWordStore";
import { useTagStore } from "../hooks/useTagStore";
import { useSelector } from "react-redux";
import { useLoadTagsOnMount } from "../hooks/useLoadTagsOnMount";

const types = ["sustantivo", "verbo", "adjetivo", "adverbio", "expresión"];

export const WordFormDialog = ({ open, onClose, initialData }) => {
  const { createWord, updateWordById } = useWordStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { loadTags, addTagIfNotExists } = useTagStore();

  const allTags = useSelector((state) => state.tags.list);

  const [tags, setTags] = useState([]);

  const [examples, setExamples] = useState([]);
  const [exampleInput, setExampleInput] = useState("");

  //   useEffect(() => {
  //     loadTags(); // Cargar tags al abrir
  //   }, []);

  useLoadTagsOnMount();

  console.log({ allTags });

  const onSubmit = async (data) => {
    const wordData = {
      ...data,
      tags,
      examples,
      updatedAt: new Date().toISOString(),
    };

    for (const tag of tags) {
      await addTagIfNotExists(tag);
    }

    await loadTags();

    if (initialData?.id) {
      await updateWordById(initialData.id, wordData);
    } else {
      await createWord({
        ...wordData,
        createdAt: new Date().toISOString(),
        isLearned: false,
      });
    }

    reset();
    setTags([]);
    setExamples([]);
    onClose();
  };

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key, value);
      });

      setTags(initialData.tags || []);
      setExamples(initialData.examples || []);
    }
  }, [initialData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {initialData?.id ? "Editar palabra" : "Agregar palabra"}
      </DialogTitle>
      <DialogContent>
        <form>
          <Controller
            name="word"
            control={control}
            rules={{ required: "Palabra requerida" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Palabra"
                fullWidth
                margin="normal"
                error={!!errors.word}
                helperText={errors.word?.message}
              />
            )}
          />

          <Controller
            name="translation"
            control={control}
            rules={{ required: "Traducción requerida" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Traducción"
                fullWidth
                margin="normal"
                error={!!errors.translation}
                helperText={errors.translation?.message}
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            rules={{ required: "Tipo requerido" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Tipo"
                fullWidth
                margin="normal"
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="definition"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Definición"
                fullWidth
                margin="normal"
              />
            )}
          />

          {/* 🌟 Añadir Ejemplos */}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <TextField
              label="Añadir ejemplo"
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => {
                const trimmed = exampleInput.trim();
                if (trimmed && !examples.includes(trimmed)) {
                  setExamples([...examples, trimmed]);
                  setExampleInput("");
                }
              }}
            >
              Agregar
            </Button>
          </Box>

          {/* Mostrar ejemplos */}
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
            {examples.map((ex, i) => (
              <Chip
                key={i}
                label={ex}
                onDelete={() =>
                  setExamples(examples.filter((_, index) => index !== i))
                }
              />
            ))}
          </Stack>

          {/* 🌈 Tags */}
          <Autocomplete
            multiple
            freeSolo
            options={allTags}
            value={tags}
            onChange={(event, newValue) => {
              setTags(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Etiquetas (tags)"
                margin="normal"
                placeholder="Agrega presionando enter o selecciona tags"
              />
            )}
            sx={{ mt: 2 }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
