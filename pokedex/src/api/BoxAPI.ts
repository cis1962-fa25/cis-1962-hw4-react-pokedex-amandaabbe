import type { InsertBoxEntry, BoxEntry, UpdateBoxEntry } from '../types/types';

const BASE_URL = 'https://hw4.cis1962.esinx.net/api';


const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJwZW5ua2V5IjoiYWFiYmUyNiIsImlhdCI6MTc1OTA5ODIxOCwiaXNzIjoiZWR1OnVwZW5uOnNlYXM6Y2lzMTk2MiIsImF1ZCI6ImVkdTp1cGVubjpzZWFzOmNpczE5NjIiLCJleHAiOjE3NjQyODIyMTh9.XTVElUAialfJdxdIoXsToirAPSogYQLuM1krDbJb5ik";

function authHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export async function createBoxEntry(entry: InsertBoxEntry): Promise<BoxEntry> {
  const response = await fetch(`${BASE_URL}/box/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error(`Failed to create Box entry: ${response.status}`);
  }

  return (await response.json()) as BoxEntry;
}

export async function listBoxIds(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/box/`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Box IDs: ${response.status}`);
  }

  return (await response.json()) as string[];
}

export async function getBoxEntry(id: string): Promise<BoxEntry> {
  const response = await fetch(`${BASE_URL}/box/${id}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Box entry: ${response.status}`);
  }

  return (await response.json()) as BoxEntry;
}

export async function updateBoxEntry(
  id: string,
  updates: UpdateBoxEntry,
): Promise<BoxEntry> {
  const response = await fetch(`${BASE_URL}/box/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update Box entry: ${response.status}`);
  }

  return (await response.json()) as BoxEntry;
}

export async function deleteBoxEntry(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/box/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete Box entry: ${response.status}`);
  }
}
