import React, { useState, useEffect, useCallback } from "react";

import SideBar from "../SideBar/SideBar";
import HomeContent from "./HomeContent/HomeContent";
import "./Home.scss";
import { connect } from "react-redux";
import {
  getVideoCategoryIds,
  videoCategoriesLoaded,
  videosByCategoryLoaded
  } from "../../store/reducers/videos";
import * as videoActions from "../../store/actions/videos";

const Home = (props) => {
 
  const [categoryIndex, setCategoryIndex] = useState(0);
  const { fetchMostPopularVideos, fetchVideoCategories, fetchMostPopularVideosByCategory, videoCategories } = props;

  useEffect(() => {
    fetchMostPopularVideos();
  }, [fetchMostPopularVideos]);


  useEffect(() => {
    fetchVideoCategories();
  }, [fetchVideoCategories]);

  const fetchVideosByCategory = useCallback(() => {
    console.log("fetchVideosByCategory");
    const categories = videoCategories.slice(categoryIndex, categoryIndex + 3);
    fetchMostPopularVideosByCategory(categories);
    setCategoryIndex(categoryIndex + 3);
  }, [fetchMostPopularVideosByCategory, categoryIndex, videoCategories]);

  useEffect(() => {
    fetchVideosByCategory();
  }, [fetchVideosByCategory, fetchMostPopularVideosByCategory, videoCategories]);
  
  const bottomReachedCallback = () => {
    console.log("bottomReachCallback1");
    console.log(props.videoCategoriesLoaded);
    if (!props.videoCategoriesLoaded) {
      return;
    }
    console.log("bottomReachCallback2");
    fetchVideosByCategory();
  };

  const shouldShowLoader = () => {
    if (props.videoCategoriesLoaded) {
      return categoryIndex < props.videoCategories.length;
    }
    return false;
  };

  return (
    <React.Fragment>
      <SideBar />
      <HomeContent
        bottomReachedCallback={bottomReachedCallback}
        showLoader={shouldShowLoader()}
      />
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    videoCategories: getVideoCategoryIds(state),
    videoCategoriesLoaded: videoCategoriesLoaded(state),
    videosByCategoryLoaded: videosByCategoryLoaded(state),
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMostPopularVideos: () => dispatch(videoActions.fetchMostPopularVideos()),
    fetchVideoCategories:  () => dispatch(videoActions.fetchVideoCategories()),
    fetchMostPopularVideosByCategory: (categories) => dispatch(videoActions.fetchMostPopularVideosByCategory(categories))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
