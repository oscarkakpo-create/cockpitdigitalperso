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
import { getMoodleReportingSnapshot } from '../connectors/moodleConnector.js';
import { getGraphResourcesSummary } from '../connectors/graphConnector.js';

export async function buildReport() {
  const [moodle, graph] = await Promise.all([
    getMoodleReportingSnapshot(),
    getGraphResourcesSummary()
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
    moodle,
    graph,
    note: 'Pilot report endpoint. Extend with KPI computations and persistence.'
  };
}
