import {
  MOST_POPULAR,
  VIDEO_CATEGORIES,
  MOST_POPULAR_BY_CATEGORY,
} from "../actions/videos";
import { SUCCESS } from "../actions";
import { createSelector } from "reselect";
import {
  VIDEO_LIST_RESPONSE,
  SEARCH_LIST_RESPONSE,
} from "../api/youtube-api-response-types";
import { VIDEO_DETAILS, WATCH_DETAILS } from "../actions/watch";
import { getSearchParam } from "../../shared/url";

const initialState = {
  byId: {},
  mostPopular: {},
  categories: {},
  byCategory: {},
  related: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MOST_POPULAR[SUCCESS]:
      return reduceFetchMostPopularVideos(action.videos, state);
    case VIDEO_CATEGORIES[SUCCESS]:
      return reduceFetchVideoCategories(action.response, state);
    case MOST_POPULAR_BY_CATEGORY[SUCCESS]:
      return reduceFetchMostPopularVideosByCategory(
        action.response,
        action.categories,
        state
      );
    case WATCH_DETAILS[SUCCESS]:
      return reduceWatchDetails(action.response, state);
    case VIDEO_DETAILS[SUCCESS]:
      return reduceVideoDetails(action.response, state);
    default:
      return state;
  }
};
export default reducer;

function reduceFetchMostPopularVideos(response, prevState) {
  const videoMap = response.items.reduce((accumulator, video) => {
    accumulator[video.id] = video;
    return accumulator;
  }, {});

  let items = Object.keys(videoMap);
  if (response.hasOwnProperty("prevPageToken") && prevState.mostPopular) {
    items = [...prevState.mostPopular.items, ...items];
  }

  const mostPopular = {
    totalResults: response.pageInfo.totalResults,
    nextPageToken: response.nextPageToken,
    items,
  };

  return {
    ...prevState,
    mostPopular,
    byId: { ...prevState.byId, ...videoMap },
  };
}

function reduceFetchVideoCategories(response, prevState) {
  const categoryMapping = response.items.reduce((accumulator, category) => {
    accumulator[category.id] = category.snippet.title;
    return accumulator;
  }, {});
  return {
    ...prevState,
    categories: categoryMapping,
  };
}

function reduceFetchMostPopularVideosByCategory(
  responses,
  categories,
  prevState
) {
  let videoMap = {};
  let byCategoryMap = {};

  console.log("reduceFetchMostPopularVideosByCategory");
  responses.forEach((response, index) => {
    // ignore answer if there was an error
    if (response instanceof Error) return;

    const categoryId = categories[index];
    const { byId, byCategory } = groupVideosByIdAndCategory(response.data);
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

function reduceWatchDetails(responses, prevState) {
  console.log(responses);
  const videoDetailResponse = responses.find(
    (r) => r.data.kind === VIDEO_LIST_RESPONSE
  );
  // we know that items will only have one element
  // because we explicitly asked for a video with a specific id
  const video = videoDetailResponse.data.items[0];
  const relatedEntry = reduceRelatedVideosRequest(responses);

  return {
    ...prevState,
    byId: {
      ...prevState.byId,
      [video.id]: video,
    },
    related: {
      ...prevState.related,
      [video.id]: relatedEntry,
    },
  };
}

function reduceRelatedVideosRequest(responses) {
  const relatedVideosResponse = responses.find(
    (r) => r.data.kind === SEARCH_LIST_RESPONSE
  );
  const { pageInfo, items, nextPageToken } = relatedVideosResponse.data;
  const relatedVideoIds = items.map((video) => video.id);

  return {
    totalResults: pageInfo.totalResults,
    nextPageToken,
    items: relatedVideoIds,
  };
}

function reduceVideoDetails(responses, prevState) {
  const videoResponses = responses.filter(
    (response) => response.data.kind === VIDEO_LIST_RESPONSE
  );
  const parsedVideos = videoResponses.reduce((videoMap, response) => {
    // we're explicitly asking for a video with a particular id
    // so the response set must either contain 0 items (if a video with the id does not exist)
    // or at most one item (i.e. the channel we've been asking for)
    const video = response.data.items ? response.data.items[0] : null;
    if (!video) {
      return videoMap;
    }
    videoMap[video.id] = video;
    return videoMap;
  }, {});

  return {
    ...prevState,
    byId: { ...prevState.byId, ...parsedVideos },
  };
}

/**
 * Selectors
 */
export const getVideoCategoryIds = createSelector(
  (state) => state.videos.categories,
  (categories) => {
    return Object.keys(categories || {});
  }
);

export const videoCategoriesLoaded = createSelector(
  (state) => state.videos.categories,
  (categories) => {
    return Object.keys(categories || {}).length !== 0;
  }
);

export const videosByCategoryLoaded = createSelector(
  (state) => state.videos.byCategory,
  (videosByCategory) => {
    return Object.keys(videosByCategory || {}).length;
  }
);

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

export const getVideoById = (state, videoId) => {
  return state.videos.byId[videoId];
};
const getRelatedVideoIds = (state, videoId) => {
  const related = state.videos.related[videoId];
  return related ? related.items : [];
};
export const getRelatedVideos = createSelector(
  getRelatedVideoIds,
  (state) => state.videos.byId,
  (relatedVideoIds, videos) => {
    if (relatedVideoIds) {
      // filter kicks out null values we might have
      return relatedVideoIds
        .map((videoId) => videos[videoId])
        .filter((video) => video);
    }
    return [];
  }
);

export const getAmountComments = createSelector(getVideoById, (video) => {
  if (video) {
    return video.statistics.commentCount;
  }
  return 0;
});

export const getChannelId = (state, location, name) => {
  const videoId = getSearchParam(location, name);
  const video = state.videos.byId[videoId];
  if (video) {
    return video.snippet.channelId;
  }
  return null;
};
