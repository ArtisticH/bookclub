import { combineReducers } from 'redux';
import home from './Home'
import favorite from './Favorite/Favorite';
import tournament from './Favorite/Tournament';
import ranking from './Favorite/Ranking';

const rootReducer = combineReducers({
  home,
  favorite,
  tournament,
  ranking,
});

export default rootReducer;