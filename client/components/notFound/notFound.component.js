import React from 'react';
import styles from './notFound.scss';

const NotFound = ({ location }) => (

// just a test comment

  <div className={styles.notFound}>
    <h1>Not found</h1>
    <p>No match for <code className="code">{location.pathname}</code></p>
  </div>
);

export default NotFound;
