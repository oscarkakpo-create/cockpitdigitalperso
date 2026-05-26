import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, '..', 'data', 'store.json');

async function readStore() {
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeStore(data) {
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export async function getSection(section) {
  const store = await readStore();
  return store[section];
}

export async function setSection(section, value) {
  const store = await readStore();
  store[section] = value;
  await writeStore(store);
  return store[section];
}

export async function appendSectionItem(section, item) {
  const store = await readStore();
  const current = Array.isArray(store[section]) ? store[section] : [];
  const record = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...item };
  current.push(record);
  store[section] = current;
  await writeStore(store);
  return record;
}
