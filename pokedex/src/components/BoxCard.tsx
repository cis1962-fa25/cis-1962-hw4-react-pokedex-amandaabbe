import type { BoxEntry } from '../types/types';

interface BoxCardProps {
  entry: BoxEntry;
  onEdit: (entry: BoxEntry) => void;
  onDelete: (id: string) => void;
}

function BoxCard({ entry, onEdit, onDelete }: BoxCardProps) {
  const date = new Date(entry.createdAt);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '8px',
        marginBottom: '8px',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Caught Pokémon #{entry.pokemonId}</h3>
      <p style={{ margin: 0 }}>
        <strong>Location:</strong> {entry.location}
      </p>
      <p style={{ margin: 0 }}>
        <strong>Level:</strong> {entry.level}
      </p>
      {entry.notes && (
        <p style={{ margin: 0 }}>
          <strong>Notes:</strong> {entry.notes}
        </p>
      )}
      <p style={{ margin: '4px 0 8px 0', fontSize: '0.8rem', color: '#555' }}>
        Caught at: {date.toLocaleString()}
      </p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="button" onClick={() => onEdit(entry)}>
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          style={{ color: 'white', backgroundColor: '#c0392b' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BoxCard;
