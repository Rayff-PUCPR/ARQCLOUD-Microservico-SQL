# Microserviço SQL - RotaCerta

## Alunos

- Ícaro Rayff de Souza
- Armando de Souza Stein

Microserviço responsável pelo domínio transacional de pedidos, motoristas, entregas e status operacionais.

## Descrição da arquitetura

O serviço segue Clean Architecture e Vertical Slice. As features principais são `orders` e `drivers`, cada uma organizada em camadas:

- `domain`: entidades, contratos de repositório e regras de negócio.
- `application`: use cases de criação, listagem, alteração de status, atribuição de rota e reset.
- `infrastructure`: adapters de persistência em memória e Azure SQL.
- `api`: controllers HTTP documentados via Swagger.

Fluxo principal:

```txt
BFF -> Microserviço SQL -> Azure SQL Database
```

Por padrão, o serviço usa repositórios em memória para desenvolvimento local. Para a entrega em nuvem, pode ser configurado para usar Azure SQL Database.

## Tecnologias utilizadas

- Node.js
- TypeScript
- NestJS
- Azure SQL Database
- mssql
- Swagger / OpenAPI
- Vitest
- dotenv

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```env
PORT=3001
PERSISTENCE_DRIVER=memory
```

Para usar Azure SQL Database:

```env
PORT=3001
PERSISTENCE_DRIVER=azure-sql
AZURE_SQL_SERVER=seu-servidor.database.windows.net
AZURE_SQL_PORT=1433
AZURE_SQL_DATABASE=rotacerta
AZURE_SQL_USER=seu_usuario
AZURE_SQL_PASSWORD=sua_senha
AZURE_SQL_ENCRYPT=true
AZURE_SQL_TRUST_SERVER_CERTIFICATE=false
```

Antes de iniciar com `azure-sql`, execute o script [database/azure-sql-schema.sql](database/azure-sql-schema.sql) no banco Azure SQL.

Inicie o serviço:

```bash
npm run dev
```

Endereços locais:

- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- Health check: `http://localhost:3001/health`

Para validar a conexão com Azure SQL configurada no `.env`:

```bash
npm run testar:conexao
```

Endpoints principais:

- `POST /api/v1/orders`
- `GET /api/v1/orders`
- `GET /api/v1/orders/pending`
- `PATCH /api/v1/orders/:id/status`
- `PATCH /api/v1/orders/:id/route`
- `GET /api/v1/drivers`
- `POST /api/v1/drivers`
- `GET /health`

Para rodar os testes:

```bash
npm test
```
