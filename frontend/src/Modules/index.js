import { combineReducers } from 'redux';
import home from './Home'
import books from './Book/Books'
import book from './Book/Book'
import members from './Members'
import favorite from './Favorite/Favorite';
import tournament from './Favorite/Tournament';
import ranking from './Favorite/Ranking';

const rootReducer = combineReducers({
  home,
  books,
  book,
  members,
  favorite,
  tournament,
  ranking,
});

export default rootReducer;