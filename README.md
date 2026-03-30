# Authenticator Firebase — Next.js

Sistema de autenticação completo com **Firebase Auth** integrado a um projeto **Next.js 16** usando App Router. Suporta login e cadastro por **e-mail/senha**, **Google**, **Facebook** e **Microsoft (Outlook)**, com sessão gerenciada por cookie `httpOnly` no servidor e estrutura pronta para integração com um backend externo (ex: Java/Spring + PostgreSQL).

---

## Sumário

- [Visão Geral](#visão-geral)
- [Criar o projeto do zero](#criar-o-projeto-do-zero)
  - [1. Criar o projeto Next.js](#1-criar-o-projeto-nextjs)
  - [2. Instalar dependências](#2-instalar-dependências)
  - [3. Configurar o tsconfig.json](#3-configurar-o-tsconfigjson)
  - [4. Estrutura de pastas](#4-estrutura-de-pastas)
  - [5. Configurar variáveis de ambiente](#5-configurar-variáveis-de-ambiente)
- [Utilizar este repositório](#utilizar-este-repositório)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Rodar o projeto](#rodar-o-projeto)
- [Como funciona a autenticação](#como-funciona-a-autenticação)
- [Arquitetura para troca de provedor](#arquitetura-para-troca-de-provedor)
- [Integrar com banco de dados — syncUserAction](#integrar-com-banco-de-dados--syncuseraction)

---

## Visão Geral

| Recurso | Status |
|--------|--------|
| Login e-mail/senha | ✅ |
| Cadastro e-mail/senha | ✅ |
| Login com Google | ✅ |
| Login com Facebook | ✅ |
| Login com Microsoft (Outlook) | ✅ |
| Sessão via cookie httpOnly | ✅ |
| Validação de formulários (Zod) | ✅ |
| Notificações toast | ✅ |
| Pronto para integração com backend externo | ✅ |

---

## Criar o projeto do zero

### 1. Criar o projeto Next.js

```bash
npx create-next-app@latest nome_projeto
```

Durante a criação, escolha:

```
Would you like to use TypeScript? → Yes
Would you like to use ESLint? → Yes
Would you like to use Tailwind CSS? → Yes
Would you like your code inside a `src/` directory? → Yes
Would you like to use App Router? → Yes
Would you like to customize the import alias (@/*)? → Yes (mantenha @/*)
```

---

### 2. Instalar dependências

```bash
# Firebase SDK
npm install firebase

# Ícones (Google, Facebook, Microsoft)
npm install react-icons

# Validação de formulários
npm install zod
```

---

### 3. Configurar o tsconfig.json

O Next.js já configura o alias `@/*` automaticamente. Verifique se o seu `tsconfig.json` contém:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ]
}
```

Isso permite usar `@/components/...`, `@/lib/...`, etc. em vez de caminhos relativos longos como `../../../lib/...`.

---

### 4. Estrutura de pastas

Crie a seguinte estrutura dentro de `src/`:

```
src/
├── app/
│   ├── layout.tsx              ← Layout raiz com fontes e ToastProvider
│   ├── globals.css             ← Estilos globais + Tailwind
│   ├── favicon.ico
│   ├── (auth)/                 ← Grupo de rotas de autenticação
│   │   ├── page.tsx            ← Redireciona / para /login
│   │   ├── login/
│   │   │   └── page.tsx        ← Página de login
│   │   └── signup/
│   │       └── page.tsx        ← Página de cadastro
│   └── (site)/                 ← Rotas protegidas (após login)
│       └── page/
│           └── page.tsx        ← Página inicial do usuário autenticado
│
├── actions/
│   └── auth/
│       ├── session-action.ts   ← Cria/deleta o cookie auth_token no servidor
│       └── user-action.ts      ← Sincroniza dados do usuário com backend externo
│
├── components/
│   └── layouts/
│       ├── Button.tsx          ← Botão reutilizável com 4 variantes
│       └── toast.tsx           ← Provider e hook de notificações toast
│
├── hooks/
│   ├── useAuth.ts              ← Orquestra o fluxo de login/cadastro/social
│   └── useSubmitForm.ts        ← Hook genérico de formulário com validação Zod
│
├── lib/
│   ├── firebase.js             ← Inicializa o Firebase e os provedores OAuth
│   ├── api-fetch.ts            ← Fetch wrapper que injeta o Bearer token no header
│   ├── action-wrapper.ts       ← Wrapper de Server Actions com tratamento de erros
│   └── actions-handler.ts      ← Handler que exibe toast a partir de respostas do servidor
│
├── services/
│   └── authService.ts          ← Funções do Firebase Auth (login, registro, logout, social)
│
└── types/
    ├── api.ts                  ← Interface ServerResponse<T> padrão do backend
    └── register-data.ts        ← Tipos LoginData e RegisterData dos formulários
```

**O que colocar em cada pasta:**

| Pasta | O que vai aqui |
|-------|---------------|
| `app/` | Páginas e layouts do App Router. Subpastas entre `()` são grupos de rotas e não aparecem na URL. |
| `actions/` | Server Actions do Next.js (`"use server"`). Código que roda exclusivamente no servidor, como salvar cookies e chamar APIs internas. |
| `components/` | Componentes React reutilizáveis. Separe por domínio (ex: `layouts/`, `forms/`, `ui/`). |
| `hooks/` | Custom hooks React (`use...`). Lógica de estado e efeitos reutilizáveis nos componentes cliente. |
| `lib/` | Utilitários e configurações de bibliotecas externas (Firebase, fetch, wrappers). |
| `services/` | Funções que chamam APIs externas ou SDKs (Firebase Auth, REST APIs). Sem estado React. |
| `types/` | Tipos e interfaces TypeScript compartilhados entre múltiplos arquivos. |

---

### 5. Configurar variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto (ele já está no `.gitignore` por padrão):

```env
# Firebase — encontre no console do Firebase em Configurações do Projeto
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
NEXT_PUBLIC_FIREBASE_APP_ID=1:000000000000:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# URL base da sua API backend (ex: Spring Boot)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> As variáveis com prefixo `NEXT_PUBLIC_` ficam disponíveis no cliente. As sem prefixo só ficam disponíveis no servidor.

> Possui dúvidas de como pegar as variáveis no Firebase? Acesso o link: https://gemini.google.com/share/e9a7e9251301

No Firebase Console, habilite os provedores de login em **Authentication > Sign-in method**:
- E-mail/senha
- Google
- Facebook (requer App ID e App Secret do Meta)
- Microsoft (requer Client ID e Client Secret do Azure)

---

## Utilizar este repositório

### Pré-requisitos

- Node.js 18+
- Conta no [Firebase](https://console.firebase.google.com)
- Git

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/authenticator-firebase.git
cd authenticator-firebase

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de variáveis de ambiente
# Crie um arquivo .env.local na raiz e preencha com as credenciais do seu projeto Firebase
```

Veja o modelo de variáveis na seção [Configurar variáveis de ambiente](#5-configurar-variáveis-de-ambiente) acima.

### Rodar o projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

Acesse [http://localhost:3000](http://localhost:3000). Você será redirecionado automaticamente para `/login`.

---

## Como funciona a autenticação

O fluxo completo após um login (e-mail/senha ou social) é:

```
Usuário preenche formulário
        ↓
useSubmitForm  →  valida com Zod
        ↓
useAuth.handleLoginAction
        ↓
authService.loginWithEmail  →  Firebase Auth SDK
        ↓
createSession(token)  →  Server Action  →  cookie httpOnly "auth_token" (7 dias)
        ↓
syncUserAction(userData)  →  Server Action  →  backend externo (opcional)
        ↓
router.push("/page")  →  usuário autenticado
```

**Componentes principais:**

- **`src/services/authService.ts`** — Chama o Firebase SDK. Padroniza o retorno de qualquer provedor no tipo `AuthUser` (`externalAuthId`, `email`, `displayName`, `photoURL`, `token`, `authProvider`).

- **`src/actions/auth/session-action.ts`** — Server Action que grava o `idToken` do Firebase em um cookie `httpOnly`, impedindo acesso via JavaScript no cliente. O cookie dura 7 dias.

- **`src/lib/api-fetch.ts`** — Wrapper do `fetch` que lê o cookie `auth_token` e injeta automaticamente o header `Authorization: Bearer <token>` em toda requisição ao backend.

- **`src/lib/action-wrapper.ts`** — Envolve Server Actions para capturar erros de autenticação (401/403) e redirecionar para `/login` automaticamente.

- **`src/lib/actions-handler.ts`** — Recebe a resposta de uma Server Action e exibe toast de sucesso ou erro com base no campo `error` da resposta.

---

## Arquitetura para troca de provedor

O projeto foi arquitetado para que **trocar o provedor de autenticação no futuro não exija alterações no restante da aplicação** — hooks, actions, backend e banco de dados continuam funcionando sem modificações.

Toda a lógica do Firebase está isolada em `src/services/authService.ts`. Qualquer novo provedor (Auth0, Cognito, Supabase, etc.) só precisa implementar a mesma interface `AuthUser` e o restante do código não sabe — nem precisa saber — que o provedor mudou.

### Por que `externalAuthId` e `authProvider`?

```ts
const mapFirebaseUser = async (user: any, provider: string): Promise<AuthUser> => {
  return {
    externalAuthId: user.uid,   // ID único gerado pelo provedor externo
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    token: await user.getIdToken(),
    authProvider: provider,     // Ex: FIREBASE_GOOGLE, FIREBASE_EMAIL
  };
};
```

**`externalAuthId`** — em vez de salvar `uid` (termo específico do Firebase) no banco, o campo tem um nome neutro que representa "o ID que o provedor de autenticação externo atribuiu a este usuário". Se amanhã o provedor mudar para Auth0, esse campo receberá o `sub` do Auth0 sem que nenhuma coluna do banco precise ser renomeada.

**`authProvider`** — identifica de onde veio o login (ex: `FIREBASE_GOOGLE`, `AUTH0_GOOGLE`). Isso permite que o backend saiba com qual provedor vincular o usuário e, no futuro, suporte múltiplos provedores em paralelo ou uma migração gradual sem perder o histórico de origem de cada conta.

### O que muda ao trocar de provedor

| O que muda | O que **não** muda |
|---|---|
| `src/services/authService.ts` | `useAuth.ts` e todos os hooks |
| `src/lib/firebase.js` | Todas as Server Actions |
| Variáveis de ambiente do Firebase | `syncUserAction` e integração com backend |
| | Banco de dados (colunas `external_auth_id` e `auth_provider`) |

---

## Integrar com banco de dados — syncUserAction

A função `syncUserAction` em `src/actions/auth/user-action.ts` é chamada automaticamente após cada login ou cadastro. Ela recebe os dados do usuário vindos do Firebase e é o ponto de integração com o seu banco de dados.

**Por padrão ela está sem efeito** (retorna um objeto mock). Para ativá-la, descomente o bloco e substitua pelo endpoint da sua API:

```ts
// src/actions/auth/user-action.ts
export async function syncUserAction(userData: User) {
  return actionWrapper(async () => {
    const data = await api<Result>("/users/sync", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return data;
  }, "SyncUser");
}
```

O objeto `userData` enviado ao backend contém:

| Campo | Descrição |
|-------|-----------|
| `externalAuthId` | UID único gerado pelo Firebase (use como chave de vínculo) |
| `email` | E-mail do usuário |
| `displayName` | Nome completo (vazio em cadastros por e-mail) |
| `photoURL` | URL do avatar (disponível nos logins sociais) |
| `authProvider` | Origem do login: `FIREBASE_EMAIL`, `FIREBASE_GOOGLE`, `FIREBASE_FACEBOOK`, `FIREBASE_OUTLOOK` |

O campo `externalAuthId` é o vínculo entre o Firebase e o seu banco. Grave-o na tabela de usuários para conseguir identificar o usuário nas requisições futuras (o token JWT do Firebase carrega esse ID no campo `sub`).
