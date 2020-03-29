/* eslint-disable */

import { Action } from 'redux';
import {
  SET_ACTIVE_BOOK,
  SET_ACTIVE_ARTICLE,
  UPDATE_ARTICLE_CONTENT
} from '../actions/notebook';

const mockBooks = [
  {
    id: 1,
    name: '工作',
    articles: [
      { id: 1, title: 'title-1', content: 'abcdefg' },
      { id: 101, title: 'title-2', content: 'fkdjsal' }
    ]
  },
  {
    id: 2,
    name: '生活',
    articles: [{ id: 2, title: 'title-2', content: '234567' }]
  },
  {
    id: 3,
    name: '学习',
    articles: [{ id: 3, title: 'title-3', content: '!@##$$%' }]
  }
];

const initialState = {
  books: mockBooks,
  activeBook: null,
  activeArticle: null
};

export default function notebook(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_BOOK:
      const newbook = action.payload;
      return {
        ...state,
        activeBook: newbook,
        activeArticle: newbook.articles[0]
      };
    case SET_ACTIVE_ARTICLE:
      return {
        ...state,
        activeArticle: action.payload
      };
    case UPDATE_ARTICLE_CONTENT:
      const { article, content, book } = action.payload;
      const newArticle = {
        ...article,
        content
      };
      const newBook = {
        ...book,
        articles: book.articles.map((art) => {
          if (art.id === article.id) {
            return newArticle;
          }
          return art;
        })
      };
      const newBooks = state.books.map((bok) => {
        if (bok.id === book.id) return newBook;
        return bok;
      });
      return {
        ...state,
        books: newBooks,
        activeBook: newBook,
        activeArticle: newArticle
      };
    default:
      return state;
  }
}
