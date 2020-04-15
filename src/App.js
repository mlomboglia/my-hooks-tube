import React, { useEffect } from "react";

import Home from "./containers/Home/Home";
import Watch from "./containers/Watch/Watch";

import AppLayout from "./components/AppLayout/AppLayout";
import { Route, Switch, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { youtubeLibraryLoaded } from "./store/actions/api";
import Trending from './containers/Trending/Trending';

const App = (props) => {
  const { youtubeLibraryLoaded } = props;

  useEffect(() => {
    window.gapi.load("client", () => {
      window.gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
      window.gapi.client.load("youtube", "v3", () => {
        youtubeLibraryLoaded();
      });
    });
  }, [youtubeLibraryLoaded]);

  return (
    <AppLayout>
      <Switch>
          <Route path="/feed/trending" component={Trending}/>
          <Route path="/watch" render={() => <Watch key={this.props.location.key}/>}/>
          <Route path="/" component={Home}/>
      </Switch>
    </AppLayout>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ youtubeLibraryLoaded }, dispatch);
};

export default withRouter(connect(null, mapDispatchToProps)(App));
