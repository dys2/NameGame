// @flow
import * as React from 'react';

type Props = {
  right: number,
  wrong: number
};

export default (props: Props) => (
  <div className="stats-container">
    <div className="stats-counter">
      <h1 className="stats-counter-title">Right</h1>
      <p>{props.right}</p>
    </div>
    <div className="stats-counter">
      <h1 className="stats-counter-title">Wrong</h1>
      <p>{props.wrong}</p>
    </div>
  </div>
);