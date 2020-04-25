import axios from "../../axios-youtube";
import * as api from "../api/youtube-api";

import {
    createAction,
    createRequestTypes,
    REQUEST,
    SUCCESS,
    FAILURE,
  } from "./index";
  
export const COMMENT_THREAD = createRequestTypes('COMMENT_THREAD');
export const thread = {
  request: (videoId, nextPageToken) => createAction(COMMENT_THREAD[REQUEST], {videoId, nextPageToken}),
  success: (response, videoId) => createAction(COMMENT_THREAD[SUCCESS], {response, videoId}),
  failure: (response) => createAction(COMMENT_THREAD[FAILURE], {response}),
};

export const fetchCommentThread = (videoId, nextPageToken) => {
  return (dispatch) => {
    dispatch(thread.request());
    const config = api.buildCommentThreadRequest(videoId, nextPageToken);
    axios
      .request(config)
      .then((response) => {
        dispatch(thread.success(response.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(thread.failure(err));
      });
  };
}
