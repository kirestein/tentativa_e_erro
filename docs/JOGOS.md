# Como publicar um jogo em Pygame na plataforma

Navegadores não executam Python nativamente, então cada jogo em Pygame
precisa ser convertido para **WebAssembly** com a ferramenta [pygbag](https://pygame-web.github.io/).
O resultado é uma pasta com `index.html` + arquivos estáticos, que a área
administrativa envia para o Supabase Storage e a plataforma exibe dentro de
um `<iframe>`.

## 1. Instalar o pygbag

```bash
pip install pygbag
```

## 2. Preparar o jogo

O pygbag espera um projeto com um arquivo principal assíncrono. Se o seu jogo
usa o loop clássico do Pygame (`while rodando: ...`), adapte o `main.py` para
o formato assíncrono exigido pelo navegador:

```python
import asyncio
import pygame

async def main():
    pygame.init()
    tela = pygame.display.set_mode((800, 600))
    rodando = True
    while rodando:
        for evento in pygame.event.get():
            if evento.type == pygame.QUIT:
                rodando = False

        # ... lógica e desenho do jogo ...

        pygame.display.flip()
        await asyncio.sleep(0)  # obrigatório: devolve o controle ao navegador

    pygame.quit()

asyncio.run(main())
```

Estrutura recomendada de pastas:

```
meu-jogo/
  main.py
  assets/
    imagem.png
    som.wav
```

### O pygbag sempre executa um arquivo chamado `main.py`

Não importa qual arquivo você passar na linha de comando (`pygbag
pygame_game.py`, por exemplo) — no navegador ele **sempre** roda
`main.py` na raiz do projeto. Se o seu repositório já tem um `main.py`
para outra coisa (ex: uma versão de terminal do jogo), **não o edite**:
crie uma pasta separada só para o build web, com seu próprio `main.py`
mínimo que chama a função principal do jogo:

```python
# web_build/main.py
import asyncio
import pygame  # IMPORTANTE: veja a nota abaixo

from meu_jogo import main  # sua função async real, definida em outro arquivo

asyncio.run(main())
```

Copie os demais arquivos `.py` (e a pasta `assets/`) do jogo para dentro
dessa pasta antes de rodar o pygbag nela.

### `main.py` precisa importar `pygame` explicitamente

O pygbag decide quais bibliotecas baixar/compilar **lendo o texto** do
`main.py`, não analisando de verdade os imports do projeto inteiro. Se o
`main.py` só faz `from meu_jogo import main` (sem a palavra `pygame`
aparecer nele), o pygbag não carrega o pacote completo do Pygame, e o
jogo quebra em tempo de execução com `AttributeError: module 'pygame'
has no attribute 'init'`. Solução: sempre inclua `import pygame` (mesmo
que não seja usado diretamente) no `main.py` do build web.

## 3. Gerar o build web

Dentro da pasta do jogo:

```bash
pygbag --build .
```

Isso cria `build/web/` com `index.html`, um arquivo `.apk` (na verdade um zip
com o código Python e os assets) e outros arquivos de suporte.

Teste localmente antes de subir:

```bash
pygbag .
```

Isso abre um servidor local e mostra o jogo rodando no navegador. Se
funcionar aqui, funcionará na plataforma.

## 4. Compactar para upload

**Importante:** o `.zip` precisa ter o `index.html` na raiz — não dentro de
uma subpasta. Entre na pasta `build/web` e compacte o *conteúdo* dela:

```bash
cd build/web
zip -r ../../meu-jogo.zip .
cd ../..
```

## 5. Subir na plataforma

1. Acesse `/admin/jogos/nova` (logado com sua conta Google de administrador).
2. Preencha título, tema e descrição.
3. Selecione o arquivo `meu-jogo.zip`.
4. Salve — os arquivos são enviados diretamente do navegador para o Supabase
   Storage (bucket `games`), e o jogo já aparece publicado em `/jogos`.

## Limitações a ter em mente

- Nem todo recurso do Pygame tem suporte completo no navegador (ex: alguns
  módulos de áudio/rede específicos). Teste sempre com `pygbag .` antes de
  publicar.
- O primeiro carregamento pode demorar alguns segundos, pois o navegador
  baixa o runtime Python + os assets do jogo.
- Ao **substituir o build** de um jogo já publicado, os arquivos antigos
  continuam ocupando espaço no Storage (não são apagados automaticamente).
  Isso não afeta o funcionamento, só o uso de armazenamento.
