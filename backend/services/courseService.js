// Deprecated in internal-only mode. Kept intentionally as a placeholder for future evolution.
export async function listCourses() {
  return [];
import { getCourses } from '../connectors/moodleConnector.js';

export async function listCourses() {
  return getCourses();
}
