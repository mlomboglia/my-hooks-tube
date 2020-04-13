import React, { useEffect, useCallback } from "react";

import {bindActionCreators} from 'redux';
import * as watchActions from '../../store/actions/watch';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getYoutubeLibraryLoaded} from '../../store/reducers/api';
import {getSearchParam} from '../../shared/url';
import WatchContent from './WatchContent/WatchContent';

const Watch = (props) => {

  const {
    youtubeLibraryLoaded,
    fetchWatchDetails,
    channelId,
    history,
    location
  } = props;

  const getVideoId = useCallback(() => {
    return getSearchParam(location, 'v');
  }, [location]);

  const fetchWatchContent = useCallback(() => {
    const videoId = getVideoId();
    if(!videoId) {
      history.push('/');
    }
    fetchWatchDetails(videoId, channelId);
  }, [fetchWatchDetails, getVideoId, channelId, history]);

  useEffect(() => {
    if (youtubeLibraryLoaded) {
      fetchWatchContent();
    }
  }, [fetchWatchContent, youtubeLibraryLoaded, fetchWatchDetails])
  
  const videoId = getVideoId();
  return (
    <WatchContent videoId={videoId}/>
  );
};  

function mapStateToProps(state) {
  return {
    youtubeLibraryLoaded: getYoutubeLibraryLoaded(state),
  };
}

function mapDispatchToProps(dispatch) {
  const fetchWatchDetails = watchActions.details.request;
  return bindActionCreators({fetchWatchDetails}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Watch));

