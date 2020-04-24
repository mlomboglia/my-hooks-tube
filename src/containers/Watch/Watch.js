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
    () => dispatch(watchActions.fetchWatchDetails()),
    [dispatch]
  );

  const dispatchCommentThread = useCallback(
    () => dispatch(commentsActions.fetchCommentThread()),
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
    if (props.nextPageToken) {
      props.dispatchCommentThread(getVideoId(), props.nextPageToken);
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
      nextPageToken={props.nextPageToken}
    />
  );
};

export default withRouter(Watch);
