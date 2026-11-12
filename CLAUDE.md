# CLAUDE.md — site da BRANLIM Films

Contexto para o Claude retomar o trabalho neste repositório sem precisar do histórico da conversa.

## Quem é o cliente e como falar com ele

- O dono é o Keven, da BRANLIM Films, produtora audiovisual em Estreito/MA.
- Ele chama o Claude de **"B. Corp"** ou **"B.C"**. Responda **em português do Brasil**, num tom leve e animado, e chame ele de "chefe" de vez em quando.
- Ele não é programador. Explique sem jargão, em passos curtos, e sempre mande o link do site no fim.
- Quando ele diz que não vê uma mudança, quase sempre é o cache do navegador. Confira no site ao vivo
  (Playwright num `newContext()` novo) e mande abrir em **aba anônima** ou com `?v=N` na URL.

## O site

- No ar em: **https://kevenbranlim.github.io/branlim-site/** (GitHub Pages, branch `main`, raiz).
- Link curto do cliente: **https://bit.ly/branlim** (criado por ele no Bitly, redireciona para o site). É o link que ele divulga.
- É um site estático, sem build: `index.html` + `assets/css/style.css` + `assets/js/main.js` + `assets/img/logo.svg` (e `logo.png`).
- `README.md` é a documentação técnica para programadores. Mantenha atualizado quando a estrutura mudar.
- Seções: hero (slogan), Showreel, Serviços ("O que eu filmo"), Trabalhos, Processo, Contato, Rodapé.

### Conteúdo atual (decisões do cliente)

- Slogan: **"Transformo sua história em algo que o tempo não apaga."** Aparece no `<h1>`, no rodapé e no `og:title`.
- Texto na **primeira pessoa** ("O que eu filmo", "eu respondo com uma proposta"). Não volte para "a gente".
- Contatos (bloco `CONFIG` em `main.js`, repetidos no HTML como fallback): cidade Estreito/MA,
  WhatsApp `5599991540347` / (99) 99154-0347, Instagram `branlimm`. O e-mail público está no `CONFIG`.
- O formulário não tem backend: abre o WhatsApp com a mensagem "Olá, Branlim! Quero um orçamento." e os dados preenchidos.
- A logo é o SVG vetorizado do PNG enviado pelo cliente (BRANLIM FILMS ™, horizontal, sombra cinza no "A").
- Showreel: YouTube `AU0lhWTPHEs` (`CONFIG.showreel`), capa `maxresdefault.jpg` em `.player__cover` no `index.html`.
- **Pendente:** duração do showreel (`CONFIG.duracao`, vazio = escondida). O cliente também pode querer domínio próprio (registro.br).

### Trabalhos (6 cards, todos reais)

| Código | Título | Categoria | Vídeo |
|---|---|---|---|
| BRL_01 | Jhenyfer Morais — Fashion Film | Redes | YouTube `P6vm5vVWFes` |
| BRL_02 | Projeto Autoral — Anúncio | Publicidade | Vimeo `1243435368` (vertical) |
| BRL_03 | Whannatha e Sebastião Dório — Casamento | Eventos | YouTube `CCgz_bMiD_o` |
| BRL_04 | Pedro e Thalia — Casamento | Eventos | YouTube `VbJ_9yU472k` |
| BRL_05 | Ricks — Apresentação de marca | Publicidade | Vimeo `1243567327` (vertical) |
| BRL_06 | Eduarda Machado — Aniversário | Eventos | YouTube `McqRgQWICBQ` |

- Os códigos BRL_0X estão **escondidos** por CSS (`.work__tag--tl{display:none}`), a pedido do cliente. A etiqueta "9:16" continua visível.
- O card da Dra. Sabrina Sampaio foi **apagado** a pedido do cliente. Não recoloque sem ele pedir.
- Categorias usadas: Redes, Publicidade, Eventos, Institucional.

## Como adicionar ou trocar um trabalho

O cliente manda: link, cliente, projeto e categoria. Título do card = `Cliente — Projeto`.

