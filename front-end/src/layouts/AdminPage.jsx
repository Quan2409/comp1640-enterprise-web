import React, { Fragment } from "react";
import { Box, Stack } from "@mui/material";
import { Sidebar } from "../components/Admin/Sidebar";
import { Content } from "../components/Admin/Content";

export default function AdminPage() {
  return (
    <Fragment>
      <Box height="660px">
        <Stack direction="row" spacing={2} m="0" p="0">
          <Sidebar />
          <Content />
        </Stack>
      </Box>
    </Fragment>
  );
}
