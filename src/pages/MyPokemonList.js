import React, {useEffect, useContext} from 'react';

import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

import { useNavigate } from "react-router-dom";

//material-ui
import * as Mui from '@mui/material';
import * as Muicon from '@mui/icons-material';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

//global state
import { GlobalState } from '../App';

export default function MyPokemonList() {
  const globalState = useContext(GlobalState);
  const navigate = useNavigate();
  let [pokemons, setPokemons] = React.useState([]);
  let [isLoading, setIsLoading] = React.useState(true);

  const pokemonsApi = new ApolloClient({
    uri: 'https://graphql-pokeapi.graphcdn.app/',
    cache: new InMemoryCache(),    
  });

  const toDetail = (url) => {
    globalState.setPrevPageState('/my-list');
    navigate(`/detail/${url}`);
  }

  const getAllPokemonsData = async () => {
    let ownedPokemon = JSON.parse(localStorage.getItem('ownedPokemon')) || [];
    
    for(let [index, item] of ownedPokemon.entries()) {
      await pokemonsApi.query({
        query: gql`
        query pokemon {
          pokemon(name: "${item.name}") {
            id
            name
            sprites {
              front_default
            }
            moves {
              move {
                name
              }
            }
            types {
              type {
                name
              }
            }
          }
        }
        `
      })
      .then(res => {
        // console.log(res.data.pokemon)
        item["sprites"] = res.data.pokemon.sprites.front_default;
      })
    }

    setPokemons(ownedPokemon);
    setIsLoading(false);
  }

  const handleRemove = (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to remove this pokemon?')) {
      let afterRemove = pokemons.filter(item => item.id !== id);
      localStorage.setItem('ownedPokemon', JSON.stringify(afterRemove));
      setPokemons(afterRemove);
    }
  }

  useEffect(() => {
    getAllPokemonsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
      <>
        <h1>My Pokemon List</h1>
        {
          isLoading ? <Mui.CircularProgress style={{color: "#f44336"}} /> :
          <Mui.Grid container spacing={2} >
            {
              pokemons.map((item, index) => {
                return (
                  <Mui.Grid key={index} item xs={6} xl={2}>
                    <Mui.Paper 
                    onClick={() => toDetail(item.name)}
                    css={css`padding:2px; cursor:pointer; &:hover{background-color:#F5F5F5}`}>
                      <p>{capzFirst(item.name + ` (${item.nickname})`)}</p>
                      <img alt={item.name} src={item.sprites} />
                      <br />
                      {/* remove button */}
                      <Mui.IconButton onClick={(e) => handleRemove(e, item.id)}>
                        <Muicon.Close css={css`color:#f44336`} />
                      </Mui.IconButton>

                    </Mui.Paper>
                  </Mui.Grid>
                )
              })
            }
          </Mui.Grid>
        }
      </>
  )
}

const capzFirst = (string) => {
  //change "-" to space
  string = string.replace(/-/g, ' ');

  //capslock each word
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}