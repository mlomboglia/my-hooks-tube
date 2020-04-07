import React from "react";
import HeaderNav from "./containers/HeaderNav/HeaderNav";
import SideBar from "./containers/SideBar/SideBar";
import Home from "./containers/Home/Home";

function App() {
  return (
    <React.Fragment>
      <HeaderNav />
      <SideBar />
      <Home />
    </React.Fragment>
  );
}

export default App;
