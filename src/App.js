import React from "react";

import Home from "./containers/Home/Home";
import Watch from "./containers/Watch/Watch";
import Search from './containers/Search/Search';

import AppLayout from "./components/AppLayout/AppLayout";
import { Route, Switch, withRouter } from "react-router-dom";
import Trending from './containers/Trending/Trending';

const App = (props) => {
  
  return (
    <AppLayout>
      <Switch>
          <Route path="/feed/trending" component={Trending}/>
          <Route path="/results" render={props => <Search {...props}/>}/>
          <Route path="/watch" render={props => <Watch {...props}/>}/>
          <Route path="/" component={Home}/>
      </Switch>
    </AppLayout>
  );
};

export default withRouter(App);
