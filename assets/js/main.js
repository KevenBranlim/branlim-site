/* ===================== CONFIGURAÇÃO — edite aqui ===================== */
const CONFIG = {
  cidade:        "Estreito/MA",
  duracao:       "00:41",                 // ex.: "01:30" (vazio = não aparece)
  whatsapp:      "5599991540347",         // só números, com DDI+DDD
  whatsappTexto: "(99) 99154-0347",     // como o número aparece na página
  email:         "kevenbranlim@hotmail.com",
  instagram:     "branlimm",        // sem o @
  showreel:      "https://youtu.be/AU0lhWTPHEs",  // link do YouTube, Vimeo ou arquivo .mp4
  corDestaque:   "#1450C8"                // #1450C8 · #4A9BE8 · #070B1F
};
/* ===================================================================== */

(function(){
  const $ = s => document.querySelector(s);
  document.documentElement.style.setProperty('--accent', CONFIG.corDestaque);
  document.querySelectorAll('[data-cfg]').forEach(el => { const v = CONFIG[el.dataset.cfg]; if (v) el.textContent = v; });
  $('#ano').textContent = new Date().getFullYear();

  // Links de contato
  const real = v => v && !v.startsWith('[');
  if (real(CONFIG.duracao)) $('.meta__dur').hidden = false;
  if (CONFIG.whatsapp) $('#lnk-whats').href = 'https://wa.me/' + CONFIG.whatsapp;
  if (real(CONFIG.email)) $('#lnk-email').href = 'mailto:' + CONFIG.email;
  if (real(CONFIG.instagram)) $('#lnk-insta').href = 'https://instagram.com/' + CONFIG.instagram;

  // Timecode "REC" correndo no hero
  const tc = $('#tc'), t0 = performance.now(), p = n => String(n).padStart(2, '0');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      const f = Math.floor((performance.now() - t0) / (1000 / 24)); // 24 fps
      tc.textContent = p(Math.floor(f / 86400)) + ':' + p(Math.floor(f / 1440) % 60) + ':' + p(Math.floor(f / 24) % 60) + ':' + p(f % 24);
    }, 1000 / 24);
  }

  // Showreel: YouTube, Vimeo ou .mp4
  function embedUrl(u){
    let m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (m) return { type: 'iframe', src: 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1&rel=0' };
    m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return { type: 'iframe', src: 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1' };
    return { type: 'video', src: u };
  }
  $('#play').addEventListener('click', () => {
    const player = $('#player');
    if (!CONFIG.showreel) { player.querySelector('.player__label--l').textContent = 'Showreel em breve'; return; }
    const e = embedUrl(CONFIG.showreel);
    const el = document.createElement(e.type);
    el.src = e.src;
    if (e.type === 'iframe') { el.allow = 'autoplay; fullscreen; picture-in-picture'; el.allowFullscreen = true; el.title = 'Showreel BRANLIM Films'; }
    else { el.controls = true; el.autoplay = true; el.playsInline = true; }
    player.appendChild(el);
  });

  // Trabalhos: vídeo abre na janela por cima do site
  const lb = $('#lightbox'), lbFrame = $('#lightbox-frame');
  function closeLightbox(){ if (lb.open) lb.close(); }
  lb.addEventListener('close', () => { lbFrame.innerHTML = ''; });          // para o vídeo ao fechar
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); }); // clique fora fecha
  lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  document.querySelectorAll('[data-video]').forEach(card => {
    card.addEventListener('click', ev => {
      if (typeof lb.showModal !== 'function') return; // navegador antigo: segue o link
      ev.preventDefault();
      const e = embedUrl(card.dataset.video);
      const el = document.createElement(e.type);
      el.src = e.src + (e.type === 'iframe' && e.src.includes('youtube') ? '&playsinline=1' : '');
      if (e.type === 'iframe') { el.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; el.allowFullscreen = true; el.title = card.getAttribute('aria-label') || 'Vídeo'; }
      else { el.controls = true; el.autoplay = true; el.playsInline = true; }
      lb.classList.toggle('lightbox--vertical', card.hasAttribute('data-vertical'));
      lbFrame.appendChild(el);
      lb.showModal();
    });
  });

  // Máscara simples para o telefone
  $('#f-whats').addEventListener('input', e => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 11);
    e.target.value = d.length > 10 ? `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
                   : d.length > 6  ? `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
                   : d.length > 2  ? `(${d.slice(0,2)}) ${d.slice(2)}` : d;
  });

  // Formulário → mensagem pronta no WhatsApp (ou e-mail, se não houver número)
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, note = $('#form-note');
    if (!f.nome.value.trim()) { f.nome.focus(); note.textContent = 'Preencha seu nome para continuar.'; return; }
    const texto = `Olá, Branlim! Quero um orçamento.\n\n` +
      `Nome: ${f.nome.value.trim()}\n` +
      (f.whats.value ? `WhatsApp: ${f.whats.value}\n` : '') +
      `Tipo de projeto: ${f.tipo.value}\n` +
      (f.msg.value.trim() ? `\n${f.msg.value.trim()}` : '');
    if (CONFIG.whatsapp) {
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
      note.textContent = 'Abrindo o WhatsApp…';
    } else if (real(CONFIG.email)) {
      location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Pedido de orçamento — ' + f.tipo.value) + '&body=' + encodeURIComponent(texto);
    } else {
      note.textContent = 'Configure o WhatsApp ou o e-mail no CONFIG do site.';
    }
  });
})();
