import React from "react";
import { handleSpeak } from "../app/utils/gemini/handleSpeak";
import { IconButton } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { cleanedText } from "../app/utils";

export const SpeakWord = ({ textToSpeak }) => {
  return (
    <IconButton
      size="small"
      color="primary"
      onClick={() => handleSpeak(cleanedText(textToSpeak), {})}
    >
      <VolumeUpIcon fontSize="small" />
    </IconButton>
  );
};
