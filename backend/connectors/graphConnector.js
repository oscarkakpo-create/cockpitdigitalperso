export async function getGraphConnectorStatus() {
  return {
    enabled: false,
    source: 'disabled',
    message: 'Microsoft Graph connector is currently a placeholder and does not call external services.'
  };
}
