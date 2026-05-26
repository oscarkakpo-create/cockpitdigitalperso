import { env, hasMoodleConfig } from '../config/env.js';

async function moodleRequest(wsfunction, params = {}) {
  if (!hasMoodleConfig()) {
    return { source: 'fallback', configured: false, wsfunction, data: [] };
  }

  const url = new URL('/webservice/rest/server.php', env.moodleApiUrl);
  url.searchParams.set('wstoken', env.moodleApiToken);
  url.searchParams.set('moodlewsrestformat', 'json');
  url.searchParams.set('wsfunction', wsfunction);

  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Moodle request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return { source: 'moodle', configured: true, wsfunction, data: payload };
}

export async function getCourses() {
  return moodleRequest('core_course_get_courses');
}

export async function getStudents() {
  // Pilot endpoint based on user listing; can be replaced with cohort- or course-based retrieval.
  return moodleRequest('core_user_get_users', { 'criteria[0][key]': 'email', 'criteria[0][value]': '%' });
}

export async function getMoodleReportingSnapshot() {
  // Structure prepared for progressive enrichment (quiz, assignments, grades, completion).
  return {
    source: hasMoodleConfig() ? 'moodle' : 'fallback',
    configured: hasMoodleConfig(),
    modules: {
      courses: 'ready',
      students: 'ready',
      quizzes: 'connector placeholder ready',
      assignments: 'connector placeholder ready',
      completion: 'connector placeholder ready',
      grades: 'connector placeholder ready'
    }
  };
}
