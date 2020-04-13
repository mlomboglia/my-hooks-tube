import React, { useState, useEffect, useCallback } from "react";

import SideBar from "../SideBar/SideBar";
import HomeContent from "./HomeContent/HomeContent";
import "./Home.scss";

import { connect } from "react-redux";
import * as videoActions from "../../store/actions/videos";
import { bindActionCreators } from "redux";
import { getYoutubeLibraryLoaded } from "../../store/reducers/api";
import {
  getVideoCategoryIds,
  videoCategoriesLoaded,
  videosByCategoryLoaded,
} from "../../store/reducers/videos";

const Home = (props) => {
  const {
    fetchMostPopularVideos,
    fetchVideoCategories,
    fetchMostPopularVideosByCategory,
    youtubeLibraryLoaded,
    videoCategories,
  } = props;

  const [categoryIndex, setCategoryIndex] = useState(0);

  useEffect(() => {
    fetchMostPopularVideos();
  }, [fetchMostPopularVideos, youtubeLibraryLoaded]);

  useEffect(() => {
    fetchVideoCategories();
  }, [fetchVideoCategories, youtubeLibraryLoaded]);

  const fetchVideosByCategory = useCallback(() => {
    const categories = videoCategories.slice(categoryIndex, categoryIndex + 3);
    fetchMostPopularVideosByCategory(categories);
    setCategoryIndex(categoryIndex + 3);
  }, [fetchMostPopularVideosByCategory, categoryIndex, videoCategories]);

  //useEffect(() => {
  //  fetchVideosByCategory();
  //}, [fetchVideosByCategory]);

  const bottomReachedCallback = () => {
    if (!props.videoCategoriesLoaded) {
      return;
    }
    fetchVideosByCategory();
  };

  const shouldShowLoader = () => {
    if (props.videoCategoriesLoaded && props.videosByCategoryLoaded) {
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
    youtubeLibraryLoaded: getYoutubeLibraryLoaded(state),
    videoCategories: getVideoCategoryIds(state),
    videoCategoriesLoaded: videoCategoriesLoaded(state),
    videosByCategoryLoaded: videosByCategoryLoaded(state),
  };
}

function mapDispatchToProps(dispatch) {
  const fetchMostPopularVideos = videoActions.mostPopular.request;
  const fetchVideoCategories = videoActions.categories.request;
  const fetchMostPopularVideosByCategory =
    videoActions.mostPopularByCategory.request;
  return bindActionCreators(
    {
      fetchMostPopularVideos,
      fetchVideoCategories,
      fetchMostPopularVideosByCategory,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
