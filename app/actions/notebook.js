import SimpleGit from 'simple-git/promise';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import dayjs from 'dayjs';
import hash from 'hash-sum';
import throttle from 'lodash/throttle';

const ignoreFileReg = /^\./;

export const SET_BOOKS = 'SET_BOOKS';
export const SET_ACTIVE_BOOK = 'SET_ACTIVE_BOOK';
export const SET_ACTIVE_ARTICLE = 'SET_ACTIVE_ARTICLE';
export const UPDATE_ARTICLE_CONTENT = 'UPDATE_ARTICLE_CONTENT';
export const UPDATE_ARTICLE_MAP = 'UPDATE_ARTICLE_MAP';

async function gitSync(workspace) {
  const git = SimpleGit(workspace);
  await git.add('.');
  await git.commit(`update at ${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}`);
  await git.push();
  console.log('sync to github');
}

function getChildFilesSync(dirpath) {
  const files = fs.readdirSync(dirpath);
  const articles = files.filter((name) => !ignoreFileReg.test(name))
          .map((name) => ({ name, filepath: path.resolve(dirpath, name) }))
          .map(({ name, filepath }) => {
            const stat = fs.statSync(filepath);
            return stat.isFile() ? { 
              id: hash(name),
              name, 
              path: filepath, 
              size: stat.size, 
              ctime: dayjs(stat.ctime).unix(), 
              mtime: dayjs(stat.mtime).unix(),
            } : null;
          })
          .filter(Boolean);
  return articles;
}

const throttleGitSync = throttle(gitSync, 20 * 1000);
const updateArticleToFS = throttle(function(filepath, content) {
  console.log('write fs');
  fs.writeFileSync(filepath, content);
}, 10 * 1000)

export function setActiveBook(book) {
  return (dispathch, getState) => {
    const { notebook: { books } } = getState();
    const activeBookId = book.id;
    const article = books.filter((item) => item.id === activeBookId)[0].articles[0] || {};
    dispathch({ type: SET_ACTIVE_BOOK, payload: activeBookId });
    dispathch({ type: SET_ACTIVE_ARTICLE, payload: article.id });
  }
  return {
    type: SET_ACTIVE_BOOK,
    payload: book.id
  };
}

export function setActiveArticle(article) {
  return {
    type: SET_ACTIVE_ARTICLE,
    payload: article.id
  };
}

export function pullRepository({ repoUrl, userName, password, workspace } = {}) {
  console.log('pullRepository run');
  return async (dispatch) => {
    fse.ensureDirSync(workspace);
    const git = SimpleGit(workspace);
    try {
      await git.pull();
      console.log('pull success');
      const files = await new Promise((resolve, reject) => {
        fs.readdir(workspace, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      const books = files.filter((name) => !ignoreFileReg.test(name))
        .map((name) => ({ name, path: path.resolve(workspace, name) }))
        .map((item) => ({ ...item, stat: fs.statSync(item.path) }))
        .filter((item) => item.stat.isDirectory())
        .map((item, idx) => ({ 
          dirpath: item.path,
          name: item.name, 
          size: item.stat.size, 
          ctime: dayjs(item.stat.ctime).unix(), 
          mtime: dayjs(item.stat.mtime).unix(), 
          id: hash(`${item.name}`), 
          articles: [],
        }))
        .map((item) => {
          return {
            ...item,
            articles: getChildFilesSync(item.dirpath)
          }
          return item;
        })
        .sort((a, b) => b.mtime - a.mtime);
      dispatch({ type: SET_BOOKS, payload: books });
    } catch (e) {
      console.error(e);
    }
  };
}

export function createNewBook(name) {
  return async(dispatch, getState) => {
    const { notebook: { books }, repository: { workspace } } = getState();
    const dirpath = path.resolve(workspace, name);
    const exist = await fse.pathExists(dirpath);
    if (exist) {
      alert(`${name} 已经存在了`);
      return;
    }
    fse.ensureDirSync(dirpath);
    fse.ensureFileSync(path.resolve(dirpath, '.gitkeep'))
    books.push({name, id: books.length + 1, articles: []});
    dispatch({ type: SET_BOOKS, payload: books.slice() });
    gitSync(workspace);
  }
}

export function createNewArticle(name) {
  return async(dispatch, getState) => {
    const { notebook: { books, activeBookId }, repository: { workspace } } = getState();
    const activeBook = books.filter((item) => item.id === activeBookId)[0] || {};
    const filepath = path.resolve(workspace, activeBook.name, name);
    const exist = await fse.pathExists(filepath);
    if (exist) {
      alert(`${name} 已经存在了`);
      return;
    }
    fse.ensureFileSync(filepath);
    // TODO: 新建 article，需要更新 books, activeBook两个字段。
    const newArticle = { id: hash(name), name, ctime: dayjs().unix(), mtitme: dayjs().unix() };
    const newArticles = activeBook.articles.concat(newArticle);
    const newBook = {
      ...activeBook,
      articles: newArticles
    };
    const newBooks = books.map((item) => {
      if (item.id === activeBookId) {
        return newBook;
      }
      return item;
    });
    dispatch({type: SET_BOOKS, payload: newBooks});
    dispatch({type: SET_ACTIVE_ARTICLE, payload: newArticle.id});
    gitSync(workspace);
  }
}

export function updateArticleContent(articleId, content) {
  return (dispatch, getState) => {
    const { notebook: { articleMap, books, activeBookId }, repository: { workspace } } = getState();
    // TODO: 更新文件到fs
    const activeBook = books.filter((item) => item.id === activeBookId)[0];
    const activeArticle = activeBook.articles.filter((item) => item.id === articleId)[0];
    const filepath = path.resolve(workspace, activeBook.name, activeArticle.name);
    updateArticleToFS(filepath, content);
    throttleGitSync(workspace);
    const newmap = { ...articleMap, [articleId]: content };
    dispatch({ type: UPDATE_ARTICLE_CONTENT, payload: newmap });
  };
}

export function loadArticleFromFS(articleId) {
  return async(dispatch, getState) => {
    const { notebook: { articleMap, books, activeBookId, activeArticleId }, repository: { workspace } } = getState();
    if (articleMap[articleId]) {
      return;
    }
    const book = books.filter((item) => item.id === activeBookId)[0];
    if (!book) {
      return;
    }
    const article = book.articles.filter((item) => item.id === activeArticleId)[0];
    const filepath = path.resolve(workspace, book.name, article.name);
    fs.readFile(filepath, (err, data) => {
      if (err) {
        throw err;
      }
      const newmap = { ...articleMap, [articleId]: data.toString() };
      dispatch({ type: UPDATE_ARTICLE_CONTENT, payload: newmap });
    });
  }
}
