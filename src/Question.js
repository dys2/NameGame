// @flow
import * as React from 'react';
import { TeamObject } from './utils';


type Props = {
  team: Array<TeamObject>,
  complete: () => void,
  addWrong: () => void,
  addRight: () => void
};

type State = {
    currentOptions: Array<any>,
    chosen: number,
    used: Array<any>,
    wrong: boolean,
    frozen: boolean
};

export default class Question extends React.Component<Props, State> {
  state = {
      currentOptions: [{firstName: 'dummy', lastName: 'data'}],
      chosen: 0,
      used: [],
      wrong: false,
      frozen: false
  }

  images: ?HTMLElement;

  componentDidMount() {
    this.retrieveQuestionData.call(this);
    document.addEventListener("keydown", this.keyPressHandler.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyPressHandler.bind(this));
  }

  retrieveQuestionData() {
    const teamAmount = this.props.team.length;
    if (teamAmount > 0 && this.state.used.length === teamAmount)
      return this.props.complete();
    const currentOptions = [];
     // while must error check that there are still members available to add
     // built in a way to avoid extras
    while (currentOptions.length !== 5 &&
          teamAmount - this.state.used.length > currentOptions.length) { 
      const member = this.props.team[Math.floor(Math.random() * teamAmount)];
      // if not previously included or chosen
      if (!currentOptions.includes(member) && !this.state.used.includes(member))
        currentOptions.push(member);
    }
    const chosen = Math.floor(Math.random() * (currentOptions.length));
    this.setState((prev: State) => 
      ({
        currentOptions: currentOptions,
        chosen,
        used: [...prev.used, currentOptions[chosen]]
      })
    );
  }

  clickHandler(e: SyntheticMouseEvent<'click'> &
              { currentTarget: HTMLElement }) {
    // make sure one has not been selected already
    if (this.state.frozen) return;
    const element = e.currentTarget;
    this.handleSelection.call(this, element);
  }

  selectCorrect() {
    // make sure images element exists before proceeding
    if (!this.images) return;
    // $FlowFixMe
    const answer = this.images.children[`div${this.state.chosen.toString()}`];
    answer.className += " correct";
    for (let i = 0; i < this.state.currentOptions.length; i++) {
      if (i !== this.state.chosen && this.images)
        // $FlowFixMe
        this.images.children[`div${i.toString()}`].className += " hide";
    }
    // $FlowFixMe
    answer.children.hotkey.innerHTML = "";
    answer.className += " enlarge";
    // $FlowFixMe
    answer.children.memberImage.className += " enlarge";
    setTimeout(() => {
      for (let i = 0; i < this.state.currentOptions.length; i++) {
        // $FlowFixMe
        this.images.children[`div${i.toString()}`].className = "image-container";
      }
      this.retrieveQuestionData.call(this);
      this.setState({
        wrong: false,
        frozen: false
      });
    }, 3000);
  }

  keyPressHandler(e: KeyboardEvent) {
    if (this.state.frozen) return;
    if (parseInt(e.key) <= 5 && this.images) {
      const element = this.images.children[parseInt(e.key) - 1];
      this.handleSelection.call(this, element);
    }
  }

  handleSelection(element: HTMLElement) {
      this.setState({frozen: true});
      element.className += " selected";
      if (element.children.memberImage && element.children.memberImage.id == this.state.chosen) {
        this.selectCorrect.call(this);
        this.props.addRight();
        return;
      }
      this.props.addWrong();
      if (!element.children.wrongX) return;
      const wrongX = element.children.wrongX;
      // $FlowFixMe
      wrongX.className = "show wrong-image";
      element.className += " wrong";
      this.setState({wrong: true});
      setTimeout(() => {
        // $FlowFixMe
        wrongX.className = "hide";
        this.selectCorrect.call(this);
      }, 2000);
  }
  
  render() {
    return (
      <div>
        <h1>
          {`Who is ${this.state.currentOptions[this.state.chosen].firstName} 
          ${this.state.currentOptions[this.state.chosen].lastName}?`}
        </h1>
        <div className="images-container" ref={div => this.images = div}>
          {this.state.currentOptions.map((member, i) => 
            <div
              className="image-container"
              onClick={this.clickHandler.bind(this)}
              key={member.firstName + member.lastName}
              name={`div${i}`}
            >
            <img
              name="wrongX"
              className="hide"
              src="https://content.mycutegraphics.com/graphics/alphabet/red-alphabet-letter-x.png"
              alt="wrong"
            />
            <img 
              name="memberImage"
              className="image"
              id={i}
              src={member.headshot ? member.headshot.url : null}
              alt={`${member.firstName}`}
            />
            <p name="hotkey" className="hotkey-number">{i + 1}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}