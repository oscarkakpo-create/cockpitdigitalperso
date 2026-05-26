import { getCourses } from '../connectors/moodleConnector.js';

export async function listCourses() {
  return getCourses();
}
