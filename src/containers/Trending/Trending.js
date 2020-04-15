import React, { useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./Trending.scss";
import VideoPreview from "../../components/VideoPreview/VideoPreview";
import SideBar from "../SideBar/SideBar";
import {
  allMostPopularVideosLoaded,
  getMostPopularVideos,
  getMostPopularVideosNextPageToken,
} from "../../store/reducers/videos";
import InfiniteScroll from "../../components/InfiniteScroll/InfiniteScroll";
import * as videoActions from "../../store/actions/videos";
import { getYoutubeLibraryLoaded } from "../../store/reducers/api";

const Trending = (props) => {
  const { youtubeLibraryLoaded, fetchMostPopularVideos, nextPageToken } = props;

  const getVideoPreviews = () => {
    return props.videos.map((video) => (
      <VideoPreview
        horizontal={true}
        expanded={true}
        video={video}
        key={video.id}
        pathname={"/watch"}
        search={"?v=" + video.id}
      />
    ));
  };

  const shouldShowLoader = () => {
    return !props.allMostPopularVideosLoaded;
  };

  const previews = getVideoPreviews();
  const loaderActive = shouldShowLoader();

  useEffect(() => {
    if (youtubeLibraryLoaded && nextPageToken) {
      fetchMostPopularVideos(20, true, nextPageToken);
    }
  }, [youtubeLibraryLoaded, fetchMostPopularVideos, nextPageToken]);

  const fetchMoreVideos = () => {
    if (youtubeLibraryLoaded && nextPageToken) {
      props.fetchMostPopularVideos(12, true, nextPageToken);
    }
  };

  return (
    <React.Fragment>
      <SideBar />
      <InfiniteScroll
        bottomReachedCallback={fetchMoreVideos}
        showLoader={loaderActive}
      >
          <div className='trending'>{previews}</div>
      </InfiniteScroll>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    videos: getMostPopularVideos(state),
    youtubeLibraryLoaded: getYoutubeLibraryLoaded(state),
    allMostPopularVideosLoaded: allMostPopularVideosLoaded(state),
    nextPageToken: getMostPopularVideosNextPageToken(state),
  };
}

function mapDispatchToProps(dispatch) {
  const fetchMostPopularVideos = videoActions.mostPopular.request;
  return bindActionCreators({ fetchMostPopularVideos }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Trending);
