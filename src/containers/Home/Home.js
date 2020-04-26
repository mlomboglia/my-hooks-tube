import React, { useState, useEffect, useCallback } from "react";

import SideBar from "../SideBar/SideBar";
import HomeContent from "./HomeContent/HomeContent";
import "./Home.scss";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  getVideoCategoryIds,
  videoCategoriesLoaded,
  videosByCategoryLoaded,
} from "../../store/reducers/videos";
import * as videoActions from "../../store/actions/videos";

const Home = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);

  //Dispatch
  const dispatch = useDispatch();
  const dispatchMostPopularVideos = useCallback(
    () => dispatch(videoActions.fetchMostPopularVideos()),
    [dispatch]
  );
  const dispatchVideoCategories = useCallback(
    () => dispatch(videoActions.fetchVideoCategories()),
    [dispatch]
  );
  const dispatchMostPopularVideosByCategory = useCallback(
    (categories) =>
      dispatch(videoActions.fetchMostPopularVideosByCategory(categories)),
    [dispatch]
  );

  //Selector
  const videoCategories = useSelector((state) => {
    return getVideoCategoryIds(state);
  }, shallowEqual);

  const isVideoCategoriesLoaded = useSelector((state) => {
    return videoCategoriesLoaded(state);
  }, shallowEqual);

  const isVideosByCategoryLoaded = useSelector((state) => {
    return videosByCategoryLoaded(state);
  }, shallowEqual);

  useEffect(() => {
    dispatchMostPopularVideos();
  }, [dispatchMostPopularVideos]);

  useEffect(() => {
    dispatchVideoCategories();
  }, [dispatchVideoCategories]);

  const dispatchVideosByCategory = useCallback(() => {
    const categories = videoCategories.slice(categoryIndex, categoryIndex + 3);
    dispatchMostPopularVideosByCategory(categories);
    setCategoryIndex(categoryIndex + 3);
  }, [dispatchMostPopularVideosByCategory, categoryIndex, videoCategories]);

  useEffect(() => {
    if (videoCategories.length > 0) {
      dispatchVideosByCategory();
    }
  }, [videoCategories]);

  const bottomReachedCallback = () => {
    console.log(isVideoCategoriesLoaded);
    if (!isVideoCategoriesLoaded) {
      return;
    }
    dispatchVideosByCategory();
  };

  const shouldShowLoader = () => {
    if (isVideoCategoriesLoaded && isVideosByCategoryLoaded) {
      return categoryIndex < videoCategories.length;
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

export default Home;
