import { Route, Routes } from 'react-router-dom'
import Books from './Components/Book/Books';
import TournamentContainer from './Containers/Favorite/TournamentContainer';
import FavoriteContainer from './Containers/Favorite/FavoriteContainer';
import RankingContainer from './Containers/Favorite/RankingContainer';
import Quotes from './Components/Quotes';
import Fun from './Components/Fun';
import HomeContainer from './Containers/HomeContainer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeContainer />}/>
      <Route path="/books" element={<Books />}/>
      <Route path="/fun" element={<Fun />}/>
      <Route path="/favorite" element={<FavoriteContainer />}/>
      <Route path="/favorite/:id/:round" element={<TournamentContainer />}/>
      <Route path="/favorite/ranking/:id" element={<RankingContainer />}/>
      <Route path="/quotes" element={<Quotes />}/>
    </Routes>
  );
}

export default App;
