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

import {useState, createContext} from 'react'

export const GlobalState = createContext()

function App() {
  const [pageState, setPageState] = useState(1)
  const [prevPageState, setPrevPageState] = useState('') //for back button

  return (
    <div className="App">
        <Router>
          <GlobalState.Provider value={{pageState, setPageState, prevPageState, setPrevPageState}}>
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
          </GlobalState.Provider>
        </Router>

    </div>
  );
}

export default App;
