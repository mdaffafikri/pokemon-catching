import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

import React from 'react';

import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

//material-ui
import * as Mui from '@mui/material';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export default function PokemonDetail() {


  let [pokemon, setPokemon] = React.useState();

  const pokemons = new ApolloClient({
    uri: 'https://graphql-pokeapi.graphcdn.app/',
    cache: new InMemoryCache(),    
  });

  const getPokemonDetail = (name) => {
    pokemons.query({
      query: gql`
      query pokemon {
        pokemon(name: "${name}") {
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
      setPokemon(res.data.pokemon);
    })
    .catch(error => {
      console.log(error);
    });
  }

  useEffect(() => {
    getPokemonDetail(window.location.pathname.split('/')[2]);
  }, []);
  
  return (
      <>
          <h1>Detail</h1>
        {
          !pokemon ? <Mui.CircularProgress /> :
          <>
            <p>{capzFirst(pokemon.name)}</p>
          </>
        }
      </>
  )
}


const capzFirst = (string) => string.charAt(0).toUpperCase() + string.slice(1);