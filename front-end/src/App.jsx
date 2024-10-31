import React, { Fragment, useState, useEffect } from "react";
import { AppRouter } from "./routes/AppRouter";
import { ToastContainer, Slide } from "react-toastify";

// create context
export const MyContext = React.createContext();

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvent] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLogin(true);
      setRole(userData.role);
      setEmail(userData.email);
    }
  }, []);

  return (
    <MyContext.Provider
      value={{
        isLogin,
        role,
        events,
        email,
        setIsLogin,
        setRole,
        setEvent,
        setEmail,
      }}
    >
      <Fragment>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </Fragment>
    </MyContext.Provider>
  );
};

export default App;
