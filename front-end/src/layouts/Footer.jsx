import React, { Fragment } from "react";
import style from "../styles/homepage/footer.module.css";

const Footer = () => {
  return (
    <Fragment>
      <footer className={style["footer"]}>
        <div className={style["footer__content"]}>
          <h1>1640 - Enterprise Web Application</h1>
          <p>Project: Student Contribution System</p>
          <p>Technologies: React.js - ASP.NET - MongoDB</p>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
