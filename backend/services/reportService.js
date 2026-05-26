import { getMoodleReportingSnapshot } from '../connectors/moodleConnector.js';
import { getGraphResourcesSummary } from '../connectors/graphConnector.js';

export async function buildReport() {
  const [moodle, graph] = await Promise.all([
    getMoodleReportingSnapshot(),
    getGraphResourcesSummary()
  ]);

  return {
    generatedAt: new Date().toISOString(),
    moodle,
    graph,
    note: 'Pilot report endpoint. Extend with KPI computations and persistence.'
  };
}
