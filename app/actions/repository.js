
export const SET_REPO_INFO = 'SET_REPO_INFO';

export function setRepoInfo(infoObj) {
  return {
    type: SET_REPO_INFO,
    payload: infoObj,
  }
}
