import React, { useEffect } from "react";

import SideBar from "../SideBar/SideBar";
import HomeContent from "./HomeContent/HomeContent";
import "./Home.scss";

import { connect } from "react-redux";
import * as videoActions from "../../store/actions/videos";
import { bindActionCreators } from "redux";
import { getYoutubeLibraryLoaded } from "../../store/reducers/api";

const Home = (props) => {
  const { fetchMostPopularVideos, youtubeLibraryLoaded } = props;

  useEffect(() => {
    fetchMostPopularVideos();
  }, [fetchMostPopularVideos, youtubeLibraryLoaded]);

  //componentDidUpdate(prevProps) {
  //  if (this.props.youtubeLibraryLoaded !== prevProps.youtubeLibraryLoaded) {
  //    this.props.fetchMostPopularVideos();
  //  }
  //}

  return (
    <React.Fragment>
      <SideBar />
      <HomeContent />
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    youtubeLibraryLoaded: getYoutubeLibraryLoaded(state),
  };
}

function mapDispatchToProps(dispatch) {
  const fetchMostPopularVideos = videoActions.mostPopular.request;
  return bindActionCreators({ fetchMostPopularVideos }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
