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
