import { readFileSync } from 'fs';
import { resolve } from 'path';

const OPTIONAL = new Set([
  'OPENROUTER_API_KEY',
  'OLLAMA_API_KEY',
  'OLLAMA_BASE_URL',
  'SGLANG_API_KEY',
  'SGLANG_BASE_URL',
  'GEMINI_API_KEY',
  'GROQ_API_KEY',
  'SUPERMEMORY_API_KEY',
  'OPENSANDBOX_API_KEY',
  'MONITORING_API_KEY',
  'WORKFLOW_PROJECT_PATH_FILTERS',
  'AUTH_ALLOWED_EMAIL_DOMAINS',
  'GITLAB_BOT_NAME',
  'GITLAB_BOT_EMAIL',
  'ISSUE_TRACKER_URL',
]);

// At least one LLM provider must be configured, or the app would fall back to a
// provider that isn't set up and fail at request time (e.g. ECONNREFUSED trying
// to reach a local sglang that was never configured).
const LLM_PROVIDER_KEYS = [
  'OPENROUTER_API_KEY',
  'OLLAMA_API_KEY',
  'SGLANG_API_KEY',
  'GEMINI_API_KEY',
  'GROQ_API_KEY',
];

export function validateEnv() {
  const example = readFileSync(
    resolve(import.meta.dirname, '../../.env.example'),
    'utf8',
  );
  const required = example
    .split('\n')
    .map((line) => line.split('=')[0].trim())
    .filter((key) => key && !key.startsWith('#') && !OPTIONAL.has(key));

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join('\n  ')}\n\nCopy .env.example to .env and fill in the values.`,
    );
  }

  if (!LLM_PROVIDER_KEYS.some((key) => process.env[key])) {
    throw new Error(
      `No LLM provider is configured. Set at least one of:\n  ${LLM_PROVIDER_KEYS.join('\n  ')}\n\nin .env so the app doesn't fall back to a provider you haven't set up.`,
    );
  }
}
