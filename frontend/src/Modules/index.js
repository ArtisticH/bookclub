import { combineReducers } from 'redux';
import home from './Home'
import books from './Book/Books'
import book from './Book/Book'
import favorite from './Favorite/Favorite';
import tournament from './Favorite/Tournament';
import ranking from './Favorite/Ranking';

const rootReducer = combineReducers({
  home,
  books,
  book,
  favorite,
  tournament,
  ranking,
});

export default rootReducer;