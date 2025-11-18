import { useState } from 'react';
import type { InsertBoxEntry } from '../types/types';

interface BoxFormProps {
  pokemonId: number;
  onSave: (entry: InsertBoxEntry) => Promise<void> | void;
  onCancel: () => void;
  initialLocation?: string;
  initialLevel?: number;
  initialNotes?: string;
}

function BoxForm({
  pokemonId,
  onSave,
  onCancel,
  initialLocation,
  initialLevel,
  initialNotes,
}: BoxFormProps) {
  const [location, setLocation] = useState(initialLocation ?? '');
  const [level, setLevel] = useState<number | ''>(
    initialLevel !== undefined ? initialLevel : '',
  );
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const numericLevel = typeof level === 'string' ? Number(level) : level;

    if (!location.trim()) {
      setError('Location is required.');
      return;
    }

    if (!numericLevel || numericLevel < 1 || numericLevel > 100) {
      setError('Level must be a number between 1 and 100.');
      return;
    }

    const entry: InsertBoxEntry = {
      pokemonId,
      location: location.trim(),
      level: numericLevel,
      notes: notes.trim() || undefined,
      // For both create and edit we just use "now" – simple and acceptable.
      createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      await onSave(entry);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save Box entry.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Catch details</h3>

      <div style={{ marginBottom: '8px' }}>
        <label>
          Location:{' '}
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label>
          Level (1–100):{' '}
          <input
            type="number"
            value={level}
            onChange={(event) => {
              const value = event.target.value;
              setLevel(value === '' ? '' : Number(value));
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label>
          Notes (optional):{' '}
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
      </div>

      {error && (
        <p style={{ color: 'red', marginBottom: '8px' }}>Error: {error}</p>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BoxForm;
