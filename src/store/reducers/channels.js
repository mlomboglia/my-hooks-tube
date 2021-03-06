import { VIDEO_DETAILS, WATCH_DETAILS } from "../actions/watch";
import { SUCCESS } from "../actions";
import { CHANNEL_LIST_RESPONSE } from "../api/youtube-api-response-types";

const initialState = {
  byId: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case WATCH_DETAILS[SUCCESS]:
      return reduceWatchDetails(action.response, state);
    case VIDEO_DETAILS[SUCCESS]:
      return reduceVideoDetails(action.response, state);
    default:
      return state;
  }
};
export default reducer;

function reduceWatchDetails(responses, prevState) {
  const channelResponse = responses.find(
    (response) => response.data.kind === CHANNEL_LIST_RESPONSE
  );
  let channels = {};
  if (channelResponse && channelResponse.data.items) {
    // we know that there will only be one item
    // because we ask for a channel with a specific id
    const channel = channelResponse.data.items[0];
    channels[channel.id] = channel;
  }
  return {
    ...prevState,
    byId: {
      ...prevState.byId,
      ...channels,
    },
  };
}

function reduceVideoDetails(responses, prevState) {
  const channelResponse = responses.find(
    (response) => response.data.kind === CHANNEL_LIST_RESPONSE
  );
  let channelEntry = {};
  if (channelResponse && channelResponse.data.items) {
    // we're explicitly asking for a channel with a particular id
    // so the response set must either contain 0 items (if a channel with the specified id does not exist)
    // or at most one item (i.e. the channel we've been asking for)
    const channel = channelResponse.data.items[0];
    channelEntry = {
      [channel.id]: channel,
    };
  }

  return {
    ...prevState,
    byId: {
      ...prevState.byId,
      ...channelEntry,
    },
  };
}

export const getChannel = (state, channelId) => {
  if (!channelId) return null;
  return state.channels.byId[channelId];
};
