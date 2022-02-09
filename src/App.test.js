import { render, screen } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('Pokemon list page is exist', () => {
  render(<App />);

  const pokemonList = screen.getByRole('heading', { name: 'Pokemon List' });
  expect(pokemonList).toBeInTheDocument();
});

test('My pokemon list page is exist', () => {
  render(<App />);
  
  //click My Pokemon
  const myPokemonLink = screen.getByRole('button', { name: 'My Pokemon' });
  expect(myPokemonLink).toBeInTheDocument();
  myPokemonLink.click();
  
  //find the page after clicking
  const myPokemonList = screen.getByRole('heading', { name: 'My Pokemon List' });
  expect(myPokemonList).toBeInTheDocument();
});
