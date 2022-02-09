import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

//material-ui
import * as Mui from '@mui/material';

//layouts
import Header from './layouts/Header';
import Navigation from './layouts/Navigation';

//pages
import PokemonList from './pages/PokemonList'
import PokemonDetail from './pages/PokemonDetail';
import MyPokemonList from './pages/MyPokemonList';

function App() {
  return (
    <div className="App">
        <Router>
          <Header />
          <br /><br /><br />          
          <Mui.Container maxWidth="xl">
            <Routes>
              <Route exact path="/" element={<PokemonList/>}/>
              <Route exact path="/detail/:url" element={<PokemonDetail/>}/>
              <Route exact path="/my-list" element={<MyPokemonList/>}/>
            </Routes>
          </Mui.Container>
          <br /><br /><br /><br />
          <Navigation />
        </Router>

    </div>
  );
}

export default App;
