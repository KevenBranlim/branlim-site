# BRANLIM Films — site

Landing page da BRANLIM Films, produtora audiovisual em Estreito/MA.
*Transformo sua história em algo que o tempo não apaga.*

Site estático: HTML + CSS + JavaScript puro. Sem framework, sem build, sem dependências.

## Estrutura

```
.
├── index.html              # Marcação de todas as seções
├── assets/
│   ├── css/style.css       # Estilos (variáveis de cor em :root)
│   ├── js/main.js          # CONFIG + comportamentos
│   └── img/logo.svg        # Logo vetorial (logo.png: versão transparente)
├── .nojekyll               # Desliga o Jekyll no GitHub Pages
└── README.md
```

## Rodar localmente

Qualquer servidor estático serve:

```bash
python3 -m http.server 8000
# ou
npx serve .
```

Depois abra http://localhost:8000. Também funciona abrindo o `index.html` direto no navegador.

## Deploy

Envie a pasta inteira para a raiz do host (ex.: `public_html/`), mantendo a estrutura de `assets/`.
No GitHub Pages está publicado a partir da branch `main`, pasta `/ (root)`.

## Cache

O `index.html` carrega `style.css` e `main.js` com `?v=AAAAMMDDNN`.
Ao alterar CSS ou JS, aumente esse número nas duas linhas para que os
visitantes recebam a versão nova na hora, sem ficar com a antiga guardada.

## Configuração (`assets/js/main.js`)

| Chave           | Uso                                                                 |
|-----------------|---------------------------------------------------------------------|
| `cidade`        | Texto do eyebrow do hero                                            |
| `duracao`       | Duração exibida no cabeçalho do showreel                            |
| `whatsapp`      | Número só com dígitos (DDI+DDD), usado em `wa.me`                   |
| `whatsappTexto` | Número formatado exibido na página                                  |
| `email`         | `mailto:` e fallback do formulário                                  |
| `instagram`     | Usuário sem `@`                                                     |
| `showreel`      | URL do YouTube, Vimeo ou `.mp4`; vazio mostra "Showreel em breve"   |
| `corDestaque`   | Sobrescreve a variável CSS `--accent`                               |

Elementos com `data-cfg="chave"` recebem o valor correspondente do `CONFIG`.
Os mesmos valores também estão escritos no HTML como fallback sem JavaScript.

## Comportamentos (`main.js`)

- **Timecode REC** no hero, a 24 fps (desligado com `prefers-reduced-motion`).
- **Showreel**: converte links do YouTube/Vimeo em `iframe` embed, ou cria `<video>` para arquivos.
- **Máscara de telefone** no campo WhatsApp: `(00) 00000-0000`.
- **Formulário**: sem backend. Monta uma mensagem e abre `wa.me/<número>?text=...`;
  sem número configurado, cai para `mailto:`. Para receber num backend
  (Formspree, Netlify Forms etc.), substitua o handler de `submit`.

## Design

- **Cores** (`:root` em `style.css`): `--noite #070B1F`, `--noite-2 #0B1230`, `--royal #1450C8`,
  `--ceu #4A9BE8`, `--gelo #DCE8F7`, `--papel #ECEBE6`.
- **Fontes**: Outfit (300/400/700) e IBM Plex Mono (400/500), via Google Fonts.
- **Layout**: responsivo com `clamp()`, grid `auto-fit` e `flex-wrap`; breakpoint em 640px.

## Pendências de conteúdo

- Link e duração do showreel.
- Os 6 cards de **Trabalhos** ainda usam `[Cliente] — [Projeto]` e gradientes no lugar dos frames.
  Para cada card, troque título, categoria e `href`, e opcionalmente coloque
  `<img src="..." alt="..." loading="lazy">` dentro de `.work__frame`.
