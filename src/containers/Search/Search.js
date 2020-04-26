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
import { useLocation, useHistory } from "react-router-dom";

const Search = () => {

  const location = useLocation();
  const history = useHistory();

  //Dispatch
  const dispatch = useDispatch();
  const dispatchSearchForVideos = useCallback(
    () => dispatch(searchActions.searchForVideos()),
    [dispatch]
  );

  //Selector
  const searchResults = useSelector((state) => {
    return getSearchResults(state, location.search);
  }, shallowEqual);

  const nextPageToken = useSelector((state) => {
    return getSearchNextPageToken(state, location.search);
  }, shallowEqual);

  const getSearchQuery = useCallback(() => {
    return getSearchParam(location, "search_query");
  }, [location]);

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
      history.push("/");
    }
    searchForVideos();
  }, [getSearchQuery, searchForVideos, history]);

  return (
    <VideoList
      bottomReachedCallback={bottomReachedCallback}
      showLoader={true}
      videos={searchResults}
    />
  );
};

export default Search;
