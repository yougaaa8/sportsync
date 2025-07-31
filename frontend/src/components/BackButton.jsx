"use client"

import { Button } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => window.history.back()}
      sx={{
        minWidth: 48,
        width: 48,
        height: 48,
        borderRadius: "50%", // Makes it circular
        padding: 0,
        margin: "24px 0 0 24px", // Top and left margins for proper spacing
        border: "2px solid",
        borderColor: "primary.main",
        backgroundColor: "background.paper",
        color: "primary.main",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "all 0.2s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          backgroundColor: "rgba(255, 107, 53, 0.04)",
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.15)",
        },
        "&:active": {
          transform: "translateY(0px)",
          boxShadow: "0 2px 6px rgba(255, 107, 53, 0.08)",
        },
      }}
    >
      <ArrowBackIosNewRoundedIcon
        sx={{
          fontSize: 20,
          color: "primary.main",
          ml: "2px", // Slight adjustment to center the arrow visually
        }}
      />
    </Button>
  );
}