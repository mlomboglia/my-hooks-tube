import React, { useEffect, useCallback } from "react";

import {bindActionCreators} from 'redux';
import * as watchActions from '../../store/actions/watch';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getYoutubeLibraryLoaded} from '../../store/reducers/api';
import {getSearchParam} from '../../shared/url';
import {getChannelId} from '../../store/reducers/videos';
import {getCommentNextPageToken} from '../../store/reducers/comments';
import WatchContent from './WatchContent/WatchContent';
import * as commentActions from '../../store/actions/comments';

const Watch = (props) => {

  const {
    youtubeLibraryLoaded,
    fetchWatchDetails,
    channelId,
    history
  } = props;

  const getVideoId = useCallback(() => {
    return getSearchParam(props.location, 'v');
  }, [props.location]);

  const fetchWatchContent = useCallback(() => {
    const videoId = getVideoId();
    if(!videoId) {
      history.push('/');
    }
    fetchWatchDetails(videoId, channelId);
  }, [fetchWatchDetails, getVideoId, channelId, history]);

  const fetchMoreComments = () => {
    if (props.nextPageToken) {
      props.fetchCommentThread(getVideoId(), props.nextPageToken);
    }
  };

  useEffect(() => {
    if (youtubeLibraryLoaded) {
      fetchWatchContent();
    }
  }, [fetchWatchContent, youtubeLibraryLoaded, fetchWatchDetails])
  
  const videoId = getVideoId();
  return (
    <WatchContent videoId={videoId}
                    channelId={channelId}
                    bottomReachedCallback={fetchMoreComments}
                    nextPageToken={props.nextPageToken}
      />
  );
};  

function mapStateToProps(state, props) {
  return {
    youtubeLibraryLoaded: getYoutubeLibraryLoaded(state),
    channelId: getChannelId(state, props.location, 'v'),
    nextPageToken: getCommentNextPageToken(state, props.location),
  };
}

function mapDispatchToProps(dispatch) {
  const fetchWatchDetails = watchActions.details.request;
  const fetchCommentThread = commentActions.thread.request;
  return bindActionCreators({fetchWatchDetails, fetchCommentThread}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Watch));

