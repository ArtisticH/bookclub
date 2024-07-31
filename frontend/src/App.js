import { Route, Routes } from 'react-router-dom'
import HomeContainer from './Containers/HomeContainer';
import BooksContainer from './Containers/Book/BooksContainer';
import BookContainer from './Containers/Book/BookContainer';
import MembersContainer from './Containers/MembersContainer';
import TournamentContainer from './Containers/Favorite/TournamentContainer';
import FavoriteContainer from './Containers/Favorite/FavoriteContainer';
import RankingContainer from './Containers/Favorite/RankingContainer';
import Quotes from './Components/Quotes';
import Fun from './Components/Fun';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeContainer />}/>
      <Route path="/books" element={<BooksContainer />}/>
      <Route path="/books/:id" element={<BookContainer />}/>
      <Route path="/members" element={<MembersContainer />}/>
      <Route path="/fun" element={<Fun />}/>
      <Route path="/favorite" element={<FavoriteContainer />}/>
      <Route path="/favorite/:id/:round" element={<TournamentContainer />}/>
      <Route path="/favorite/ranking/:id" element={<RankingContainer />}/>
      <Route path="/quotes" element={<Quotes />}/>
    </Routes>
  );
}

export default App;
