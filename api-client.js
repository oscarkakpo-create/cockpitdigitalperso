(function initCesagApiLayer() {
  const API_BASE = window.CESAG_API_BASE || '/api';

  async function safeFetch(endpoint, fallbackData, options) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (_error) {
      return fallbackData;
    }
  }

  window.CESAG_API = {
    getStatus: () => safeFetch('/status', { ok: false, source: 'fallback' }),
    getResources: () => safeFetch('/resources', []),
    addResource: (payload) => safeFetch('/resources', { saved: false, source: 'fallback' }, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    getPlannings: () => safeFetch('/plannings', []),
    addPlanning: (payload) => safeFetch('/plannings', { saved: false, source: 'fallback' }, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    getHistory: () => safeFetch('/history', []),
    addHistory: (payload) => safeFetch('/history', { saved: false, source: 'fallback' }, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    getSettings: () => safeFetch('/settings', { theme: 'light', useApiStorage: false }),
    updateSettings: (payload) => safeFetch('/settings', payload || {}, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload || {}) }),
    getReports: () => safeFetch('/reports', { source: 'fallback', data: [] })
  };
})();
