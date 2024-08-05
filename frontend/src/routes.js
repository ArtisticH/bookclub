import home from './Containers/HomeContainer'
import books from './Containers/Book/BooksContainer';
import book from './Containers/Book/BookContainer';
import members from './Containers/MembersContainer';
import wishlist from './Containers/Wishlist/WishlistContainer';
import list from './Containers/Wishlist/ListContainer';
import donelist from './Containers/Wishlist/DonelistContainer';
import open from './Components/Open/Open';
import lists from './Containers/Open/ListsContainer';
import search from './Containers/Open/SearchContainer';
import tournament from './Containers/Favorite/TournamentContainer';
import favorite from './Containers/Favorite/FavoriteContainer';
import ranking from './Containers/Favorite/RankingContainer';
import decoration from './Components/Deco';
import fun from './Components/Fun';

const routes = {
  container: {
    home,
    books,
    book,
    members,
    wishlist,
    list,
    donelist,
    lists,
    search,
    tournament,
    favorite,
    ranking
  },
  component: {
    open,
    decoration,
    fun,
  }
}

export default routes;