import React from "react";
import "./AppLayout.scss";
import HeaderNav from "../../containers/HeaderNav/HeaderNav";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const AppLayout = (props) => {
  return (
    <ScrollToTop>
      <div className="app-layout">
        <HeaderNav />
        {props.children}
      </div>
    </ScrollToTop>
  );
};

export default AppLayout;
