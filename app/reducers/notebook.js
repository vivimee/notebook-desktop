/* eslint-disable */

import { Action } from 'redux';
import {
  SET_ACTIVE_BOOK,
  SET_ACTIVE_ARTICLE,
  UPDATE_ARTICLE_CONTENT,
  SET_BOOKS,
} from '../actions/notebook';

const initialState = {
  books: [],
  activeBookId: null,
  activeArticleId: null,
  articleMap: {},
};

export default function notebook(state = initialState, action) {
  switch (action.type) {
    case SET_BOOKS:
      return {
        ...state,
        books: action.payload,
      };
    case SET_ACTIVE_BOOK:
      return {
        ...state,
        activeBookId: action.payload
      };
    case SET_ACTIVE_ARTICLE:
      return {
        ...state,
        activeArticleId: action.payload
      };
    case UPDATE_ARTICLE_CONTENT:
      const articleMap = action.payload;
      return {
        ...state,
        articleMap
      }
    default:
      return state;
  }
}
