import { GetState, Dispatch } from '../reducers/types';
import { Book, Article } from '../models/types';

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

export const SET_ACTIVE_BOOK = 'SET_ACTIVE_BOOK';
export const SET_ACTIVE_ARTICLE = 'SET_ACTIVE_ARTICLE';
export const UPDATE_ARTICLE_CONTENT = 'UPDATE_ARTICLE_CONTENT';

export function setActiveBook(book: Book) {
  return {
    type: SET_ACTIVE_BOOK,
    payload: book,
  };
}

export function setActiveArticle(article: Article) {
  return {
    type: SET_ACTIVE_ARTICLE,
    payload: article
  }
}

export function updateArticleContent(article: Article, content: string, book: Book) {
  return {
    type: UPDATE_ARTICLE_CONTENT,
    payload: { article, content, book }
  }
}


export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}
