// @flow
import * as React from 'react';


type Props = {
  clickToPlay: Event => void,
  clickToMatt: Event => void
};


export default class Play extends React.Component<Props> {
  componentDidMount() {
    setTimeout(() => {
      if (this.playContainer) 
        this.playContainer.className = "play-container";
    }, 1000);
  }

  playContainer: ?HTMLElement;

  render() {
    return (
      <div
        className="play-container-hide"
        ref={div => (this.playContainer = div)}
      >
        <p>What would you like to play?</p>
        <button
          className="play-btn"
          onClick={this.props.clickToPlay}
        >
          Normal
        </button>
        <button
          className="play-btn"
          onClick={this.props.clickToMatt}
        >
          Mat(t) Attack
        </button>
      </div>
    );
  }
}
