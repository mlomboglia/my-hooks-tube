import React from "react";

import "./WatchContent.scss";
import Video from "../../../components/Video/Video";
import RelatedVideos from "../../../components/RelatedVideos/RelatedVideos";
import VideoMetadata from "../../../components/VideoMetadata/VideoMetadata";
import VideoInfoBox from "../../../components/VideoInfoBox/VideoInfoBox";
import Comments from "../../Comments/Comments";
import { getRelatedVideos, getVideoById } from "../../../store/reducers/videos";
import { connect } from "react-redux";
import {getChannel} from '../../../store/reducers/channels';

const WatchContent = (props) => {
  if (!props.videoId) {
    return <div />;
  }

  return (
    <div className="watch-grid">
      <Video className="video" id={props.videoId} />
      <VideoMetadata video={props.video} />
      <VideoInfoBox className='video-info-box' video={props.video} channel={props.channel}/>
      <Comments amountComments={112499} />
      <RelatedVideos className="relatedVideos" videos={props.relatedVideos}/>
    </div> 
  );
};

function mapStateToProps(state, props) {
  return {
    relatedVideos: getRelatedVideos(state, props.videoId),
    video: getVideoById(state, props.videoId),
    channel: getChannel(state, props.channelId),
  };
}

export default connect(mapStateToProps, null)(WatchContent);
