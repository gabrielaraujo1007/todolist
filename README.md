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

- `backend/`: API REST Java com Spring Boot
- `frontend/`: aplicação Angular
- `.github/workflows/`: automação de testes e build

## Pré-requisitos

- JDK 21
- Node.js e npm
- PostgreSQL para execução local
- Git

## Executar localmente

### 1. Banco de dados

Crie um banco PostgreSQL chamado `tasks`.

Configure as credenciais e a URL de conexão em:

`backend/src/main/resources/application.properties`

### 2. Backend

backend/
.\gradlew.bat test
.\gradlew.bat bootRun


A API estará disponível em `http://localhost:8080`.

### 3. Frontend

Em outro terminal:

frontend/
npm install
npm start


A aplicação Angular estará disponível normalmente em `http://localhost:4200`.

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

cd backend
.\gradlew.bat test


Frontend:

cd frontend
npm test -- --watch=false
npm run build


## Observações

O banco de dados deve estar acessível e configurado para a execução local.
