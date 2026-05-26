import { getSection } from './internalStoreService.js';
import { getMoodleConnectorStatus } from '../connectors/moodleConnector.js';
import { getGraphConnectorStatus } from '../connectors/graphConnector.js';

export async function buildReport() {
  const [resources, plannings, history, settings, moodle, graph] = await Promise.all([
    getSection('resources'),
    getSection('plannings'),
    getSection('history'),
    getSection('settings'),
    getMoodleConnectorStatus(),
    getGraphConnectorStatus()
  ]);

  return {
    generatedAt: new Date().toISOString(),
    cockpit: {
      resourcesCount: resources.length,
      planningsCount: plannings.length,
      historyCount: history.length,
      settings
    },
    connectors: { moodle, graph },
    independenceNote: 'Internal API only: no active integration with CESAG Online Moodle platform.'
  };
}
