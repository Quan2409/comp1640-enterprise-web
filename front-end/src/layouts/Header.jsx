import React, { Fragment, useContext } from "react";
import style from "../styles/homepage/header.module.css";
import logo from "../assets/images/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { MyContext } from "../App";

const Header = () => {
  // navigate
  const navigate = useNavigate();

  // state
  const { isLogin, setIsLogin } = useContext(MyContext);
  const { role } = useContext(MyContext);
  const { email } = useContext(MyContext);

  // handle logout
  const handleLogout = () => {
    const isConfirmed = window.confirm("Do you want to Log Out ?");
    if (isConfirmed) {
      localStorage.removeItem("user");
      setIsLogin(false);
      navigate("/");
    }
  };

  return (
    <Fragment>
      <div className={style["header"]}>
        <div className={style["header-logo"]}>
          <img src={logo} alt="logo" onClick={() => navigate("/")} />
        </div>
        <nav>
          {role === "admin" && (
            <Link to="/admin">
              <p>Admin Dashboard</p>
            </Link>
          )}
          {role === "manager" && (
            <Link to="/manager">
              <p>Manager Report</p>
            </Link>
          )}
        </nav>
        <div className={style["login-btn"]}>
          {isLogin ? (
            <>
              <p>Welcome, {email}</p>
              <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
