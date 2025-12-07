
````markdown
# ToDo – Lista de Tarefas
Integrantes: Emanuelle Anjolin Zuntini e  Paulo Henrique dos Santos

Aplicação de lista de tarefas com autenticação por usuário, interface moderna (Vuetify, tema claro/escuro) e API REST documentada com Swagger.

- **Frontend:** Vue 3, Vite, Vuetify 3, Pinia, Supabase JS
- **Backend:** Node.js, Express, Supabase JS (service role), Swagger UI
- **Auth & DB:** Supabase (Postgres + Google OAuth)

Cada usuário só enxerga **as próprias tarefas**, filtradas por `user_id` no banco.

---

## 🧱 Arquitetura

```txt
todo-list-app/
  backend/
    app.js
    controllers/
    middleware/
    lib/
    routes/
    swagger.js
  frontend/
    src/
      components/
      views/
      stores/
      router/
      supabase.js
  README.md
````

### Backend

* `app.js` – configura Express, CORS, JSON, Swagger e rotas.
* `routes/taskRoutes.js` – rotas de tarefas, protegidas por `checkAuth`.
* `controllers/taskController.js` – CRUD de tarefas (sempre filtrando por `user_id`).
* `middleware/auth.js` – valida o JWT do Supabase (header `Authorization: Bearer <token>`).
* `lib/supabaseClient.js` – cliente Supabase com **Service Role Key**.
* `swagger.js` – documentação OpenAPI servida em `/api-docs`.

### Frontend

* `src/main.js` – inicializa Vue, Vuetify e Pinia.
* `src/router/index.js` – rotas (`/` login, `/dashboard` protegida).
* `src/stores/auth.js` – sessão do Supabase, login/logout, guard de rota.
* `src/stores/ui.js` – controle de tema (light/dark).
* `src/views/LoginPage.vue` – tela de login (“Entrar com Google”).
* `src/views/DashboardPage.vue` – dashboard com lista, filtros e resumo.
* `src/components/TaskForm.vue` – formulário de nova tarefa.
* `src/components/TaskList.vue` – lista de tarefas (borda colorida por status).
* `src/components/Layout.vue` – layout principal, tema e botão “TOKEN SWAGGER”.

---

## 🗄️ Configuração do Supabase

### 1. Criar tabela `tasks`

No Supabase (SQL Editor), execute:

```sql
create table if not exists public.tasks (
  id          bigserial primary key,
  created_at  timestamptz default now(),
  title       text not null,
  description text,
  due_date    date,
  priority    integer,
  completed   boolean default false,
  user_id     uuid references auth.users (id)
);
```

> `user_id` é obrigatório para isolar as tarefas por usuário.
> Se já existirem tarefas antigas, preencha `user_id` manualmente com o id de cada usuário.

### 2. Variáveis de ambiente (backend)

No diretório `backend/`, crie um `.env`:

```env
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
PORT=3000
```

* Use **Service Role Key** só no backend.
* Nunca suba essa chave para repositório público.

### 3. Variáveis de ambiente (frontend)

No diretório `frontend/`, crie um `.env`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY_PUBLICA
VITE_API_BASE_URL=http://localhost:3000/api
```

* `ANON_KEY` é a chave pública do Supabase.
* `VITE_API_BASE_URL` aponta para a API Express.

---

## ▶️ Como rodar o projeto

### Backend

```bash
cd backend
npm install
npm run dev   # desenvolvimento (nodemon) em http://localhost:3000
```

Rotas úteis:

* Swagger: `http://localhost:3000/api-docs`
* Health check: `GET /api/ping`
* Usuário autenticado (teste): `GET /api/me` (com header Authorization)

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev   # Vite em http://localhost:5173 (ou porta similar)
```

A aplicação abre na tela de login.

---

## 🔐 Autenticação (Supabase + Google)

1. Usuário acessa `/` (LoginPage) e clica em **“Entrar com Google”**.

2. Frontend usa `supabase.auth.signInWithOAuth({ provider: 'google' })`.

3. Supabase redireciona de volta; o store `auth` registra `user` e `session`.

4. Ao chamar a API (`/api/tasks`), o frontend envia:

   ```http
   Authorization: Bearer <access_token_do_supabase>
   ```

5. O middleware `checkAuth` valida o token com Supabase e preenche `req.user`.

6. Os controllers filtram sempre por `user_id = req.user.id`.

Resultado: cada conta enxerga apenas suas próprias tarefas.

---

## 📦 API de Tarefas (resumo)

Todas as rotas exigem Authorization: Bearer <token>.

GET /api/tasks
Lista tarefas do usuário autenticado.

POST /api/tasks

{
  "title": "Estudar Node.js",
  "description": "Ver módulo X",
  "dueDate": "2024-12-30",
  "priority": 2,
  "completed": false
}


PUT /api/tasks/:id – Atualiza campos da tarefa (pertencente ao usuário).

DELETE /api/tasks/:id – Remove tarefa do usuário.

Documentação completa e testes via Swagger em:

Swagger UI: http://localhost:3000/api-docs/#/

---

## 🎨 Funcionalidades do Frontend

* **Dashboard por usuário**

  * Saudação com nome do usuário (dados do Supabase).
  * Resumo: total, pendentes, concluídas.

* **CRUD de tarefas**

  * Criar tarefa com título, descrição, data e prioridade.
  * Marcar como concluída / reabrir.
  * Editar e excluir via diálogo.

* **Filtros**

  * “Todas | Pendentes | Concluídas” logo acima da lista.

* **Status visual**

  * Borda lateral:

    * vermelho → atrasada (data passada, não concluída);
    * amarelo → pendente;
    * verde → concluída.
  * Chip com bolinha + texto (“Atrasada”, “Pendente”, “Concluída”).

* **Tema claro/escuro**

  * Botão na app-bar alterna `ui.dark`.
  * Layout, cards e lista adaptados para dark mode.

* **Token Swagger**

  * Botão **“TOKEN SWAGGER”** abre um diálogo mostrando o `access_token`
    atual da sessão, para usar em `/api-docs` durante o desenvolvimento.

---

## 🧪 Scripts úteis

### Backend

```bash
cd backend
npm run dev      # desenvolvimento
npm start        # produção simples
```

### Frontend

```bash
cd frontend
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run preview  # servir o build localmente
```
