import * as React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import path from 'path';
import fse from 'fs-extra';
import Books from '../../components/Books';
import styles from './index.css';

export interface HomeProps {}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = { name: 'pmm' };
  }
  componentDidMount() {
    fse.ensureDirSync(path.resolve('.database'));
  }
  loadGithubRepo = () => {};
  onFetchClick = () => {
    const repo = document.querySelector('#repo').value.trim();
    const password = document.querySelector('#password').value.trim();
    // https://github.com/vivimee/notebook-database.git
    if (!/^https:\/\/github\.com\//.test(repo)) {
      alert('仓库地址不合法');
      return;
    }
    if (!password) {
      alert('请输入密码');
      return;
    }
  };
  render() {
    return (
      <div className={styles.dashboard}>
        <div className={styles.toolsbar}>
          <input id="repo" placeholder="github仓库地址" />
          <input id="password" placeholder="密码" type="password" />
          <button onClick={this.onFetchClick}>拉取</button>
        </div>
        <Books />
        <Snackbar open={false} autoHideDuration={6000} message="halo" />
      </div>
    );
  }
}

export default connect(state => ({ reduxState: state }))(Home);
