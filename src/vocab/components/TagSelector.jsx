// components/TagSelector.js

import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAddTagMutation, useGetTagsQuery } from "../../services/tagsApi";

export const TagSelector = ({ value = [], onChange }) => {
  const { data: allTags = [], isLoading } = useGetTagsQuery();
  const [addTag] = useAddTagMutation();

  const [inputValue, setInputValue] = useState("");

  const handleChange = async (_, newValue) => {
    const addedTags = [];
    console.log({ newValue });
    for (const tag of newValue) {
      if (typeof tag === "string") {
        // Si es un nuevo tag, intenta agregarlo
        console.log(tag);
        const result = await addTag(tag);
        addedTags.push({ name: tag }); // Guardamos igual, aunque ya exista
      } else if (tag?.name) {
        addedTags.push(tag);
      }
    }

    // Eliminamos duplicados por nombre
    const uniqueTags = Array.from(
      new Map(addedTags.map((t) => [t.name.toLowerCase(), t])).values()
    );

    onChange(uniqueTags);
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      disableCloseOnSelect
      options={allTags}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Etiquetas"
          placeholder="Escribe y presiona Enter"
          margin="normal"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            variant="outlined"
            label={typeof option === "string" ? option : option.name}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};
