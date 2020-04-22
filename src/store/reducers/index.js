import {combineReducers} from 'redux';
import channelsReducer from './channels';
import commentsReducer from './comments';
import searchReducer from './search';
import videosReducer from './videos';

export default combineReducers({
  channels: channelsReducer,
  comments: commentsReducer,
  search: searchReducer,
  videos: videosReducer
});