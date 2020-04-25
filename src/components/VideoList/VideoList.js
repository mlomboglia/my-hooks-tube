import React from "react";
import SideBar from "../../containers/SideBar/SideBar";
import InfiniteScroll from "../InfiniteScroll/InfiniteScroll";
import VideoPreview from "../../components/VideoPreview/VideoPreview";

const VideoList = (props) => {
  const getVideoPreviews = () => {
    if (!props.videos || !props.videos.length) {
      return null;
    }
    const firstVideo = props.videos[0];
    if (!firstVideo.snippet.description) {
      return null;
    }
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

  const videoPreviews = getVideoPreviews();

  return (
    <React.Fragment>
      <SideBar />
      <div className="video-list">
        <InfiniteScroll
          bottomReachedCallback={props.bottomReachedCallback}
          showLoader={props.showLoader}
        >
          {videoPreviews}
        </InfiniteScroll>
      </div>
    </React.Fragment>
  );
};

export default VideoList;
