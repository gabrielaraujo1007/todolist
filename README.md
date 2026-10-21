# ToDoList — Gerenciador de tarefas

Aplicação full-stack para cadastrar, consultar, editar, concluir e excluir tarefas.

## Tecnologias

### Backend
- Java 21
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Data JPA / Hibernate
- PostgreSQL
- Gradle Wrapper
- JUnit e testes automatizados

### Frontend
- Angular 20
- TypeScript
- RxJS
- Angular Router
- Tailwind CSS 4
- Jasmine / Karma

### Infraestrutura
- Docker e Docker Compose
- PostgreSQL 17 (container)
- Nginx (serve o frontend no container)
- GitHub Actions (testes e build)

## Funcionalidades

- Listagem de tarefas
- Cadastro de tarefas
- Consulta e edição por identificador
- Marcação de tarefas como concluídas
- Exclusão de tarefas
- Validação do título e da descrição
- Registro de data de criação
- Interface responsiva

## Estrutura

```text
ToDoList/
├── backend/             # API REST Java com Spring Boot (+ Dockerfile)
├── frontend/            # Aplicação Angular (+ Dockerfile e nginx.conf)
├── .github/workflows/   # Automação de testes e build
├── docker-compose.yml   # Orquestra banco, backend e frontend
└── .env.example         # Modelo das variáveis de ambiente
```

## Executar com Docker (recomendado)

Sobe o banco de dados, o backend e o frontend com um único comando.

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) com Docker Compose
- Git

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/gabrielaraujo1007/todolist.git
cd todolist
```

**2. Crie o arquivo `.env`**

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Abra o `.env` e **troque o valor de `POSTGRES_PASSWORD`**. O arquivo `.env` não é versionado.

**3. Suba os containers**

```bash
docker compose up --build
```

Para rodar em segundo plano:

```bash
docker compose up --build -d
```

O backend só inicia depois que o banco estiver pronto (healthcheck do PostgreSQL).

**4. Acesse a aplicação**

| Serviço | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API (backend) | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

### Variáveis de ambiente

Definidas no arquivo `.env` (modelo em `.env.example`):

| Variável | Padrão | Descrição |
|---|---|---|
| `POSTGRES_DB` | `tasks` | Nome do banco de dados |
| `POSTGRES_USER` | `postgres` | Usuário do banco |
| `POSTGRES_PASSWORD` | — (obrigatória) | Senha do banco |

O backend recebe a conexão com o banco pelas variáveis `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD`, montadas automaticamente pelo `docker-compose.yml` a partir do `.env`.

### Comandos úteis

```bash
docker compose ps                 # status dos containers
docker compose logs -f backend    # logs do backend
docker compose down               # parar e remover os containers
docker compose down -v            # idem, apagando também os dados do banco
```

## Executar localmente (sem Docker)

### Pré-requisitos

- JDK 21
- Node.js e npm
- PostgreSQL
- Git

### 1. Banco de dados

Crie um banco PostgreSQL chamado `tasks`.

Configure as credenciais e a URL de conexão em:

`backend/src/main/resources/application.properties`

### 2. Backend

```bash
cd backend
.\gradlew.bat test
.\gradlew.bat bootRun
```

No Linux/macOS, use `./gradlew` no lugar de `.\gradlew.bat`.

A API estará disponível em `http://localhost:8080`.

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm start
```

A aplicação Angular estará disponível em `http://localhost:4200`.

## Endpoints da API

| Método | Rota | Operação |
|---|---|---|
| GET | `/tasks` | Listar tarefas |
| GET | `/tasks/{id}` | Consultar uma tarefa |
| POST | `/tasks` | Criar tarefa |
| PUT | `/tasks/{id}` | Atualizar tarefa |
| DELETE | `/tasks/{id}` | Excluir tarefa |

## Testes e build

Backend:

```bash
cd backend
.\gradlew.bat test
```

Frontend:

```bash
cd frontend
npm test -- --watch=false
npm run build
```

O workflow em `.github/workflows/ci.yml` executa os testes e o build automaticamente.

## Solução de problemas

- **Erro "Configure POSTGRES_PASSWORD no arquivo .env":** o `.env` não existe ou está sem a senha. Copie o `.env.example` para `.env` e preencha.
- **Porta já em uso (5432, 8080 ou 4200):** pare o serviço que está usando a porta (por exemplo, um PostgreSQL local na 5432) ou altere o mapeamento em `ports:` no `docker-compose.yml`.
- **Backend não conecta ao banco depois de trocar a senha:** o volume do banco guarda a senha antiga. Rode `docker compose down -v` e suba de novo.
- **Alterações no código não aparecem:** rode `docker compose up --build` para reconstruir as imagens.