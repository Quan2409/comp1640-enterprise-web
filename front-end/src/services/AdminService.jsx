import axios from "../api/axios";

//=============================Account============================================
const AllAccount = () => {
  return axios.get("/api/account");
};

const createAccount = (accounts) => {
  return axios.post("/api/account/create", { ...accounts });
};

const updateAccount = async (accounts, accountId) => {
  const res = await axios.put("/api/account/update?id=" + accountId, {
    ...accounts,
  });

  return res;
};

//=================================Faculty========================================
const AllFaculty = async () => {
  return await axios.get("/api/faculty/getAll");
};

const createFaculty = (faculty) => {
  return axios.post("/api/faculty/create", { ...faculty });
};

const updateFaculty = async (faculty, facultyId) => {
  const res = await axios.put("/api/faculty/update?id=" + facultyId, {
    ...faculty,
  });

  return res;
};

const deleteFaculty = async (facultyId) => {
  const res = await axios.delete("/api/faculty/delete?id=" + facultyId);

  return res;
};

//===============================Student==========================================
const AllStudent = async () => {
  return await axios.get("/api/student");
};

const createStudent = (students, FacultyId, AccountId) => {
  return axios.post(
    "/api/student/create?facultyId=" + FacultyId + "&accountId=" + AccountId,
    {
      ...students,
    }
  );
};

const updateStudent = async (students, studentId) => {
  const res = await axios.put("/api/student/update?id=" + studentId, {
    ...students,
  });

  return res;
};

const deleteStudent = async (studentId) => {
  const res = await axios.delete("/api/student/delete?id=" + studentId);

  return res;
};

//=================================Guest============================================
const AllGuest = async () => {
  return await axios.get("/api/guest");
};

const createGuest = (guest, facultyId, accountId) => {
  return axios.post(
    "/api/guest/create?facultyId=" + facultyId + "&accountId=" + accountId,
    {
      ...guest,
    }
  );
};

const updateGuest = async (guest, guestId) => {
  const res = await axios.put("/api/guest/update?id=" + guestId, {
    ...guest,
  });

  return res;
};

const deleteGuest = async (guestId) => {
  const res = await axios.delete("/api/guest/delete?id=" + guestId);

  return res;
};
//=================================Coordinator========================================

const AllCoordinator = async () => {
  return await axios.get("/api/coordinator");
};

const createCoordinator = (coordinator, facultyId, accountId) => {
  return axios.post(
    "/api/coordinator/create?facultyId=" +
      facultyId +
      "&accountId=" +
      accountId,
    {
      ...coordinator,
    }
  );
};

const updateCoordinator = async (coordinator, coordinatorId) => {
  const res = await axios.put("/api/coordinator/update?id=" + coordinatorId, {
    ...coordinator,
  });

  return res;
};

const deleteCoordinator = async (coordinatorId) => {
  const res = await axios.delete("/api/coordinator/delete?id=" + coordinatorId);

  return res;
};

//=============================Contribution============================================
const AllContribution = async () => {
  return await axios.get("/api/contribution");
};

//====================================Event============================================
const AllEvent = async () => {
  return await axios.get("/api/Event");
};

const createEvent = (events, facultyId) => {
  return axios.post("/api/Event/create?facultyId=" + facultyId, {
    ...events,
  });

  return res;
};

const updateEvent = async (events, eventId) => {
  const res = await axios.put("/api/Event/update?id=" + eventId, {
    ...events,
  });

  return res;
};

const deleteEvent = async (eventId) => {
  const res = await axios.delete("/api/Event/delete?id=" + eventId);

  return res;
};

//=================================Export==============================================
export {
  AllAccount,
  createAccount,
  updateAccount,

  //Faculty
  AllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,

  //Student
  AllStudent,
  createStudent,
  updateStudent,
  deleteStudent,

  //Guest
  AllGuest,
  createGuest,
  updateGuest,
  deleteGuest,

  //Contribution
  AllContribution,

  //Coordinator
  AllCoordinator,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,

  //Event
  AllEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