1. **Cheque o vídeo antes de montar:**
   - YouTube: `https://www.youtube.com/oembed?url=<link>&format=json` dá título e formato (largura > altura = horizontal).
     O status na página `watch` deve ser `LOGIN_REQUIRED` (normal, é o bloqueio anti-robô).
     `UNPLAYABLE` / "Vídeo indisponível" quer dizer vídeo barrado (geralmente direitos autorais da música).
     Nesse caso, sugira subir no Vimeo.
   - Vimeo: `https://vimeo.com/api/oembed.json?url=https://vimeo.com/<ID>` dá formato e `thumbnail_url`.
     Do código de incorporação que o cliente cola, use só o ID numérico.
2. **Capa:**
   - YouTube: `https://i.ytimg.com/vi/<ID>/maxresdefault.jpg`. Se der 404, use `sddefault.jpg` (o card 16:9 corta as faixas pretas).
     Vídeo recém-enviado pode ter só `frame0.jpg` até o YouTube processar.
   - Shorts: a `maxresdefault` já vem com o vídeo no centro e as laterais desfocadas. Use direto num `.work__frame` normal.
   - Vimeo vertical: use `.work__frame work__frame--vertical` com duas imagens (`.work__bg` desfocada + `.work__fg`)
     e o `thumbnail_url` trocando o sufixo para `-d_640`.
   - Olhe a capa (Read na imagem) antes de publicar. Se ela passar uma impressão ruim, avise o cliente.
3. **Card:** copie um card existente do mesmo tipo em `index.html`.
   - Atributos do `<a>`: `href` (link público), `data-video` (YouTube: link normal; Vimeo: `https://player.vimeo.com/video/<ID>`),
     `target="_blank" rel="noopener"` e `aria-label="Assistir: <título>"`.
   - Vídeo vertical: acrescente `data-vertical` no `<a>` e o `<span class="work__tag work__tag--br">9:16</span>`.
   - Ao trocar um card por outro, substitua a linha inteira e confira a lista de títulos depois.
     Cuidado com comentários que citam "BRL_0X": não edite o comentário por engano.
4. A janela de vídeo (`<dialog id="lightbox">`) já trata YouTube, Vimeo e `.mp4` (função `embedUrl` em `main.js`).

## Teste antes de publicar

- Sirva localmente com `python3 -m http.server 8766 --directory /home/user/branlim-site` e teste com Playwright (Chromium já instalado).
  - Teste em 1440×900 e em 390×844.
  - Confira: lista de títulos, `naturalWidth` da capa, abertura do lightbox com `src` certo, `document.body.scrollWidth` sem rolagem lateral e nenhum `pageerror`.
  - Escreva o teste num arquivo `.js` no scratchpad, não em `node -e` com aspas aninhadas.
- O YouTube e o Vimeo **bloqueiam o servidor do Claude** ("Video unavailable" / "couldn't verify the security of your connection").
  Isso não indica problema no vídeo. Peça ao cliente para testar no celular e diga isso com clareza.

## Publicar

- O `git config` não tem usuário. Use o mesmo autor dos commits existentes: `git log -1 --format='%an <%ae>'`.
- Mensagens de commit em português.
- Depois de `git push origin main`, espere o Pages: repita `curl` em `https://kevenbranlim.github.io/branlim-site/?v=$RANDOM`
  a cada 15 s até o texto novo aparecer (normalmente 30–75 s).
- Ao mudar CSS ou JS, **aumente o `?v=AAAAMMDDNN`** das duas linhas no `index.html` (cache-busting).
- O Claude não consegue mexer nas configurações do GitHub Pages pela API (403). Se precisar, guie o cliente.
- `*.zip` está no `.gitignore`. Os pacotes de entrega (`git archive --format=zip --prefix=branlim-site/ -o branlim-site-codigo.zip HEAD`) não vão para o repositório.

## Visual (não quebrar)

- Cores em `:root`: `--noite #070B1F`, `--noite-2 #0B1230`, `--royal #1450C8`, `--ceu #4A9BE8`, `--gelo #DCE8F7`, `--papel #ECEBE6`.
- Fontes: Outfit (texto) e IBM Plex Mono (rótulos), via Google Fonts.
- Título do hero: `clamp(2.4rem,6vw,5.75rem)`, `max-width:17ch`, `text-wrap:balance`. Fica em 3 linhas no desktop e no celular.
  Se o slogan mudar de tamanho, ajuste e confira por screenshot.
- Breakpoint de celular: 640px (no menu ficam só a logo e o botão "Orçamento").
