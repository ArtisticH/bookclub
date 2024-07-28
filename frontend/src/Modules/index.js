import { combineReducers } from 'redux';
import favorite from './Favorite';
import tournament from './Tournament';

const rootReducer = combineReducers({
  favorite,
  tournament
});

export default rootReducer;