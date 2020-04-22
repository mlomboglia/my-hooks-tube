/*
import { VIDEO_DETAILS, WATCH_DETAILS } from "../actions/watch";
import { SUCCESS } from "../actions";
import { createSelector } from "reselect";
import { getSearchParam } from "../../shared/url";
import {
  VIDEO_LIST_RESPONSE,
  SEARCH_LIST_RESPONSE,
} from "../api/youtube-api-response-types";

export const initialState = {
  byId: {},
  mostPopular: {},
  categories: {},
  byCategory: {},
  related: {},
};
export default function videos(state = initialState, action) {
  switch (action.type) {
    case WATCH_DETAILS[SUCCESS]:
      return reduceWatchDetails(action.response, state);
    case VIDEO_DETAILS[SUCCESS]:
      return reduceVideoDetails(action.response, state);
    default:
      return state;
  }
}

/*
function reduceFetchMostPopularVideosByCategory(
  responses,
  categories,
  prevState
) {
  let videoMap = {};
  let byCategoryMap = {};

  responses.forEach((response, index) => {
    // ignore answer if there was an error
    if (response.status === 400) return;

    const categoryId = categories[index];
    const { byId, byCategory } = groupVideosByIdAndCategory(response.result);
    videoMap = { ...videoMap, ...byId };
    byCategoryMap[categoryId] = byCategory;
  });

  // compute new state
  return {
    ...prevState,
    byId: { ...prevState.byId, ...videoMap },
    byCategory: { ...prevState.byCategory, ...byCategoryMap },
  };
}
*/





/*
function groupVideosByIdAndCategory(response) {
  const videos = response.items;
  const byId = {};
  const byCategory = {
    totalResults: response.pageInfo.totalResults,
    nextPageToken: response.nextPageToken,
    items: [],
  };

  videos.forEach((video) => {
    byId[video.id] = video;

    const items = byCategory.items;
    if (items && items) {
      items.push(video.id);
    } else {
      byCategory.items = [video.id];
    }
  });

  return { byId, byCategory };
}
*/

/*
 *   Selectors
 * */
/*
const getMostPopular = (state) => state.videos.mostPopular;
export const getMostPopularVideos = createSelector(
  (state) => state.videos.byId,
  getMostPopular,
  (videosById, mostPopular) => {
    if (!mostPopular || !mostPopular.items) {
      return [];
    }
    return mostPopular.items.map((videoId) => videosById[videoId]);
  }
);


export const getVideosByCategory = createSelector(
  (state) => state.videos.byCategory,
  (state) => state.videos.byId,
  (state) => state.videos.categories,
  (videosByCategory, videosById, categories) => {
    return Object.keys(videosByCategory || {}).reduce(
      (accumulator, categoryId) => {
        const videoIds = videosByCategory[categoryId].items;
        const categoryTitle = categories[categoryId];
        accumulator[categoryTitle] = videoIds.map(
          (videoId) => videosById[videoId]
        );
        return accumulator;
      },
      {}
    );
  }
);



export const videosByCategoryLoaded = createSelector(
  (state) => state.videos.byCategory,
  (videosByCategory) => {
    return Object.keys(videosByCategory || {}).length;
  }
);

export const getVideoById = (state, videoId) => {
  return state.videos.byId[videoId];
};
const getRelatedVideoIds = (state, videoId) => {
  const related = state.videos.related[videoId];
  return related ? related.items : [];
};
export const getRelatedVideos = createSelector(
  getRelatedVideoIds,
  state => state.videos.byId,
  (relatedVideoIds, videos) => {
    if (relatedVideoIds) {
      // filter kicks out null values we might have
      return relatedVideoIds.map(videoId => videos[videoId]).filter(video => video);
    }
    return [];
  });


export const getChannelId = (state, location, name) => {
  const videoId = getSearchParam(location, name);
  const video = state.videos.byId[videoId];
  if (video) {
    return video.snippet.channelId;
  }
  return null;
};

export const getAmountComments = createSelector(getVideoById, (video) => {
  if (video) {
    return video.statistics.commentCount;
  }
  return 0;
});

export const allMostPopularVideosLoaded = createSelector(
  [getMostPopular],
  (mostPopular) => {
    const amountFetchedItems = mostPopular.items ? mostPopular.items.length : 0;
    return amountFetchedItems === mostPopular.totalResults;
  }
);

export const getMostPopularVideosNextPageToken = createSelector(
  [getMostPopular],
  (mostPopular) => {
    return mostPopular.nextPageToken;
  }
);*/
