import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Chart from "../pages/Manager/Chart";
import { Stack } from "@mui/material";

export default function ManagerPage() {
  return (
    <>
      <Stack spacing={2} max-width="100%">
        <Header />
        <Chart />
        <Footer />
      </Stack>
    </>
  );
}
