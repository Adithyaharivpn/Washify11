import React from "react";
import Navbar from "../Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrap">{children}</div>
      {/* <Footer /> can go here */}
    </div>
  );
};

export default MainLayout;
