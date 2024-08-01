import { combineReducers } from 'redux';
import home from './Home'
import books from './Book/Books'
import book from './Book/Book'
import members from './Members'
import wishlist from './Wishlist/Wishlist'
import list from './Wishlist/List'
import donelist from './Wishlist/Donelist'
import apilists from './Open/Lists'
import search from './Open/Search'
import favorite from './Favorite/Favorite';
import tournament from './Favorite/Tournament';
import ranking from './Favorite/Ranking';

const rootReducer = combineReducers({
  home,
  books,
  book,
  members,
  wishlist,
  list,
  donelist,
  apilists,
  search,
  favorite,
  tournament,
  ranking,
});

export default rootReducer;