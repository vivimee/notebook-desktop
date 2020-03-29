import * as React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import path from 'path';
import fse from 'fs-extra';
import Books from '../../components/Books';
import styles from './index.css';
import { setRepoAndInitData } from '../../actions/notebook';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes.json';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: {
        open: false,
        message: '',
        severity: 'info'
      },
      loading: {
        open: false
      }
    };
  }
  componentDidMount() {
    fse.ensureDirSync(path.resolve('.database'));
  }
  handleSanckbarClose = () => {
    const { snackbar } = this.state;
    this.setState({ snackbar: { ...snackbar, open: false } });
  };
  handleBackdropClose = () => {
    this.setState({ loading: { open: false } });
  };
  loadGithubRepo = () => {};
  onFetchClick = () => {
    const repo = document.querySelector('#repo').value.trim();
    const password = document.querySelector('#password').value.trim();
    const ghReopReg = /^https:\/\/github\.com\/([0-9a-zA-Z-_]+)+\/([0-9a-zA-Z-_]+)+\.git$/;
    if (!ghReopReg.test(repo)) {
      this.setState({
        snackbar: {
          open: true,
          message: '请输入合法的仓库地址',
          severity: 'error'
        }
      });
      return;
    }
    if (!password) {
      this.setState({
        snackbar: { open: true, message: '请输入密码', severity: 'error' }
      });
      return;
    }
    this.props.setRepoAndInitData(repo, password);
  };
  render() {
    const { snackbar, loading } = this.state;
    return (
      <div className={styles.dashboard}>
        <div className={styles.toolsbar}>
          <Link to={routes.LOGIN}>返回</Link>
          <input id="repo" placeholder="github仓库地址" />
          <input id="password" placeholder="密码" type="password" />
          <button onClick={this.onFetchClick}>拉取</button>
        </div>
        <Books />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={this.handleSanckbarClose}
        >
          <Alert
            severity={snackbar.severity}
            onClose={this.handleSanckbarClose}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Backdrop
          style={{ color: '#fff', zIndex: 2 }}
          open={loading.open}
          onClick={this.handleBackdropClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}

export default connect(state => ({ reduxState: state }), {
  setRepoAndInitData
})(Home);
