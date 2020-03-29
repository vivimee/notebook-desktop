/* eslint-disable */

import {
  SET_REPO_INFO,
} from '../actions/repository';

const initialState = {
  workspace: null,
  repoUrl: null,
  repoName: null,
  userName: null,
  password: null,
};

export default function repository(state = initialState, action) {
  switch (action.type) {
    case SET_REPO_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
