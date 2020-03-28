import * as React from 'react';
import { connect } from 'react-redux';
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
    console.log(this.props);
  }
  componentDidUpdate() {
    console.log(this.props.reduxState);
  }
  render() {
    return (
      <div className={styles.dashboard}>
        <div className={styles.toolsbar}>tool-bar</div>
        <Books />
      </div>
    );
  }
}

export default connect((state) => ({ reduxState: state }))(Home);
