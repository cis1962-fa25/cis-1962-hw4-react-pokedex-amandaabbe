import type { BoxEntry } from '../types/types';
import BoxCard from './BoxCard';

interface BoxListProps {
  entries: BoxEntry[];
  onEdit: (entry: BoxEntry) => void;
  onDelete: (id: string) => void;
}

function BoxList({ entries, onEdit, onDelete }: BoxListProps) {
  if (entries.length === 0) {
    return <p>You haven't caught any Pokémon yet.</p>;
  }

  return (
    <div>
      {entries.map((entry) => (
        <BoxCard
          key={entry.id}
          entry={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default BoxList;
