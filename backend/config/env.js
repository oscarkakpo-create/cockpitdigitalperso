import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  moodleApiUrl: process.env.MOODLE_API_URL,
  moodleApiToken: process.env.MOODLE_API_TOKEN,
  graphClientId: process.env.GRAPH_CLIENT_ID,
  graphClientSecret: process.env.GRAPH_CLIENT_SECRET,
  graphTenantId: process.env.GRAPH_TENANT_ID,
  internalApiSecret: process.env.INTERNAL_API_SECRET
};

export function hasMoodleConfig() {
  return Boolean(env.moodleApiUrl && env.moodleApiToken);
}

export function hasGraphConfig() {
  return Boolean(env.graphClientId && env.graphClientSecret && env.graphTenantId);
}
