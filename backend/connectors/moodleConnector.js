export async function getMoodleConnectorStatus() {
  return {
    enabled: false,
    source: 'disabled',
    message: 'Moodle connector is intentionally disabled. No request is sent to CESAG Online.'
  };
}
