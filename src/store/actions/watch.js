import axios from "../../axios-youtube";
import * as api from "../api/youtube-api";

import {
  createAction,
  createRequestTypes,
} from "./index";

import {SEARCH_LIST_RESPONSE, VIDEO_LIST_RESPONSE} from '../api/youtube-api-response-types';

export const WATCH_DETAILS = createRequestTypes("WATCH_DETAILS");
export const details = {
  request: (videoId, channelId) =>
    createAction(WATCH_DETAILS.REQUEST, { videoId, channelId }),
  success: (response, videoId) =>
    createAction(WATCH_DETAILS.SUCCESS, { response, videoId }),
  failure: (response) => createAction(WATCH_DETAILS.FAILURE, { response }),
};

export const VIDEO_DETAILS = createRequestTypes("VIDEO_DETAILS");
export const videoDetails = {
  request: () => {
    throw Error("not implemented");
  },
  success: (response) => createAction(VIDEO_DETAILS.SUCCESS, { response }),
  failure: (response) => createAction(VIDEO_DETAILS.FAILURE, { response }),
};

export const fetchWatchDetails = (videoId, channelId) => {
  return (dispatch) => {
    dispatch(details.request());
    let requests = [
      api.buildVideoDetailRequest(null, videoId),
      api.buildRelatedVideosRequest(null, videoId),
      api.buildCommentThreadRequest(null, videoId),
    ];

    if (channelId) {
      requests.push(api.buildChannelRequest(null, channelId));
    }

    axios
      .all(requests)
      .then((responses) => {
        console.log(responses);
        responses.map((response) => {
          return dispatch(details.success(response.data, videoId));
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(details.failure(err));
      });
  };
};

export const fetchVideoDetails = (responses, shouldFetchChannelInfo) => {
  return (dispatch) => {
    dispatch(videoDetails.request());

    const searchListResponse = responses.find(
      (response) => response.result.kind === SEARCH_LIST_RESPONSE
    );
    const relatedVideoIds = searchListResponse.result.items.map(
      (relatedVideo) => relatedVideo.id.videoId
    );

    const requests = relatedVideoIds.map((relatedVideoId) => {
      return api.buildVideoDetailRequest(null, relatedVideoId);
    });

    if (shouldFetchChannelInfo) {
      // we have to extract the video's channel id from the video details response
      // so we can load additional channel information.
      // this is only needed, when a user directly accesses .../watch?v=1234
      // because then we only know the video id
      const videoDetailResponse = responses.find(
        (response) => response.result.kind === VIDEO_LIST_RESPONSE
      );
      const videos = videoDetailResponse.result.items;
      if (videos && videos.length) {
        requests.push(
          api.buildChannelRequest(null, videos[0].snippet.channelId)
        );
      }
    }

    axios
      .all(requests)
      .then((responses) => {
        console.log(responses);
        responses.map((response) => {
          return dispatch(videoDetails.success(response.data));
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(videoDetails.failure(err));
      });
  };
};
