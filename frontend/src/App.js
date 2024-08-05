import { Route, Routes } from 'react-router-dom'
import routes from './routes';

function App() {
  return (
    <Routes>
    <Route path="/" element={<routes.container.home />}/>
    <Route path="/books" element={<routes.container.books />}/>
    <Route path="/books/:id" element={<routes.container.book />}/>
    <Route path="/members" element={<routes.container.members />}/>
    <Route path="/wishlist/:id" element={<routes.container.wishlist />}/>
    <Route path="/list/:forderid/:memberid" element={<routes.container.list />}/>
    <Route path="/donelist/:memberid" element={<routes.container.donelist />}/>
    <Route path="/open" element={<routes.component.open />}/>
    <Route path="/open/search" element={<routes.container.search />}/>
    <Route path="/open/:type" element={<routes.container.lists />}/>
    <Route path="/fun" element={<routes.component.fun />}/>
    <Route path="/favorite" element={<routes.container.favorite />}/>
    <Route path="/favorite/:id/:round" element={<routes.container.tournament />}/>
    <Route path="/favorite/ranking/:id" element={<routes.container.ranking />}/>
    <Route path="/deco" element={<routes.component.decoration />}/>
  </Routes>
  );
}

export default App;
