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
import * as Muicon from '@mui/icons-material';

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
      console.log(res.data.pokemon)
      setPokemon(res.data.pokemon);
    })
    .catch(error => {
      console.log(error);
    });
  }

  const navigate = useNavigate();  

  useEffect(() => {
    getPokemonDetail(window.location.pathname.split('/')[2]);
  }, []);
  
  return (
      <>
          <h1>Detail</h1>
        {
          !pokemon ? <Mui.CircularProgress /> :
          <>
            <Mui.Card>
              <Mui.CardHeader title={capzFirst(pokemon.name)} />
              <Mui.CardContent>
                <Mui.Grid justifyContent={"center"} container spacing={2}>

                  <Mui.Grid item xs={12} sm={3}>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <Mui.Typography variant="body2" color="textSecondary" component="p">
                      {pokemon.types.map(type => capzFirst(type.type.name)).join(', ')}
                    </Mui.Typography>
                  </Mui.Grid>

                  <Mui.Grid item xs={12} sm={3}>
                    <Mui.Typography variant="body2" color="textSecondary" component="p">
                      Moves: <br />
                      { 
                      pokemon.moves.length < 1 ? 'No moves' : 
                      pokemon.moves.slice(0, 4).map(move => capzFirst(move.move.name)).join(', ')
                      }
                    </Mui.Typography>

                    <br />
                    <Mui.IconButton onClick={() => navigate("/")} size="large">
                      <Muicon.ArrowBackIos css={css`color: #f44336;`} fontSize="large" />
                      <Mui.Typography variant="body2" color="textSecondary" component="p">Back</Mui.Typography>           
                    </Mui.IconButton> 
                    <Mui.IconButton size="large"  >
                      <Muicon.CatchingPokemon css={css`color: #f44336;`}  fontSize="large" /> 
                      <Mui.Typography variant="body2" color="textSecondary" component="p">Catch!</Mui.Typography>
                    </Mui.IconButton>
                  </Mui.Grid>

                </Mui.Grid>
              </Mui.CardContent>

            </Mui.Card>
            
            {/* <p>{capzFirst(pokemon.name)}</p> */}
          </>
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