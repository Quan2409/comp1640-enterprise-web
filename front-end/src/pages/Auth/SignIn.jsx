import React, { Fragment, useContext, useEffect, useState } from "react";
import style from "../../styles/auth/Signin.module.css";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import logo from "../../assets/images/logo.png";
import axios from "axios";
import * as Yup from "yup";
import { AllAccount } from "../../services/AdminService";
import { HmacSHA256, enc } from "crypto-js";

const SignIn = () => {
  const navigate = useNavigate();

  // state
  const [account, setAccount] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setIsLogin, setRole, setEmail } = useContext(MyContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // validation
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is Required")
      .email("Invalid email format")
      .matches(/@fpt\.edu\.vn$/, "Email must end with @fpt.edu.vn"),
    password: Yup.string().required("Password is required"),
  });

  //Get All Users (Account)
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    let res = await AllAccount();

    if (res && res.data) {
      setAccount(res.data);
    }
  };

  const checkEmail = (email) => {
    return account.some((account) => account.email === email);
  };

  const checkPassword = (password) => {
    const hashedPassword = HmacSHA256(password, "duyanh69").toString(
      enc.Base64
    );
    const foundAccount = account.find(
      (account) => account.email === formData.email
    );
    if (foundAccount) {
      return foundAccount.password === hashedPassword;
    }
    return false;
  };

  // handle api login
  const handleLogin = async () => {
    const { email, password } = formData;

    try {
      const response = await axios.post(
        `https://backend-api-system.azurewebsites.net/auth/login?email=${email}&password=${password}`
      );

      if (response.status === 200) {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setRole(userData.role);
        setEmail(userData.email);
        setIsLogin(true);
        setLoading(true);
        console.log("Sign in Success");
        navigate("/");
      } else {
        setError("Failed to login. Please check your email and password.");
      }
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Axios error:", err);
      }
    }
  };

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const isEmailCorrect = checkEmail(formData.email);
      const isPasswordCorrect = checkPassword(formData.password);

      if (!isEmailCorrect) {
        setError({ email: "Wrong Email. Please enter a valid Email!" });
        return;
      }

      if (!isPasswordCorrect) {
        setError({
          password: "Wrong Password. Please enter a valid Password!",
        });
        return;
      }
      await handleLogin();
    } catch (error) {
      if (error.inner) {
        const newError = {};
        error.inner.forEach((err) => {
          newError[err.path] = err.message;
        });
        setError(newError);
      } else if (err.response) {
        console.log("Server error:", err.response.data);
      } else {
        console.log("Axios error:", err);
      }
    }
  };

  //handle input change
  const handleChange = async (e) => {
    const { name, value } = e.target;
    try {
      await validationSchema.validateAt(name, { [name]: value });
      setError((prevError) => ({
        ...prevError,
        [name]: "",
      }));
    } catch (err) {
      setError((prevError) => ({
        ...prevError,
        [name]: err.message,
      }));
    }
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Fragment>
      <div className={style["container"]}>
        <div className={style["logo-img"]}>
          <img src={logo} alt="logo" className={style["logo"]} />
          <p className={style["welcome"]}>WELCOME</p>
        </div>

        <div className={style["wrapper"]}>
          <form action="" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className={style["input-box"]}>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {error.email && (
                <span className={style["error"]}>{error.email}</span>
              )}
            </div>
            <div className={style["input-box"]}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {error.password && (
                <div className={style["error"]}>{error.password}</div>
              )}
            </div>
            <button>{loading ? "Signing In..." : "SIGN IN"}</button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default SignIn;
