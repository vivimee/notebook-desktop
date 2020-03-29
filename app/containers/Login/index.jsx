import * as React from 'react';
import { connect } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Store from 'electron-store';

const store = new Store();
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch'
      }
    }
  })
);

const Login = () => {
  console.log(store.path);
  const classes = useStyles();
  const accounts = store.get('accounts') || [];
  const defaultAccount = accounts[0] || {};
  const [repoUrl, setRepoUrl] = React.useState(defaultAccount.repoUrl);
  const [password, setPassword] = React.useState(defaultAccount.password);

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
    if (accounts.every((item) => item.repoUrl !== repoUrl)) {
      accounts.push({ repoUrl, password });
      store.set('accounts', accounts);
      // clone仓库
    } else if (!accounts.filter((item) => item.repoUrl === repoUrl)[0].cloned) {
      // clone仓库
    }
  };

  return (
    <div>
      <form
        style={{ display: 'flex' }}
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
  
})(Login);
