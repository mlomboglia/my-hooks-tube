import React, { useEffect, useCallback } from "react";

import { withRouter, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getSearchParam } from "../../shared/url";
import { getChannelId } from "../../store/reducers/videos";
import { getCommentNextPageToken } from "../../store/reducers/comments";
import WatchContent from "./WatchContent/WatchContent";

import * as watchActions from "../../store/actions/watch";
import * as commentsActions from "../../store/actions/comments";

const Watch = () => {
  
  const location = useLocation();
  const history = useHistory();
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
    return getChannelId(state, location, "v");
  }, shallowEqual);

  const nextPageToken = useSelector((state) => {
    return getCommentNextPageToken(state, location);
  }, shallowEqual);

  const getVideoId = useCallback(() => {
    return getSearchParam(location, "v");
  }, [location]);

  const fetchWatchContent = useCallback(() => {
    const videoId = getVideoId();
    if (!videoId) {
      history.push("/");
    }
    dispatchWatchDetails(videoId, channelId);
  }, [dispatchWatchDetails, getVideoId, channelId, history]);

  const fetchMoreComments = () => {
    console.log("fetchMoreComments");
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
