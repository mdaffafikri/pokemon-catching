import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

import { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";

//material-ui
import * as Mui from '@mui/material';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

//global state
import { GlobalState } from '../App';

function PokemonList() {
  let [pokemonList, setPokemonList] = useState([]);
  const navigate = useNavigate();
  
  const pokemons = new ApolloClient({
    uri: 'https://graphql-pokeapi.graphcdn.app/',
    cache: new InMemoryCache(),    
  });

  const getPokemons = (limit, offset) => {    
    pokemons.query({
      query: gql`
        query pokemons {
          pokemons(limit: ${limit}, offset: ${offset}) {
            count
            next
            previous
            nextOffset
            prevOffset
            status
            message
            results {
              url
              name
              image
            }
          }
        }
      `
    })
    .then(res => {
      setPokemonList(res.data.pokemons.results);
    })
    .catch(error => {
      console.log(error);
    });
  }

  const globalState = useContext(GlobalState);

  const changePage = (page) => {
    getPokemons(pokemonPerPage, (page*12)-12);
    globalState.setPageState(page);
  }

  const toDetail = (url) => {
    navigate(`/detail/${url}`);
  }

  const pokemonPerPage = 12;
  const owned = {
    "bulbasaur": 12,
    "venusaur": 2,
  }

  useEffect(() => {    
    getPokemons(pokemonPerPage, (globalState.pageState*12)-12)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return (
      <>
        <h1>Pokemon List</h1>
        <Mui.Grid container spacing={2} >
        {          
          pokemonList.map((pokemon, index) => {
            return (
                <Mui.Grid key={index} item xs={6} xl={2}>
                  <Mui.Paper onClick={() => toDetail(pokemon.name)} css={css`padding:2px; cursor:pointer; &:hover{background-color:#F5F5F5}`}>
                    <p>{capzFirst(pokemon.name)}</p>
                    <img alt={pokemon.name} src={pokemon.image} />
                    <p>Owned: {owned[pokemon.name] || 0}</p>
                  </Mui.Paper>
                </Mui.Grid>
            )
          })
        }
        </Mui.Grid>

        {/* pagination */}
        <br />
        <Mui.Stack spacing={2}>
          <Mui.Pagination page={globalState.pageState} onChange={(e, page) => changePage(page)} count={75} />
        </Mui.Stack>
        
        {/* <button onClick={() => getPokemons(pokemonPerPage, page.previous)}>Previous</button>
        <button onClick={() => getPokemons(pokemonPerPage, page.next)}>Next</button> */}
      </>
  )
}

const capzFirst = (string) => {
  //change "-" to space
  string = string.replace(/-/g, ' ');

  //capslock each word
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default PokemonList;
