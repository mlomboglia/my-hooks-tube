import React, { useEffect, useCallback } from "react";

import { withRouter } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getSearchParam } from "../../shared/url";
import { getChannelId } from "../../store/reducers/videos";
import { getCommentNextPageToken } from "../../store/reducers/comments";
import WatchContent from "./WatchContent/WatchContent";

import * as watchActions from "../../store/actions/watch";
import * as commentsActions from "../../store/actions/comments";

const Watch = (props) => {
  const dispatch = useDispatch();
  const dispatchWatchDetails = useCallback(
    (videoId, channelId) => dispatch(watchActions.fetchWatchDetails(videoId, channelId)),
    [dispatch]
  );

  const dispatchCommentThread = useCallback(
    (videoId, nextPageToken) => dispatch(commentsActions.fetchCommentThread(videoId, nextPageToken)),
    [dispatch]
  );

  const channelId = useSelector((state) => {
    return getChannelId(state, props.location, "v");
  }, shallowEqual);

  const nextPageToken = useSelector((state) => {
    return getCommentNextPageToken(state, props.location);
  }, shallowEqual);

  const getVideoId = useCallback(() => {
    return getSearchParam(props.location, "v");
  }, [props.location]);

  const fetchWatchContent = useCallback(() => {
    const videoId = getVideoId();
    if (!videoId) {
      props.history.push("/");
    }
    dispatchWatchDetails(videoId, channelId);
  }, [dispatchWatchDetails, getVideoId, channelId, props.history]);

  const fetchMoreComments = () => {
    if (nextPageToken) {
      dispatchCommentThread(getVideoId(), nextPageToken);
    }
  };

  useEffect(() => {
    fetchWatchContent();
  }, [fetchWatchContent, dispatchWatchDetails]);

  const videoId = getVideoId();
  return (
    <WatchContent
      videoId={videoId}
      channelId={channelId}
      bottomReachedCallback={fetchMoreComments}
      nextPageToken={nextPageToken}
    />
  );
};

export default withRouter(Watch);
