// @flow
import * as React from 'react';
import Header from './Header';
import Play from './Play';
import Question from './Question';
import Stats from './Stats';
import { TeamObject } from './utils';
import axios from 'axios';
import './App.css';


type State = { 
  team: Array<TeamObject>,
  right: number,
  wrong: number,
  play: boolean,
  complete: boolean
};

class App extends React.Component<null, State> {
  state = {
      team: [],
      right: 0,
      wrong: 0,
      play: false,
      complete: false
  }

  componentDidMount() {
    this.retrieveTeam.call(this);
  }

  clickToPlay() {
    this.setState({right: 0, wrong: 0, play: true});
  }

  clickToMatt() {
    this.setState(prev => 
      ({
        right: 0,
        wrong: 0,
        play: true,
        team: prev.team.filter(
          member => member.firstName.includes('Mat')
        )
      })
    );
  }

  async retrieveTeam() {
    try {
      let team = await axios.get('https://willowtreeapps.com/api/v1.0/profiles');
      team = team.data.filter(  // filter out everyone without a picture
        member => member.headshot && member.headshot.url
      );
      this.setState({ team });
    } catch (err) {
      console.log(err); // better error handling needed in future
    } 
  }

  addRight() {
    this.setState(prev => ({right: prev.right + 1}));
  }

  addWrong() {
    this.setState(prev => ({wrong: prev.wrong + 1}));
  }

  complete() {
    this.setState({play: false, complete: true});
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <div  // preload images
          style={{
            'visibility': 'hidden',
            'width': 0,
            'height': 0,
            'overflow': 'hidden'
          }}
        >
          {this.state.team.map(member => 
            <img
              src={member.headshot.url}
              key={`${member.firstName}${member.lastName}`}
            />
          )}
        </div>
        {this.state.complete ?
          <Stats
            right={this.state.right}
            wrong={this.state.wrong}
          />
          :
          null
        }
        {this.state.play ?
          (<div>
            <Question
              team={this.state.team}
              addRight={this.addRight.bind(this)}
              addWrong={this.addWrong.bind(this)}
              complete={this.complete.bind(this)}
            /> 
            <Stats 
              right={this.state.right}
              wrong={this.state.wrong}
            />
          </div>
          )
          :
          <Play
            clickToPlay={this.clickToPlay.bind(this)}
            clickToMatt={this.clickToMatt.bind(this)}
          />
        }
      </div>
    );
  }
}

export default App;