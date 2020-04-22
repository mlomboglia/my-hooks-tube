import { fork, take, all, put, call } from "redux-saga/effects";
import * as watchActions from "../actions/watch";
import { REQUEST } from "../actions";
import {
  buildVideoDetailRequest,
  buildRelatedVideosRequest,
  buildChannelRequest,
  buildCommentThreadRequest
} from "../api/youtube-api";

import {SEARCH_LIST_RESPONSE, VIDEO_LIST_RESPONSE} from '../api/youtube-api-response-types';

export function* watchWatchDetails() {
  while (true) {
    const { videoId } = yield take(watchActions.WATCH_DETAILS[REQUEST]);
    yield fork(fetchWatchDetails, videoId);
  }
}


