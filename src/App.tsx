import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './Components/Header';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies/latest/:id' element={<Home />} />
        <Route path='/movies/top/:id' element={<Home />} />
        <Route path='/movies/upcoming/:id' element={<Home />} />
        <Route path='/tv' element={<Tv />} />
        <Route path='/tv/latest/:id' element={<Tv />} />
        <Route path='/tv/airing/:id' element={<Tv />} />
        <Route path='/tv/popular/:id' element={<Tv />} />
        <Route path='/tv/top/:id' element={<Tv />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/:id' element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
