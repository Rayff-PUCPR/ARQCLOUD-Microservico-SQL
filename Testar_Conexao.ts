import sql from 'mssql';
import { getAzureSqlConfig } from './src/config/app.config';

function mask(value: string | undefined) {
  if (!value) {
    return '(nao informado)';
  }

  if (value.length <= 4) {
    return '*'.repeat(value.length);
  }

  return `${value.slice(0, 2)}${'*'.repeat(value.length - 4)}${value.slice(-2)}`;
}

async function main() {
  const config = getAzureSqlConfig();
  const startedAt = Date.now();

  console.log('Testando conexao com Azure SQL...');
  console.log(`Servidor: ${config.server}`);
  console.log(`Banco: ${config.database}`);
  console.log(`Usuario: ${mask(config.user)}`);
  console.log(`Porta: ${config.port ?? 1433}`);
  console.log('');

  let pool: sql.ConnectionPool | undefined;

  try {
    pool = await sql.connect(config);

    const ping = await pool.request().query<{
      resultado: number;
      bancoAtual: string;
      dataServidor: Date;
    }>(`
      SELECT
        1 AS resultado,
        DB_NAME() AS bancoAtual,
        SYSDATETIME() AS dataServidor
    `);

    const tableCheck = await pool.request().query<{ quantidade: number }>(`
      SELECT COUNT(1) AS quantidade
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo'
        AND TABLE_NAME = 'Orders'
    `);

    const row = ping.recordset[0];
    const ordersTableExists = tableCheck.recordset[0]?.quantidade > 0;
    const elapsedMs = Date.now() - startedAt;

    console.log('Conexao realizada com sucesso.');
    console.log(`Resultado do ping: ${row.resultado}`);
    console.log(`Banco conectado: ${row.bancoAtual}`);
    console.log(`Data/hora no servidor: ${row.dataServidor}`);
    console.log(`Tabela dbo.Orders: ${ordersTableExists ? 'encontrada' : 'nao encontrada'}`);
    console.log(`Tempo total: ${elapsedMs}ms`);

    if (!ordersTableExists) {
      console.log('');
      console.log('Aviso: execute database/azure-sql-schema.sql antes de usar o repositorio azure-sql.');
    }
  } catch (error) {
    console.error('Falha ao conectar no Azure SQL.');

    if (error instanceof Error) {
      console.error(`Mensagem: ${error.message}`);
    } else {
      console.error(error);
    }

    console.error('');
    console.error('Confira se as variaveis AZURE_SQL_* estao corretas no .env e se seu IP esta liberado no firewall do Azure SQL.');
    process.exitCode = 1;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

void main();
