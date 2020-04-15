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
import { connect } from "react-redux";
import { getChannel } from "../../../store/reducers/channels";
import { getCommentsForVideo } from "../../../store/reducers/comments";
import InfiniteScroll from "../../../components/InfiniteScroll/InfiniteScroll";

const WatchContent = (props) => {
  if (!props.videoId) {
    return <div />;
  }

  const shouldShowLoader = () => {
    return !!props.nextPageToken;
  }

  return (
    <InfiniteScroll
      bottomReachedCallback={props.bottomReachedCallback}
      showLoader={shouldShowLoader()}
    >
      <div className="watch-grid">
        <Video className="video" id={props.videoId} />
        <VideoMetadata video={props.video} />
        <VideoInfoBox
          className="video-info-box"
          video={props.video}
          channel={props.channel}
        />
        <Comments
          comments={props.comments}
          amountComments={props.amountComments}
        />
        <RelatedVideos className="relatedVideos" videos={props.relatedVideos} />
      </div>
    </InfiniteScroll>
  );
};

function mapStateToProps(state, props) {
  return {
    relatedVideos: getRelatedVideos(state, props.videoId),
    video: getVideoById(state, props.videoId),
    channel: getChannel(state, props.channelId),
    comments: getCommentsForVideo(state, props.videoId),
    amountComments: getAmountComments(state, props.videoId),
  };
}

export default connect(mapStateToProps, null)(WatchContent);
