import axios from "../../axios-youtube";
import * as api from "../api/youtube-api";

import {
  createAction,
  createRequestTypes,
  REQUEST,
  SUCCESS,
  FAILURE,
} from "./index";

export const SEARCH_FOR_VIDEOS = createRequestTypes("SEARCH_FOR_VIDEOS");
export const forVideos = {
  request: (searchQuery, nextPageToken, amount) =>
    createAction(SEARCH_FOR_VIDEOS[REQUEST], {
      searchQuery,
      nextPageToken,
      amount,
    }),
  success: (response, searchQuery) =>
    createAction(SEARCH_FOR_VIDEOS[SUCCESS], { response, searchQuery }),
  failure: (response, searchQuery) =>
    createAction(SEARCH_FOR_VIDEOS[FAILURE], { response, searchQuery }),
};

export const searchForVideos = (searchQuery, nextPageToken, amount) => {
  return (dispatch) => {
    dispatch(forVideos.request());
    const config = api.buildSearchRequest(
      searchQuery,
      nextPageToken,
      amount
    );
    axios
      .request(config)
      .then((response) => {
        dispatch(forVideos.success(response.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(forVideos.failure(err));
      });
  };
};
