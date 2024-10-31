import { Box, InputBase } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export const Content = () => {
  return (
    <Box flex={8} p={2}>
      <Box textAlign="center">
        <InputBase
          type="text"
          placeholder="Search"
          sx={{
            backgroundColor: "#E4E4E4",
            padding: "0 15px",
            width: "90%",
            borderRadius: "5px",
          }}
        />
      </Box>
      <Box m="30px">
        <Outlet />
      </Box>
    </Box>
  );
};
