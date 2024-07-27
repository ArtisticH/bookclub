import { Route, Routes } from 'react-router-dom'
import Books from './Components/Books';
import Category from './Components/Cateory';
import Favorite from './Components/Favorite';
import Fun from './Components/Fun';
import Home from './Components/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/books" element={<Books />}/>
      <Route path="/fun" element={<Fun />}/>
      <Route path="/favorite" element={<Favorite />}/>
      <Route path="/favorite/:id/:round" element={<Category />}/>
    </Routes>
  );
}

export default App;
