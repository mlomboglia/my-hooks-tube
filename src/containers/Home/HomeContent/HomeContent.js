import React from "react";

import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import VideoGrid from "../../../components/VideoGrid/VideoGrid";
import "./HomeContent.scss";
import {
  getMostPopularVideos,
  getVideosByCategory,
} from "../../../store/reducers/videos";

import { useSelector, shallowEqual } from "react-redux";

const AMOUNT_TRENDING_VIDEOS = 12;

const HomeContent = (props) => {
  
  //Selector
  const videosByCategory = useSelector((state) => {
    return getVideosByCategory(state);
  }, shallowEqual);

  const mostPopularVideos = useSelector((state) => {
    return getMostPopularVideos(state);
  }, shallowEqual);
  
  const getTrendingVideos = () => {
    return mostPopularVideos.slice(0, AMOUNT_TRENDING_VIDEOS);
  };

  const getVideoGridsForCategories = () => {
    const categoryTitles = Object.keys(videosByCategory || {});
    return categoryTitles.map((categoryTitle, index) => {
      const videos = videosByCategory[categoryTitle];
      // the last video grid element should not have a divider
      const hideDivider = index === categoryTitles.length - 1;
      return (
        <VideoGrid
          title={categoryTitle}
          videos={videos}
          key={categoryTitle}
          hideDivider={hideDivider}
        />
      );
    });
  };

  const trendingVideos = getTrendingVideos();
  const categoryGrids = getVideoGridsForCategories();

  return (
    <div className="home-content">
      <div className="responsive-video-grid-container">
        <InfiniteScroll
          bottomReachedCallback={props.bottomReachedCallback}
          showLoader={props.showLoader}
        >
          <VideoGrid title="Trending" videos={trendingVideos} />
          {categoryGrids}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HomeContent;
