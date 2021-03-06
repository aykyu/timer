import React, {Component} from 'react';
import moment from 'moment';
import { Button, Icon, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import TimeBlockContainer from '../../containers/TimeBlockContainer';
import './Timer.css';

class Timer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      refreshClock: true,
      hideTimerIcon: false
    };
    this.sumTimers = this.sumTimers.bind(this);
    this.isStartTimerDisabled = this.isStartTimerDisabled.bind(this);
    this.isStopTimerDisabled = this.isStopTimerDisabled.bind(this);
    this.isTimerActive = this.isTimerActive.bind(this);
    this.showHidetimerIcon = this.showHidetimerIcon.bind(this);
    this.hideHidetimerIcon = this.hideHidetimerIcon.bind(this);
  }

  tick() {
    this.setState({refreshClock: !this.state.refreshClock});
  }

  formatTimeForSeconds(seconds) {
    let hours = parseInt(seconds/3600);
    hours = hours.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    seconds = seconds%3600;
    
    let minutes = parseInt(seconds/60);
    minutes = minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    seconds = seconds%60;
    
    seconds = seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

    let timeString = `${hours}:${minutes}:${seconds}`;
    return timeString;
  }

  sumTimers() {
    let seconds = this.props.timeBlocks.reduce( (acc, curr) => {
      return moment(curr.end).diff(moment(curr.start), 'seconds') + acc;
    }, 0);
    return this.formatTimeForSeconds(seconds);
  }

  isStartTimerDisabled() {
    return this.props.name===this.props.activeTimer 
      || !moment().isSame(moment(this.props.date), 'day');
  }

  isStopTimerDisabled() {
    return this.props.name!==this.props.activeTimer 
      || !moment().isSame(moment(this.props.date), 'day');
  }

  isTimerActive() {
    return this.isStartTimerDisabled() && !this.isStopTimerDisabled();
  }

  showHidetimerIcon() {
    this.setState({hideTimerIcon: true});
  }

  hideHidetimerIcon() {
    this.setState({hideTimerIcon: false});
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(), 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    let id = this.props.id;
    let name = this.props.name;
    let date = this.props.date;
    let timeBlocks;
    if(this.props.timeBlocks !== undefined) {
      timeBlocks = <div>{this.props.timeBlocks.map( (tb) => {
        return (
          <TimeBlockContainer 
            key={tb.id}
            {...tb}
          ></TimeBlockContainer>
        );
      })}</div>;
    } else {
      timeBlocks = <div />;
    }
    return (
      <Grid.Row>
        <Grid.Column width={5}>
          <div 
            onMouseEnter={this.showHidetimerIcon}
            onMouseLeave={this.hideHidetimerIcon}
          >
            {this.state.hideTimerIcon ?
              <Icon 
                name='hide' 
                styleName='Timer-HideIcon'
                onClick={() => this.props.hideTimer(id, date)}
              /> : '' }
            <span 
              styleName={this.isTimerActive() ? 
                'Timer-Text Timer-Text--active' 
                :'Timer-Text'}
            >
              {name}
            </span>
          </div>
        </Grid.Column>
        <Grid.Column width={4}>
          <span styleName={this.isTimerActive() ? 'Timer-Sumtime--active': ''}>
            {this.sumTimers()}
          </span>
        </Grid.Column>
        <Grid.Column width={7} 
          textAlign='right'
        >
          <div styleName='Timer-Buttons'>
            <Button.Group size='mini' styleName=''>
              <Button
                disabled={this.isStartTimerDisabled()}
                color='green' 
                onClick={() => this.props.startTimer(id)}>
                  start
              </Button>
              <Button 
                disabled={this.isStopTimerDisabled()} 
                color='red' 
                onClick={()=>{
                  this.props.stopTimer(id);
                }}>
                stop
              </Button>
            </Button.Group>
          </div>
        </Grid.Column>
        <Grid.Column width={10} textAlign='center'>
          {timeBlocks}
        </Grid.Column>
      </Grid.Row>
    );
  }
}
Timer.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  timeBlocks: PropTypes.array,
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  activeTimer: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  hideTimer: PropTypes.func.isRequired
};
export default Timer;