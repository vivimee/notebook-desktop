import * as React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import path from 'path';
import fse from 'fs-extra';
import Books from '../../components/Books';
import styles from './index.css';
import { pullRepository } from '../../actions/notebook';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes.json';
import { IconButton, Button } from '@material-ui/core';

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
    this.pullRepo();
  }
  handleSanckbarClose = () => {
    const { snackbar } = this.state;
    this.setState({ snackbar: { ...snackbar, open: false } });
  };
  handleBackdropClose = () => {
    this.setState({ loading: { open: false } });
  };
  pullRepo = () => {
    const { reduxState: { repository }, pullRepository } = this.props;
    pullRepository(repository);
  }

  render() {
    const { snackbar, loading } = this.state;
    return (
      <div className={styles.dashboard}>
        <div className={styles.toolsbar}>
          <Link to={routes.LOGIN}>
            <IconButton>
            <AccountCircleIcon />
            </IconButton>
            
          </Link>
          <IconButton onClick={this.pullRepo}>
            <CloudDownloadIcon />
          </IconButton>
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
  pullRepository
})(Home);
