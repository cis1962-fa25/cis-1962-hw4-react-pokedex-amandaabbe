import type { Pokemon } from '../types/types';
import PokemonCard from './PokemonCard';

interface PokemonListProps {
  pokemon: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
}

function PokemonList({ pokemon, onPokemonClick }: PokemonListProps) {
  return (
    <div>
      {pokemon.map((p) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          onClick={() => onPokemonClick(p)}
        />
      ))}
    </div>
  );
}

export default PokemonList;
