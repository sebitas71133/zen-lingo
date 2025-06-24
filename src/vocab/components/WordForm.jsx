// src/vocab/components/WordForm.jsx

import {
  Box,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Chip,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

const partOfSpeechOptions = [
  "sustantivo",
  "verbo",
  "adjetivo",
  "adverbio",
  "frase",
  "expresión",
];

export const WordForm = ({ onSave, defaultValues = {}, onCancel }) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      word: "",
      translation: "",
      type: "",
      definition: "",
      examples: "",
      synonyms: "",
      antonyms: "",
      tags: [],
      isLearned: false,
      ...defaultValues,
    },
  });

  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !getValues("tags").includes(tag)) {
      setValue("tags", [...getValues("tags"), tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = getValues("tags").filter((t) => t !== tagToRemove);
    setValue("tags", updatedTags);
  };

  const onSubmit = (data) => {
    onSave(data);
    reset(); // limpiar el formulario si es necesario
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h6">Agregar Palabra</Typography>

      <TextField
        label="Palabra"
        {...register("word", { required: "Este campo es obligatorio" })}
        error={!!errors.word}
        helperText={errors.word?.message}
      />

      <TextField
        label="Traducción"
        {...register("translation", {
          required: "Este campo es obligatorio",
        })}
        error={!!errors.translation}
        helperText={errors.translation?.message}
      />

      <Controller
        name="type"
        control={control}
        rules={{ required: "Seleccione el tipo de palabra" }}
        render={({ field }) => (
          <TextField
            select
            label="Tipo"
            {...field}
            error={!!errors.type}
            helperText={errors.type?.message}
          >
            {partOfSpeechOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <TextField
        label="Definición"
        multiline
        minRows={2}
        {...register("definition")}
      />

      <TextField
        label="Ejemplos (separar por punto y coma)"
        multiline
        minRows={2}
        {...register("examples")}
      />

      <TextField
        label="Sinónimos (separar por comas)"
        {...register("synonyms")}
      />

      <TextField
        label="Antónimos (separar por comas)"
        {...register("antonyms")}
      />

      {/* Tags dinámicos */}
      <Box>
        <TextField
          label="Agregar etiqueta"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <Box mt={1} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {getValues("tags").map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              color="primary"
            />
          ))}
        </Box>
      </Box>

      <Controller
        name="isLearned"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="Marcar como aprendido"
          />
        )}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Guardar
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </Box>
    </Box>
  );
};
