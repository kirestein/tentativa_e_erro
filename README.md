# Fazendo Matemática

Plataforma de atividades de matemática (PDFs por tema) e jogos educativos em
Pygame rodando direto no navegador.

- **Público**: `/`, `/atividades`, `/jogos` — navegação e visualização de
  conteúdo publicado.
- **Área do professor**: `/admin` — login com Google, cadastro e edição de
  atividades e jogos.

## Stack

Next.js (App Router) + Supabase (Auth, Postgres, Storage) + Netlify.

## Primeiros passos

Veja o guia completo em [`SETUP.md`](SETUP.md) — cobre criação do projeto
Supabase, login com Google, variáveis de ambiente e deploy no Netlify.

Para publicar um jogo em Pygame, veja [`docs/JOGOS.md`](docs/JOGOS.md).

```bash
npm install
npm run dev
```
