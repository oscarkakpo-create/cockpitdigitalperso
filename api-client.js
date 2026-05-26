(function initCesagApiLayer() {
  const API_BASE = window.CESAG_API_BASE || '/api';

  async function safeFetch(endpoint, fallbackData) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (_error) {
      return fallbackData;
    }
  }

  window.CESAG_API = {
    getStatus: () => safeFetch('/status', { ok: false, source: 'fallback' }),
    getCourses: () => safeFetch('/courses', { source: 'fallback', data: [] }),
    getStudents: () => safeFetch('/students', { source: 'fallback', data: [] }),
    getReports: () => safeFetch('/reports', { source: 'fallback', data: [] })
  };
})();
