import type { Pokemon } from '../types/types';

interface PokemonDetailsProps {
  pokemon: Pokemon;
  onCatchClick: () => void;
}

function PokemonDetails({ pokemon, onCatchClick }: PokemonDetailsProps) {
  const { sprites, types, stats } = pokemon;

  return (
    <div>
      <h2 style={{ textTransform: 'capitalize' }}>{pokemon.name}</h2>

      <p>
        Types:{' '}
        {types
          .map((t) => t.name.toLowerCase())
          .join(', ')}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {sprites.front_default && (
          <img
            src={sprites.front_default}
            alt={`${pokemon.name} front`}
            style={{ width: '72px', height: '72px' }}
          />
        )}
        {sprites.back_default && (
          <img
            src={sprites.back_default}
            alt={`${pokemon.name} back`}
            style={{ width: '72px', height: '72px' }}
          />
        )}
      </div>

      <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
        <p>HP: {stats.hp}</p>
        <p>Attack: {stats.attack}</p>
        <p>Defense: {stats.defense}</p>
        <p>Sp. Atk: {stats.specialAttack}</p>
        <p>Sp. Def: {stats.specialDefense}</p>
        <p>Speed: {stats.speed}</p>
      </div>

      <button onClick={onCatchClick}>Catch this Pokémon</button>
    </div>
  );
}

export default PokemonDetails;
