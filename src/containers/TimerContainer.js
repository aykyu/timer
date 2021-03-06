import { connect } from 'react-redux';
import moment from 'moment';
import Timer from '../Components/TimerComponent/Timer';
import { stopTimer, startTimer, hideTimer } from '../actions';
import { getActiveTimer } from '../utils';


const mapStateToProps = (state, ownProps) => {
  let timer = state.timers.timersState.items.find(t => t.name === ownProps.name);
  timer = {
    ...timer,
    timeBlocks: timer.timeBlocks.filter(tb => (
      moment(tb.start).isSame(moment(state.date), 'day')
      || moment(tb.end).isSame(moment(state.date), 'day')
    ))
  };
  const activeTimer = getActiveTimer(state.timers.timersState.items);
  return {
    ...timer,
    activeTimer: activeTimer.name || '',
    date: state.date
  };
};

const mapDispatchToProps = dispatch => ({
  stopTimer: id => {
    dispatch(stopTimer(id));
  },
  startTimer: id => {
    dispatch(startTimer(id));
  },
  hideTimer: (id, date) => {
    dispatch(hideTimer(id, date));
  }
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(Timer);
