import * as React from 'react';
import { connect } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Store from 'electron-store';
import SimpleGit from 'simple-git/promise';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import routes from '../../constants/routes.json';
import { setRepoInfo } from '../../actions/repository';

const store = new Store();
const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch'
      }
    }
  })
);

const Login = props => {
  console.log(store.path);
  const classes = useStyles();
  const accounts = store.get('accounts') || [];
  const defaultAccount = accounts[0] || {};
  const [repoUrl, setRepoUrl] = React.useState(defaultAccount.repoUrl);
  const [password, setPassword] = React.useState(defaultAccount.password);

  const handleRepoCloneDone = () => {
    console.log('repo clone done');
    const { history, setRepoInfo } = props;
    const [, userName, repoName] = repoUrl.match(
      /^https:\/\/github\.com\/([0-9a-zA-Z-_]+)+\/([0-9a-zA-Z-_]+)+\.git$/
    );
    const workspace = path.resolve(
      store.path.replace('/config.json', ''),
      '.database',
      userName,
      repoName
    );
    setRepoInfo({ repoUrl, userName, repoName, password, workspace });
    history.push(routes.DASHBOARD);
  };

  const clone = (repoUrl, password) => {
    const [, userName, repoName] = repoUrl.match(
      /^https:\/\/github\.com\/([0-9a-zA-Z-_]+)+\/([0-9a-zA-Z-_]+)+\.git$/
    );
    const workspace = path.resolve(
      store.path.replace('/config.json', ''),
      '.database',
      userName,
      repoName
    );
    console.log(workspace);
    fse.ensureDirSync(workspace);
    const git = SimpleGit(workspace);
    git
      .clone(
        `https://${encodeURIComponent(userName)}:${encodeURIComponent(
          password
        )}@github.com/${userName}/${repoName}.git`,
        workspace
      )
      .then(() => {
        const accounts = store.get('accounts').map(item => {
          if (item.repoUrl !== repoUrl) {
            return item;
          }
          return {
            ...item,
            cloned: true
          };
        });
        store.set('accounts', accounts);
        handleRepoCloneDone();
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handleSubmit = () => {
    console.log(repoUrl, password);
    const ghReopReg = /^https:\/\/github\.com\/([0-9a-zA-Z-_]+)+\/([0-9a-zA-Z-_]+)+\.git$/;
    if (!ghReopReg.test(repoUrl)) {
      alert('请输入合法的仓库地址');
      return;
    }
    if (!password) {
      alert('请输入登录密码');
      return;
    }
    if (accounts.every(item => item.repoUrl !== repoUrl)) {
      accounts.push({ repoUrl, password });
      store.set('accounts', accounts);
      // clone仓库
      clone(repoUrl, password);
    } else if (!accounts.filter(item => item.repoUrl === repoUrl)[0].cloned) {
      // clone仓库
      clone(repoUrl, password);
    } else {
      handleRepoCloneDone();
    }
  };

  return (
    <div>
      <form
        style={{ display: 'flex', margin: '200px 50px' }}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <TextField
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
          size="small"
          label="仓库地址"
          variant="outlined"
        />
        <TextField
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
          size="small"
          label="登录密码"
          variant="outlined"
        />
        <Button variant="outlined" color="primary" onClick={handleSubmit}>
          提交
        </Button>
      </form>
    </div>
  );
};

export default connect(() => ({}), {
  setRepoInfo
})(Login);
