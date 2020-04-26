import axios from "../../axios-youtube";
import * as api from "../api/youtube-api";

import { createAction, createRequestTypes } from "./index";

export const MOST_POPULAR = createRequestTypes("MOST_POPULAR");
export const mostPopular = {
  request: () => createAction(MOST_POPULAR.REQUEST),
  success: (videos) => createAction(MOST_POPULAR.SUCCESS, { videos }),
  failure: (response) => createAction(MOST_POPULAR.FAILURE, { response }),
};

export const VIDEO_CATEGORIES = createRequestTypes("VIDEO_CATEGORIES");
export const categories = {
  request: () => createAction(VIDEO_CATEGORIES.REQUEST),
  success: (response) => createAction(VIDEO_CATEGORIES.SUCCESS, { response }),
  failure: (response) => createAction(VIDEO_CATEGORIES.FAILURE, { response }),
};

export const MOST_POPULAR_BY_CATEGORY = createRequestTypes(
  "MOST_POPULAR_BY_CATEGORY"
);
export const mostPopularByCategory = {
  request: (categories) =>
    createAction(MOST_POPULAR_BY_CATEGORY.REQUEST, { categories }),
  success: (response, categories) =>
    createAction(MOST_POPULAR_BY_CATEGORY.SUCCESS, { response, categories }),
  failure: (response) =>
    createAction(MOST_POPULAR_BY_CATEGORY.FAILURE, response),
};

export const fetchMostPopularVideos = (
  amount,
  loadDescription,
  nextPageToken
) => {
  return (dispatch) => {
    dispatch(mostPopular.request());
    const config = api.buildMostPopularVideosRequest(
      amount,
      loadDescription,
      nextPageToken,
      null
    );
    axios
      .request(config)
      .then((response) => {
        dispatch(mostPopular.success(response.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(mostPopular.failure(err));
      });
  };
};

export const fetchVideoCategories = () => {
  return (dispatch) => {
    dispatch(categories.request());
    const config = api.buildVideoCategoriesRequest();
    axios
      .request(config)
      .then((response) => {
        dispatch(categories.success(response.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(categories.failure(err));
      });
  };
};

export const fetchMostPopularVideosByCategory = (categories) => {
  return (dispatch) => {
    dispatch(mostPopularByCategory.request(categories));
    const requests = categories.map((categoryId) => {
      return axios.request(
        api.buildMostPopularVideosRequest(12, false, null, categoryId)
      );
    });

    Promise.all(requests.map((p) => p.catch((e) => e)))
      .then((responses) => {
        dispatch(mostPopularByCategory.success(responses, categories));
      })
      .catch((err) => {
        console.log(err);
        dispatch(mostPopularByCategory.failure(err));
      });
  };
};
