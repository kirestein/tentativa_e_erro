# Guia de configuração — Fazendo Matemática

Passo a passo para colocar a plataforma no ar: Supabase (login, banco de
dados, armazenamento) + Netlify (hospedagem).

## 1. Criar o projeto no Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e clique em **New
   project**.
2. Anote a **senha do banco** gerada (não é usada pelo app, mas guarde por
   segurança).
3. Aguarde o projeto ficar pronto (1–2 minutos).

## 2. Rodar o schema do banco

1. No painel do projeto, vá em **SQL Editor > New query**.
2. Cole todo o conteúdo do arquivo [`supabase/schema.sql`](supabase/schema.sql)
   deste repositório e clique em **Run**.
3. Isso cria as tabelas `activities`, `games`, `admin_users`, as políticas de
   segurança (RLS) e os buckets de armazenamento `pdfs` e `games`.

## 3. Cadastrar seu email como administrador

Ainda no SQL Editor, rode (trocando pelo seu email do Google):

```sql
insert into public.admin_users (email) values ('seu-email@gmail.com');
```

Só quem estiver nessa tabela consegue entrar em `/admin`.

## 4. Ativar login com Google

### 4.1 Criar credenciais no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e crie
   um projeto (ou use um existente).
2. Vá em **APIs & Services > OAuth consent screen**, escolha **External**,
   preencha nome do app e seu email, e publique.
3. Vá em **APIs & Services > Credentials > Create Credentials > OAuth client
   ID**, tipo **Web application**.
4. Em **Authorized redirect URIs**, adicione a URL de callback do Supabase.
   Ela tem este formato (troque `SEU-PROJETO`):
   ```
   https://SEU-PROJETO.supabase.co/auth/v1/callback
   ```
   (você encontra a URL exata em Supabase > Authentication > Sign In / Up >
   Google, depois de habilitar o provedor no passo seguinte).
5. Copie o **Client ID** e o **Client secret** gerados.

### 4.2 Configurar no Supabase

1. No Supabase, vá em **Authentication > Sign In / Up > Auth Providers >
   Google**.
2. Ative o provedor e cole o **Client ID** e **Client secret** do Google.
3. Em **Authentication > URL Configuration**, defina:
   - **Site URL**: a URL do seu site (ex: `https://fazendomatematica.netlify.app`,
     ou `http://localhost:3000` enquanto testa localmente).
   - **Redirect URLs**: adicione tanto a URL de produção quanto
     `http://localhost:3000/auth/callback` (para testar localmente).

## 5. Configurar variáveis de ambiente localmente

1. Copie `.env.local.example` para `.env.local`.
2. Preencha com os valores de **Project Settings > API** no Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (a chave `anon public`)

## 6. Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. Para entrar na área administrativa, vá em
`http://localhost:3000/admin` e faça login com a conta Google cadastrada no
passo 3.

## 7. Publicar no Netlify

1. Suba este repositório para o GitHub (ou GitLab/Bitbucket).
2. No [Netlify](https://app.netlify.com), clique em **Add new site > Import
   an existing project** e conecte o repositório.
3. O Netlify detecta automaticamente o Next.js (o `netlify.toml` já está
   configurado com o plugin oficial). Não precisa mudar nada no build.
4. Em **Site settings > Environment variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Faça o deploy.
6. Depois que o site estiver no ar, volte no Supabase (passo 4.2) e no Google
   Cloud Console e atualize as URLs de redirecionamento/Site URL com o
   domínio real do Netlify (e o domínio próprio, se configurar um).

## 8. Publicar conteúdo

- **Atividades**: `/admin/atividades/nova` — título, tema, descrição e PDF.
- **Jogos em Pygame**: veja o guia completo em [`docs/JOGOS.md`](docs/JOGOS.md)
  para converter o jogo com `pygbag` antes de subir.

## Resumo da arquitetura

- **Next.js** — frontend público e área administrativa, hospedado no Netlify.
- **Supabase Auth** — login com Google, restrito a emails na tabela
  `admin_users`.
- **Supabase Postgres** — dados de atividades e jogos (título, tema,
  descrição, status de publicação).
- **Supabase Storage** — arquivos PDF e os builds web (WebAssembly) dos
  jogos, ambos em buckets públicos para leitura.
- **pygbag** — converte jogos Pygame para WebAssembly, permitindo rodá-los
  direto no navegador dentro de um `<iframe>`.
