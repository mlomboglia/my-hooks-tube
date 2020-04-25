import React, { useEffect, useCallback } from "react";
import "./Search.scss";

import {
  getSearchNextPageToken,
  getSearchResults,
} from "../../store/reducers/search";
import * as searchActions from "../../store/actions/search";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getSearchParam } from "../../shared/url";
import VideoList from "../../components/VideoList/VideoList";

const Search = (props) => {

  //Dispatch
  const dispatch = useDispatch();
  const dispatchSearchForVideos = useCallback(
    () => dispatch(searchActions.searchForVideos()),
    [dispatch]
  );

  //Selector
  const searchResults = useSelector((state) => {
    return getSearchResults(state, props.location.search);
  }, shallowEqual);

  const nextPageToken = useSelector((state) => {
    return getSearchNextPageToken(state, props.location.search);
  }, shallowEqual);

  const getSearchQuery = useCallback(() => {
    return getSearchParam(props.location, "search_query");
  }, []);

  const searchForVideos = useCallback(() => {
    const searchQuery = getSearchQuery();
    dispatchSearchForVideos(searchQuery);
  }, [getSearchQuery]);

  const bottomReachedCallback = () => {
    if (nextPageToken) {
      searchForVideos(getSearchQuery(), nextPageToken, 25);
    }
  };

  useEffect(() => {
    if (!getSearchQuery()) {
      // redirect to home component if search query is not there
      props.history.push("/");
    }
    searchForVideos();
  }, [getSearchQuery, searchForVideos]);

  return (
    <VideoList
      bottomReachedCallback={bottomReachedCallback}
      showLoader={true}
      videos={searchResults}
    />
  );
};

export default Search;
