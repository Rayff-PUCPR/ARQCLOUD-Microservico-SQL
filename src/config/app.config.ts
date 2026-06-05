import { config as loadEnv } from 'dotenv';
import type { config as SqlConfig } from 'mssql';

loadEnv();

export type PersistenceDriver = 'memory' | 'azure-sql';

export function getPersistenceDriver(): PersistenceDriver {
  const driver = process.env.PERSISTENCE_DRIVER ?? 'memory';
  if (driver !== 'memory' && driver !== 'azure-sql') {
    throw new Error(`Invalid PERSISTENCE_DRIVER: ${driver}`);
  }
  return driver;
}

export function getAzureSqlConfig(): SqlConfig {
  const required = [
    'AZURE_SQL_SERVER',
    'AZURE_SQL_DATABASE',
    'AZURE_SQL_USER',
    'AZURE_SQL_PASSWORD'
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Azure SQL environment variables: ${missing.join(', ')}`);
  }

  return {
    server: process.env.AZURE_SQL_SERVER!,
    port: Number(process.env.AZURE_SQL_PORT ?? 1433),
    database: process.env.AZURE_SQL_DATABASE!,
    user: process.env.AZURE_SQL_USER!,
    password: process.env.AZURE_SQL_PASSWORD!,
    connectionTimeout: Number(process.env.AZURE_SQL_CONNECTION_TIMEOUT_MS ?? 15000),
    requestTimeout: Number(process.env.AZURE_SQL_REQUEST_TIMEOUT_MS ?? 15000),
    options: {
      encrypt: parseBoolean(process.env.AZURE_SQL_ENCRYPT, true),
      trustServerCertificate: parseBoolean(process.env.AZURE_SQL_TRUST_SERVER_CERTIFICATE, false)
    }
  };
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === 'true';
}
