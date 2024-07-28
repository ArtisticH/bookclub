import { Route, Routes } from 'react-router-dom'
import Books from './Components/Books';
import TournamentContainer from './Containers/TournamentContainer';
import FavoriteContainer from './Containers/FavoriteContainer';
import Fun from './Components/Fun';
import Home from './Components/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/books" element={<Books />}/>
      <Route path="/fun" element={<Fun />}/>
      <Route path="/favorite" element={<FavoriteContainer />}/>
      <Route path="/favorite/:id/:round" element={<TournamentContainer />}/>
    </Routes>
  );
}

export default App;
