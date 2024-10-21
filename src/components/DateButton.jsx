import { Box, useTheme } from "@mui/material";
import React from "react";

const DateButton = ({ currentDate, previousDate }) => {
  const theme = useTheme();
  const lightColor = theme.palette.background.alt;
  const currentD = new Date(currentDate).toLocaleDateString();
  const previousD = new Date(previousDate).toLocaleDateString();
  const todayD = new Date().toLocaleDateString();
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = yesterday.toLocaleDateString();
  let text;
  if (currentD === todayD && previousD !== todayD) {
    text = "Today";
  } else if (currentD === yesterday && previousD !== yesterday) {
    text = "Yesterday";
  } else if (currentD !== previousD) {
    text = currentD;
  }
  return (
    <>
      {text && (
        <Box
          component={"p"}
          className="date-txt-btn"
          sx={{
            width: "100px",
            textAlign: "center",
            margin: "auto",
            backgroundColor: lightColor,
            padding: "5px 0px",
            borderRadius: "5px",
          }}
        >
          {text}
        </Box>
      )}
    </>
  );
};

export default DateButton;
