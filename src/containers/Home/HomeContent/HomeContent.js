import React from "react";

import VideoGrid from "../../../components/VideoGrid/VideoGrid";
import "./HomeContent.scss";
import {getMostPopularVideos} from '../../../store/reducers/videos';
import {connect} from 'react-redux';

const AMOUNT_TRENDING_VIDEOS = 12;

const HomeContent = props => {
  
  const getTrendingVideos = () => {
    return props.mostPopularVideos.slice(0, AMOUNT_TRENDING_VIDEOS);
  }

  const trendingVideos = getTrendingVideos();

  return (
    <div className="home-content">
      <div className="responsive-video-grid-container">
        <VideoGrid title="Trending" videos={trendingVideos} />
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    mostPopularVideos: getMostPopularVideos(state),
  };
}
export default connect(mapStateToProps, null)(HomeContent);
