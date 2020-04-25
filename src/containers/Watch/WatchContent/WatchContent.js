import React from "react";

import "./WatchContent.scss";
import Video from "../../../components/Video/Video";
import RelatedVideos from "../../../components/RelatedVideos/RelatedVideos";
import VideoMetadata from "../../../components/VideoMetadata/VideoMetadata";
import VideoInfoBox from "../../../components/VideoInfoBox/VideoInfoBox";
import Comments from "../../Comments/Comments";
import {
  getAmountComments,
  getRelatedVideos,
  getVideoById,
} from "../../../store/reducers/videos";
import { useSelector, shallowEqual } from "react-redux";
import { getChannel } from "../../../store/reducers/channels";
import { getCommentsForVideo } from "../../../store/reducers/comments";
import InfiniteScroll from "../../../components/InfiniteScroll/InfiniteScroll";

const WatchContent = (props) => {
  const relatedVideos = useSelector((state) => {
    return getRelatedVideos(state, props.videoId);
  }, shallowEqual);

  const video = useSelector((state) => {
    return getVideoById(state, props.videoId);
  }, shallowEqual);

  const channel = useSelector((state) => {
    return getChannel(state, props.channelId);
  }, shallowEqual);

  const comments = useSelector((state) => {
    return getCommentsForVideo(state, props.videoId);
  }, shallowEqual);

  const amountComments = useSelector((state) => {
    return getAmountComments(state, props.videoId);
  }, shallowEqual);

  if (!props.videoId) {
    return <div />;
  }

  const shouldShowLoader = () => {
    return !!props.nextPageToken;
  };

  console.log(relatedVideos);

  return (
    <InfiniteScroll
      bottomReachedCallback={props.bottomReachedCallback}
      showLoader={shouldShowLoader()}
    >
      <div className="watch-grid">
        <Video className="video" id={props.videoId} />
        <VideoMetadata video={video} />
        <VideoInfoBox
          className="video-info-box"
          video={video}
          channel={channel}
        />
        <Comments
          comments={comments}
          amountComments={amountComments}
        />
        <RelatedVideos className="relatedVideos" videos={relatedVideos} />
      </div>
    </InfiniteScroll>
  );
};

export default WatchContent;
