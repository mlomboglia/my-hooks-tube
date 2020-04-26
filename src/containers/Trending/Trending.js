import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  allMostPopularVideosLoaded,
  getMostPopularVideos,
  getMostPopularVideosNextPageToken,
} from "../../store/reducers/videos";
import * as videoActions from "../../store/actions/videos";
import VideoList from "../../components/VideoList/VideoList";

const Trending = (props) => {
  //Dispatch
  const dispatch = useDispatch();
  const dispatchMostPopularVideos = useCallback(
    (amount, loadDescription, nextPageToken) =>
      dispatch(
        videoActions.fetchMostPopularVideos(
          amount,
          loadDescription,
          nextPageToken
        )
      ),
    [dispatch]
  );

  //Selector
  const videos = useSelector((state) => {
    return getMostPopularVideos(state);
  }, shallowEqual);

  const isAllMostPopularVideosLoaded = useSelector((state) => {
    return allMostPopularVideosLoaded(state);
  }, shallowEqual);

  const nextPageToken = useSelector((state) => {
    return getMostPopularVideosNextPageToken(state);
  }, shallowEqual);

  const shouldShowLoader = () => {
    return !isAllMostPopularVideosLoaded;
  };

  useEffect(() => {
    dispatchMostPopularVideos(20, true);
  }, [dispatchMostPopularVideos]);

  const fetchMoreVideos = () => {
    if (nextPageToken) {
      dispatchMostPopularVideos(12, true, nextPageToken);
    }
  };

  const loaderActive = shouldShowLoader();

  return (
    <VideoList
      bottomReachedCallback={fetchMoreVideos}
      showLoader={loaderActive}
      videos={videos}
    />
  );
};

export default Trending;
