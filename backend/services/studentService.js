import { getStudents } from '../connectors/moodleConnector.js';

export async function listStudents() {
  return getStudents();
}
