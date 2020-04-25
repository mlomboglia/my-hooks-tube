import axios from "../../axios-youtube";
import * as api from "../api/youtube-api";

import { createAction, createRequestTypes } from "./index";

import {
  SEARCH_LIST_RESPONSE,
  VIDEO_LIST_RESPONSE,
} from "../api/youtube-api-response-types";

export const WATCH_DETAILS = createRequestTypes("WATCH_DETAILS");
export const details = {
  request: () => createAction(WATCH_DETAILS.REQUEST),
  success: (response, videoId) =>
    createAction(WATCH_DETAILS.SUCCESS, { response, videoId }),
  failure: (response) => createAction(WATCH_DETAILS.FAILURE, { response }),
};

export const VIDEO_DETAILS = createRequestTypes("VIDEO_DETAILS");
export const videoDetails = {
  request: () => createAction(VIDEO_DETAILS.REQUEST),
  success: (response) => createAction(VIDEO_DETAILS.SUCCESS, { response }),
  failure: (response) => createAction(VIDEO_DETAILS.FAILURE, { response }),
};

export const fetchWatchDetails = (videoId, channelId) => {
  return (dispatch) => {
    dispatch(details.request());
    let requests = [
      axios.request(api.buildVideoDetailRequest(videoId)),
      axios.request(api.buildRelatedVideosRequest(videoId)),
      axios.request(api.buildCommentThreadRequest(videoId)),
    ];

    if (channelId) {
      requests.push(axios.request(api.buildChannelRequest(channelId)));
    }

    Promise.all(requests)
      .then((responses) => {
        dispatch(details.success(responses, videoId));
        dispatch(fetchVideoDetails(responses, channelId));
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
      (response) => response.data.kind === SEARCH_LIST_RESPONSE
    );
    const relatedVideoIds = searchListResponse.data.items.map(
      (relatedVideo) => relatedVideo.id.videoId
    );

    const requests = relatedVideoIds.map((relatedVideoId) => {
      return axios.request(api.buildVideoDetailRequest(relatedVideoId));
    });

    if (shouldFetchChannelInfo) {
      // we have to extract the video's channel id from the video details response
      // so we can load additional channel information.
      // this is only needed, when a user directly accesses .../watch?v=1234
      // because then we only know the video id
      const videoDetailResponse = responses.find(
        (response) => response.data.kind === VIDEO_LIST_RESPONSE
      );
      const videos = videoDetailResponse.data.items;
      if (videos && videos.length) {
        requests.push(
          axios.request(api.buildChannelRequest(videos[0].snippet.channelId))
        );
      }
    }

    Promise.all(requests)
      .then((responses) => {
        dispatch(videoDetails.success(responses));
      })
      .catch((err) => {
        console.log(err);
        dispatch(videoDetails.failure(err));
      });
    }
};
