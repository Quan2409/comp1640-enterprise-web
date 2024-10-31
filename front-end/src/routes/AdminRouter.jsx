import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminPage from "../layouts/AdminPage";
import Student from "../pages/Admin/student/Student";
import Coordinator from "../pages/Admin/coordinator/Coordinator";
import Guest from "../pages/Admin/guest/Guest";
import Faculty from "../pages/Admin/faculty/Faculty";
import Contribution from "../pages/Admin/contribution/Contribution";
import Account from "../pages/Admin/account/Account";
import Event from "../pages/Admin/annualEvent/Event";

export default function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminPage />}>
        <Route path="student" element={<Student />} />
        <Route path="coordinator" element={<Coordinator />} />
        <Route path="guest" element={<Guest />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="contribution" element={<Contribution />} />
        <Route path="event" element={<Event />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  );
};
