import SimpleGit from 'simple-git/promise';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

export const SET_REPO_INFO = 'SET_REPO_INFO';
export const SET_ACTIVE_BOOK = 'SET_ACTIVE_BOOK';
export const SET_ACTIVE_ARTICLE = 'SET_ACTIVE_ARTICLE';
export const UPDATE_ARTICLE_CONTENT = 'UPDATE_ARTICLE_CONTENT';

export function setActiveBook(book) {
  return {
    type: SET_ACTIVE_BOOK,
    payload: book
  };
}

export function setActiveArticle(article) {
  return {
    type: SET_ACTIVE_ARTICLE,
    payload: article
  };
}

export function updateArticleContent(
  article,
  content,
  book
) {
  return {
    type: UPDATE_ARTICLE_CONTENT,
    payload: { article, content, book }
  };
}

window.fs = fs;

export function setRepoAndInitData(repoUrl, password) {
  return async (dispatch) => {
    console.log(repoUrl, password);
    const [_, userName, repoName] = repoUrl.match(
      /^https:\/\/github\.com\/([0-9a-zA-Z-_]+)+\/([0-9a-zA-Z-_]+)+\.git$/
    );
    const workspace = path.resolve('.database', userName, repoName);
    fse.ensureDirSync(workspace);
    const git = SimpleGit(workspace);
    git
      .clone(
        `https://${encodeURIComponent(userName)}:${encodeURIComponent(
          password
        )}@github.com/${userName}/${repoName}.git`,
        workspace
      )
      .catch(e => {
        console.error('clone error', e);
      })
      .finally(() => git.pull())
      .then(() => {
        console.log('pull done');
      })
      .catch(e => {
        console.error('pull error', e);
      })
      .finally(() => new Promise((resolve, reject) => {
        console.log('dir', workspace);
        fs.readdir(workspace, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      })).then((data) => {
        console.log(data);
      }).catch((e) => {
        console.error('read dir error', e);
      });

    // git.clone(
    //   `https://${encodeURIComponent(userName)}:${encodeURIComponent(
    //     password
    //   )}@github.com/${userName}/${repoName}.git`,
    //   workspace,
    //   (err: string, res: any) => {
    //     if (err) {
    //       if (/already exists and is not an empty/.test(err)) {
    //         git.pull((errr: string) => {
    //           if (errr) {
    //             console.error(errr);
    //           } else {
    //             console.log('pull done');
    //           }
    //         })
    //       } else {
    //         console.error(err)
    //       }
    //     } else {
    //       console.log('clone done');
    //     }
    //   }
    // );
  };
}

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}
