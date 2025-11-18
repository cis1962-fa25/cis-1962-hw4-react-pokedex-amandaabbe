import type { Pokemon } from '../types/types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void; // added
}

function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const sprite = pokemon.sprites.front_default;

  return (
    <div
      onClick={onClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '8px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer', // added
      }}
    >
      {sprite && (
        <img
          src={sprite}
          alt={pokemon.name}
          style={{ width: '64px', height: '64px' }}
        />
      )}
      <div>
        <h2 style={{ margin: 0, textTransform: 'capitalize' }}>
          {pokemon.name}
        </h2>
        <p style={{ margin: 0 }}>
          {pokemon.types.map((t) => t.name.toLowerCase()).join(', ')}
        </p>
      </div>
    </div>
  );
}

export default PokemonCard;
