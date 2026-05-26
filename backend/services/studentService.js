// Deprecated in internal-only mode. Kept intentionally as a placeholder for future evolution.
export async function listStudents() {
  return [];
import { getStudents } from '../connectors/moodleConnector.js';

export async function listStudents() {
  return getStudents();
}
