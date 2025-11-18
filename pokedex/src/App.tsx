import { useEffect, useState } from 'react';
import './App.css';
import {
  fetchPokemonPage,
} from './api/PokemonAPI';
import type {
  Pokemon,
  InsertBoxEntry,
  BoxEntry,
  UpdateBoxEntry,
} from './types/types';
import PokemonList from './components/PokemonList';
import Modal from './components/Modal';
import PokemonDetails from './components/PokemonDetails';
import BoxForm from './components/BoxForm';
import BoxList from './components/BoxList';
import {
  createBoxEntry,
  listBoxIds,
  getBoxEntry,
  updateBoxEntry,
  deleteBoxEntry,
} from './api/BoxAPI';

const PAGE_SIZE = 10;

function App() {
  // Pokémon list state
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Modal / details for Pokémon
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isCatching, setIsCatching] = useState(false);

  // View toggle: all Pokémon vs Box
  const [view, setView] = useState<'pokemon' | 'box'>('pokemon');

  // Box state
  const [boxEntries, setBoxEntries] = useState<BoxEntry[]>([]);
  const [boxLoading, setBoxLoading] = useState(false);
  const [boxError, setBoxError] = useState<string | null>(null);

  // Editing a Box entry
  const [selectedBoxEntry, setSelectedBoxEntry] = useState<BoxEntry | null>(
    null,
  );

  // ---------- Pokémon list loading ----------
  useEffect(() => {
    if (view !== 'pokemon') return;

    async function loadPokemon() {
      try {
        setLoading(true);
        setError(null);

        const offset = currentPage * PAGE_SIZE;
        const data = await fetchPokemonPage(PAGE_SIZE, offset);
        setPokemon(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    void loadPokemon();
  }, [currentPage, view]);

  // ---------- Box loading helper ----------
  async function loadBoxEntries() {
    try {
      setBoxLoading(true);
      setBoxError(null);

      const ids = await listBoxIds();
      const entries = await Promise.all(ids.map((id) => getBoxEntry(id)));
      setBoxEntries(entries);
    } catch (err) {
      if (err instanceof Error) {
        setBoxError(err.message);
      } else {
        setBoxError('Failed to load Box entries.');
      }
    } finally {
      setBoxLoading(false);
    }
  }

  // Load Box when switching to Box view
  useEffect(() => {
    if (view !== 'box') return;
    void loadBoxEntries();
  }, [view]);

  // ---------- Handlers for Pokémon view ----------

  function handlePokemonClick(p: Pokemon) {
    setSelectedPokemon(p);
    setIsCatching(false); // start in "details" mode
  }

  function closePokemonModal() {
    setSelectedPokemon(null);
    setIsCatching(false);
  }

  function goToPreviousPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }

  function goToNextPage() {
    setCurrentPage((prev) => prev + 1);
  }

  function handleCatchClick() {
    setIsCatching(true);
  }

  async function handleSaveToBox(entry: InsertBoxEntry) {
    await createBoxEntry(entry);
    setIsCatching(false);
    setSelectedPokemon(null);
    alert('Pokémon added to your Box!');
    if (view === 'box') {
      await loadBoxEntries();
    }
  }

  // ---------- Handlers for Box view ----------

  function handleEditBoxEntry(entry: BoxEntry) {
    setSelectedBoxEntry(entry);
  }

  async function handleDeleteBoxEntry(id: string) {
    const confirmed = window.confirm('Delete this Box entry?');
    if (!confirmed) return;

    await deleteBoxEntry(id);
    await loadBoxEntries();
  }

  async function handleUpdateBoxEntry(entry: InsertBoxEntry) {
    if (!selectedBoxEntry) return;

    const updates: UpdateBoxEntry = {
      location: entry.location,
      level: entry.level,
      notes: entry.notes,
      pokemonId: entry.pokemonId,
      // we could also send createdAt if we wanted, but it's optional
    };

    await updateBoxEntry(selectedBoxEntry.id, updates);
    setSelectedBoxEntry(null);
    await loadBoxEntries();
  }

  function closeBoxModal() {
    setSelectedBoxEntry(null);
  }

  return (
    <div>
      <h1>Pokedex</h1>

      {/* View toggle */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setView('pokemon')}
          disabled={view === 'pokemon'}
        >
          All Pokémon
        </button>
        <button onClick={() => setView('box')} disabled={view === 'box'}>
          My Box
        </button>
      </div>

      {/* Pokémon view */}
      {view === 'pokemon' && (
        <>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          {!loading && !error && (
            <>
              <PokemonList
                pokemon={pokemon}
                onPokemonClick={handlePokemonClick}
              />

              <div
                style={{ marginTop: '16px', display: 'flex', gap: '8px' }}
              >
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0 || loading}
                >
                  Previous
                </button>
                <button onClick={goToNextPage} disabled={loading}>
                  Next
                </button>
                <span>Page {currentPage + 1}</span>
              </div>
            </>
          )}
        </>
      )}

      {/* Box view */}
      {view === 'box' && (
        <>
          {boxLoading && <p>Loading your Box...</p>}
          {boxError && <p style={{ color: 'red' }}>Error: {boxError}</p>}

          {!boxLoading && !boxError && (
            <BoxList
              entries={boxEntries}
              onEdit={handleEditBoxEntry}
              onDelete={handleDeleteBoxEntry}
            />
          )}
        </>
      )}

      {/* Modal for Pokémon details / catch form */}
      <Modal isOpen={selectedPokemon !== null} onClose={closePokemonModal}>
        {selectedPokemon && !isCatching && (
          <PokemonDetails
            pokemon={selectedPokemon}
            onCatchClick={handleCatchClick}
          />
        )}

        {selectedPokemon && isCatching && (
          <BoxForm
            pokemonId={selectedPokemon.id}
            onSave={handleSaveToBox}
            onCancel={() => setIsCatching(false)}
          />
        )}
      </Modal>

      {/* Modal for editing a Box entry */}
      <Modal isOpen={selectedBoxEntry !== null} onClose={closeBoxModal}>
        {selectedBoxEntry && (
          <BoxForm
            pokemonId={selectedBoxEntry.pokemonId}
            initialLocation={selectedBoxEntry.location}
            initialLevel={selectedBoxEntry.level}
            initialNotes={selectedBoxEntry.notes}
            onSave={handleUpdateBoxEntry}
            onCancel={closeBoxModal}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
