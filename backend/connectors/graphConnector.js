export async function getGraphConnectorStatus() {
  return {
    enabled: false,
    source: 'disabled',
    message: 'Microsoft Graph connector is currently a placeholder and does not call external services.'
import { hasGraphConfig } from '../config/env.js';

export async function getGraphResourcesSummary() {
  return {
    source: hasGraphConfig() ? 'graph' : 'fallback',
    configured: hasGraphConfig(),
    modules: {
      sharepoint: 'connector placeholder ready',
      onedrive: 'connector placeholder ready',
      excel: 'connector placeholder ready',
      forms: 'connector placeholder ready',
      outlookCalendar: 'connector placeholder ready',
      teams: 'connector placeholder ready'
    }
  };
}
