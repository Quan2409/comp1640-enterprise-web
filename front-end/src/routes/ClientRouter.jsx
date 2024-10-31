import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/Homepage";
import SignIn from "../pages/Auth/SignIn";
import SubmitForm from "../pages/Student/SubmitForm";
import ViewSubmission from "../pages/Coordinator/ViewSubmission";
import ManagerPage from "../layouts/ManagerPage";

export default function ClientRouter() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/view-submit/" element={<ViewSubmission />} />
      <Route path="/submit" element={<SubmitForm />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/manager" element={<ManagerPage />} />
    </Routes>
  );
}
