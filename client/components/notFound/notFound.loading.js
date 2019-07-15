import React from 'react';

function LoadingNotFound(props) {

  if (props.error) {
    return (
      <div>Error! <button onClick={ props.retry }>Retry</button></div>
    );
  }

  if (props.timedOut) {
    return (
      <div>Taking a long time... <button onClick={ props.retry }>Retry</button></div>
    );
  }

  if (props.pastDelay) {
    return (
      <div>Loading...</div>
    );
  }

  return null;
}

export default LoadingNotFound;
