import React, { useEffect, useCallback } from "react";
import "./Search.scss";

import { getYoutubeLibraryLoaded } from "../../store/reducers/api";
import {
  getSearchNextPageToken,
  getSearchResults,
} from "../../store/reducers/search";
import * as searchActions from "../../store/actions/search";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getSearchParam } from "../../shared/url";
import VideoList from '../../components/VideoList/VideoList';

const Search = (props) => {
  const { youtubeApiLoaded, history } = props;

  const getSearchQuery = useCallback(() => {
    return getSearchParam(props.location, "search_query");
  }, []);

  const searchForVideos = useCallback(() => {
    const searchQuery = getSearchQuery();
    if (youtubeApiLoaded) {
      searchForVideos(searchQuery);
    }
  }, [youtubeApiLoaded, getSearchQuery]);

  const bottomReachedCallback = () => {
    if(props.nextPageToken) {
      props.searchForVideos(getSearchQuery(), props.nextPageToken, 25);
    }
  };

  useEffect(() => {
    if (!getSearchQuery()) {
      // redirect to home component if search query is not there
      history.push("/");
    }
    searchForVideos();
  }, [getSearchQuery, searchForVideos, youtubeApiLoaded, history]);

  return (
    <VideoList
        bottomReachedCallback={bottomReachedCallback}
        showLoader={true}
        videos={props.searchResults}/>
  );
};

function mapDispatchToProps(dispatch) {
  const searchForVideos = searchActions.forVideos.request;
  return bindActionCreators({ searchForVideos }, dispatch);
}

function mapStateToProps(state, props) {
  return {
    youtubeApiLoaded: getYoutubeLibraryLoaded(state),
    searchResults: getSearchResults(state, props.location.search),
    nextPageToken: getSearchNextPageToken(state, props.location.search),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
