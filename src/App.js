import React from "react";

import Home from "./containers/Home/Home";
import Watch from "./containers/Watch/Watch";
import Search from './containers/Search/Search';

import AppLayout from "./components/AppLayout/AppLayout";
import { Route, Switch, withRouter, useLocation } from "react-router-dom";
import Trending from './containers/Trending/Trending';

const App = (props) => {

  const location = useLocation();
  
  return (
    <AppLayout>
      <Switch>
          <Route path="/feed/trending" component={Trending}/>
          <Route path="/results" render={props => <Search key={location.key} {...props}/>}/>
          <Route path="/watch" render={props => <Watch key={location.key} {...props}/>}/>
          <Route path="/" component={Home}/>
      </Switch>
    </AppLayout>
  );
};

export default withRouter(App);
