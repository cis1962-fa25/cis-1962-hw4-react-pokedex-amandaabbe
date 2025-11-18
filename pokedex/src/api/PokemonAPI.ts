import type { Pokemon } from '../types/types';

// Base URL for the homework API
const BASE_URL = 'https://hw4.cis1962.esinx.net/api';

export async function fetchPokemonPage(
  limit: number,
  offset: number,
): Promise<Pokemon[]> {
  const url = `${BASE_URL}/pokemon/?limit=${limit}&offset=${offset}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${response.status}`);
  }

  const data = (await response.json()) as Pokemon[];
  return data;
}
