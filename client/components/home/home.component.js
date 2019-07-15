import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './home.scss';
import _ from 'lodash';


class Home extends React.Component {
  constructor(props) {
    super(props);

    // redirect to route on page reload using query params set on server response
    const redirect = _.last(_.compact(_.split(this.props.location.search, '=')));
    if (redirect) {
      this.props.history.push(redirect);
    }
  }

  render() {

    return (
      // this should be removed
      <div className={styles.home}>
        <h1>MC</h1>
        <FontAwesomeIcon icon={['fab', 'react']} />
      </div>
    );
  }
}


export default Home;
