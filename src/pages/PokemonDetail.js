import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

import React from 'react';

import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

//material-ui
import * as Mui from '@mui/material';
import * as Muicon from '@mui/icons-material';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export default function PokemonDetail() {

  let [pokemon, setPokemon] = React.useState();
  let [isCatching, setIsCatching] = React.useState({
    popUp: false,
    isCatching: false,
    isCaught: false,
  });
  let [nickname, setNickname] = React.useState('');

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
      // console.log(res.data.pokemon)
      setPokemon(res.data.pokemon);
    })
    .catch(error => {
      console.log(error);
    });
  }

  const navigate = useNavigate();  

  const handleCatch = () => {
    setNickname('');
    setIsCatching({
      ...isCatching,
      popUp: true,
      isCatching: true,
    })
    
    setTimeout(() => {
      setIsCatching({
        popUp: true,
        isCatching: false,
        isCaught: Math.random() > 0.5,
      })
    }, 2000);
  }

  const handleSave = () => {
    let input = {
      id: Math.random(),
      name: pokemon.name,
      nickname: nickname || capzFirst(pokemon.name),
    }

    if(localStorage.getItem('ownedPokemon') === null) {
      localStorage.setItem('ownedPokemon', 
        JSON.stringify([input])        
      );
    } else {
      localStorage.setItem('ownedPokemon',
        JSON.stringify(
          [ 
            ...JSON.parse(localStorage.getItem('ownedPokemon')),
            input
          ]
        )
      );
    }

    // console.log(
    //   {
    //   id: Math.random(),
    //   name: pokemon.name,
    //   nickname: nickname || capzFirst(pokemon.name),
    //   }
    // )

    closeModal();
  }

  const closeModal = () => {
      setIsCatching({
        popUp: false,
        isCatching: false,
        isCaught: false,
      })
  };

  useEffect(() => {
    getPokemonDetail(window.location.pathname.split('/')[2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
      <>
          <h1>Detail</h1>
        {
          !pokemon ? <Mui.CircularProgress style={{color: "#f44336"}} /> :
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
                    <Mui.IconButton onClick={() => handleCatch()} size="large"  >
                      <Muicon.CatchingPokemon css={css`color: #f44336;`}  fontSize="large" /> 
                      <Mui.Typography variant="body2" color="textSecondary" component="p">Catch!</Mui.Typography>
                    </Mui.IconButton>
                  </Mui.Grid>

                </Mui.Grid>
              </Mui.CardContent>

            </Mui.Card>
            
            {/* modal */}
            <Mui.Modal
              style={{display:'flex',alignItems:'center',justifyContent:'center'}}
              open={isCatching.popUp}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              {
                isCatching.isCatching ?
                <Mui.Card css={css`text-align: center;`}>
                  <Mui.CardHeader title="Catching Pokemon..." />
                  <Mui.CardContent>
                    <Mui.CircularProgress style={{color: "#f44336"}} />
                  </Mui.CardContent>
                </Mui.Card>
                :
                isCatching.isCaught ?
                <Mui.Card css={css`text-align: center;`}>
                  <Mui.CardHeader title={`Gotcha! ${capzFirst(pokemon.name)} was caught!`} />
                  <Mui.CardContent>
                    <Mui.FormControl>
                      <Mui.InputLabel htmlFor="nickname">Nickname</Mui.InputLabel>
                      <Mui.Input onChange={(e) => setNickname(e.target.value)} id="nickname" aria-describedby="my-helper-text" />
                    </Mui.FormControl>
                    {/* save button icon */}
                    <Mui.IconButton size="small" onClick={() => handleSave()}>
                      <Muicon.Save css={css`color: #f44336;`} fontSize="large" />
                    </Mui.IconButton>
                  </Mui.CardContent>
                </Mui.Card>
                :
                <Mui.Card css={css`text-align: center;`}>
                  <Mui.CardHeader title={`Catching failed!`} />
                  <Mui.CardContent>
                    {/* close btn */}
                    <Mui.IconButton onClick={() => closeModal()} size="large">
                      <Muicon.Close css={css`color: #f44336;`} fontSize="large" />
                      <Mui.Typography variant="body2" color="textSecondary" component="p">Close</Mui.Typography>
                    </Mui.IconButton>
                  </Mui.CardContent>
                </Mui.Card>
              }
            </Mui.Modal>

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