/**
 * app.js — Portfolio Videomaker — Nicolas Godoy
 * Renderização síncrona imediata com dados embutidos VIDEOS_DATA,
 * parser de URLs (YouTube, Instagram, Google Drive, MP4),
 * miniaturas dinâmicas, filtros e modal com transição film-burn.
 */

/* ============================================================
   EMBEDDED DATA — Renderização síncrona sem depender de fetch
   ============================================================ */

const VIDEOS_DATA = [
  {
    "id": 1,
    "title": "@RyuTheRunner",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20beco%20ryu_1_prob4.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20beco%20ryu_1_prob4.mp4",
    "duration": ""
  },
  {
    "id": 2,
    "title": "@Dubatuq feat @99",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20dubatuq%2099_prob4.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20dubatuq%2099_prob4.mp4",
    "duration": ""
  },
  {
    "id": 3,
    "title": "@BurguerExpo Dia 1",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20BURGER%20DIA%202.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20BURGER%20DIA%202.mp4",
    "duration": ""
  },
  {
    "id": 4,
    "title": "@BurgerExpo Dia 2",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20burger%20dia%201-2.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20burger%20dia%201-2.mp4",
    "duration": ""
  },
  {
    "id": 5,
    "title": "@Supernova",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20beco%20supernova_prob4_1_prob4.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20beco%20supernova_prob4_1_prob4.mp4",
    "duration": ""
  },
  {
    "id": 6,
    "title": "@Peers Band",
    "category": "Casamentos",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20cerimonia.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20cerimonia.mp4",
    "duration": ""
  },
  {
    "id": 7,
    "title": "@VulgoFK",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20VULGO%20FK_prob4.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20VULGO%20FK_prob4.mp4",
    "duration": ""
  },
  {
    "id": 8,
    "title": "@Peers Band",
    "category": "Casamentos",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20cerimonia1.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20cerimonia1.mp4",
    "duration": ""
  },
  {
    "id": 9,
    "title": "@Dubatuq",
    "category": "Casamentos",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20dubatuq%20casamento_1_prob4.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20dubatuq%20casamento_1_prob4.mp4",
    "duration": ""
  },
  {
    "id": 10,
    "title": "@Finesse",
    "category": "Baladas",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20finesse_1_prob4.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20finesse_1_prob4.mp4",
    "duration": ""
  },
  {
    "id": 11,
    "title": "@Finesse",
    "category": "Baladas",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20finesse_prob4.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20finesse_prob4.mp4",
    "duration": ""
  },
  {
    "id": 12,
    "title": "@Beco do Espeto",
    "category": "Baladas",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20pagode%202_2.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20pagode%202_2.mp4",
    "duration": ""
  },
  {
    "id": 13,
    "title": "@ExpoPizzaria Dia 1",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20pizza%20dia%201.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20pizza%20dia%201.mp4",
    "duration": ""
  },
  {
    "id": 14,
    "title": "@ExpoPizzaria Dia 2",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20pizza%20dia%202.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20pizza%20dia%202.mp4",
    "duration": ""
  },
  {
    "id": 15,
    "title": "@Quizomba",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20quizomba.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20quizomba.mp4",
    "duration": ""
  },
  {
    "id": 16,
    "title": "@Dubatuq feat @Shopee",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20shopee_prob4.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/C%C3%B3pia%20de%20shopee_prob4.mp4",
    "duration": ""
  },
  {
    "id": 17,
    "title": "@DjKimCotrim",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/kim_2.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/v%C3%ADdeos/kim_2.mp4",
    "duration": ""
  }
];

let activeVideosList = [...VIDEOS_DATA];

/* ============================================================
   URL PARSER — detecta tipo e retorna embed info
   ============================================================ */

function parseVideoUrl(url) {
  if (!url) return { type: 'unknown', src: '' };
  const u = String(url).trim();

  /* YouTube watch  */
  const ytWatch = u.match(/(?:youtube\.com\/watch\?.*v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytWatch) return { type: 'youtube', id: ytWatch[1] };

  /* YouTube Shorts */
  const ytShort = u.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (ytShort) return { type: 'youtube', id: ytShort[1] };

  /* YouTube embed  */
  const ytEmbed = u.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (ytEmbed) return { type: 'youtube', id: ytEmbed[1] };

  /* Instagram Reel */
  const igReel = u.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
  if (igReel) return { type: 'instagram', id: igReel[1] };

  /* Instagram Post */
  const igPost = u.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/);
  if (igPost) return { type: 'instagram', id: igPost[1] };

  /* Google Drive */
  const gdrive = u.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  if (gdrive) return { type: 'gdrive', id: gdrive[1] };

  /* Arquivo de vídeo direto */
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(u)) return { type: 'native', src: u };

  /* Qualquer outro URL — tenta como iframe genérico */
  return { type: 'iframe', src: u };
}

function getGDriveDirectUrl(id) {
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

function buildEmbedSrc(parsed, autoplay = false) {
  if (parsed.type === 'youtube') {
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      controls: '0',
      showinfo: '0',
      iv_load_policy: '3',
      disablekb: '1',
      fs: '0',
      playsinline: '1',
      loop: '1',
      playlist: parsed.id,
      vq: 'hd1080',
    });
    if (autoplay) params.set('autoplay', '1');
    return `https://www.youtube.com/embed/${parsed.id}?${params}`;
  }
  return parsed.src || '';
}

/* ============================================================
   THUMBNAIL — gera dinamicamente para YT ou usa fallback
   ============================================================ */

function getThumbnail(video) {
  const parsed = parseVideoUrl(video.videoUrl);
  if (parsed.type === 'youtube' && parsed.id) {
    return `https://i.ytimg.com/vi/${parsed.id}/hqdefault.jpg`;
  }
  if (video.thumbnail) return video.thumbnail;
  return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80';
}

/* ============================================================
   FILM BURN — animação de transição ao abrir modal
   ============================================================ */

function triggerFilmBurn() {
  const burn = document.getElementById('film-burn');
  if (!burn) return;
  burn.classList.remove('film-burn--active');
  void burn.offsetWidth;
  burn.classList.add('film-burn--active');
}

function triggerFilmBurnSwipe() {
  const burn = document.getElementById('film-burn-swipe');
  if (!burn) return;
  burn.classList.remove('film-burn--active');
  void burn.offsetWidth;
  burn.classList.add('film-burn--active');
}

/* ============================================================
   RENDER — CARD (com tratamento de erros individual)
   ============================================================ */

function buildCard(video, playlist) {
  try {
    const li = document.createElement('li');
    li.className = 'card';
    li.dataset.category = video.category || 'Geral';
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `${video.title || 'Vídeo'} — ${video.category || ''}`);

    const videoSrc = video.videoUrl || '';

    li.innerHTML = `
      <video class="card__thumb" autoplay muted loop playsinline preload="metadata" width="100%" src="${escHtml(videoSrc)}"></video>
      <div class="card__overlay" aria-hidden="true">
        <div class="card__play">
          <div class="card__play-icon">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
              <path d="M1 1.5L15 9L1 16.5V1.5Z" fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <span class="card__category">${escHtml(video.category || '')}</span>
        <h2 class="card__title">${escHtml(video.title || 'Sem título')}</h2>
      </div>
      ${video.duration ? `<span class="card__duration" aria-hidden="true">${escHtml(video.duration)}</span>` : ''}
    `;

    const vEl = li.querySelector('video');
    if (vEl) {
      vEl.play().catch(() => {});
    }

    li.addEventListener('click', () => openModal(video, playlist));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(video, playlist);
      }
    });

    return li;
  } catch (err) {
    console.error('[Portfolio] Erro ao renderizar card:', err, video);
    return null;
  }
}

function renderGrid(videos) {
  const grid = document.getElementById('video-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!Array.isArray(videos) || videos.length === 0) {
    const p = document.createElement('p');
    p.className = 'grid__loading';
    p.textContent = 'Nenhum vídeo nesta categoria.';
    grid.appendChild(p);
    return;
  }

  const fragment = document.createDocumentFragment();
  let renderedCount = 0;

  videos.forEach((v) => {
    try {
      const card = buildCard(v, videos);
      if (card) {
        fragment.appendChild(card);
        renderedCount++;
      }
    } catch (e) {
      console.error('[Portfolio] Falha ao processar vídeo no grid:', e);
    }
  });

  if (renderedCount === 0) {
    const p = document.createElement('p');
    p.className = 'grid__loading';
    p.textContent = 'Nenhum vídeo disponível no momento.';
    grid.appendChild(p);
  } else {
    grid.appendChild(fragment);
  }

  const statEl = document.getElementById('stat-projects');
  if (statEl) statEl.textContent = activeVideosList.length;
}

/* ============================================================
   FILTERS
   ============================================================ */

function initFilters(allVideos) {
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;
      const filtered = filter === 'all'
        ? allVideos
        : allVideos.filter((v) => v.category === filter);

      renderGrid(filtered);
    });
  });
}

/* ============================================================
   MODAL CONTROL
   ============================================================ */

let previouslyFocused = null;
let currentPlaylist   = [];
let currentIndex      = 0;

function resetModalPlayer() {
  const modalIframe   = document.getElementById('modal-iframe');
  const modalVideo    = document.getElementById('modal-video');
  const modalIg       = document.getElementById('modal-instagram');

  if (modalIframe) { modalIframe.style.display = 'none'; modalIframe.src = ''; }
  if (modalVideo)  { modalVideo.style.display  = 'none'; modalVideo.src = ''; if (modalVideo.pause) modalVideo.pause(); }
  if (modalIg)     { modalIg.style.display     = 'none'; modalIg.innerHTML = ''; }
}

function loadVideo(video) {
  const catEl = document.getElementById('modal-category');
  const titleEl = document.getElementById('modal-title');
  if (catEl) catEl.textContent = video.category || '';
  if (titleEl) titleEl.textContent = video.title || '';

  resetModalPlayer();

  const parsed = parseVideoUrl(video.videoUrl);
  const clickShield   = document.getElementById('modal-click-shield');
  const modalIframe   = document.getElementById('modal-iframe');
  const modalVideo    = document.getElementById('modal-video');
  const modalIg       = document.getElementById('modal-instagram');

  if (parsed.type === 'youtube' || parsed.type === 'iframe') {
    if (modalIframe) {
      modalIframe.src = buildEmbedSrc(parsed, true);
      modalIframe.style.display = 'block';
    }
    if (clickShield) clickShield.style.display = 'block';
  } else if (parsed.type === 'gdrive' || parsed.type === 'native') {
    // Player HTML5 Nativo limpo para Google Drive e arquivos .mp4/.webm (com áudio ativado)
    if (modalVideo) {
      const streamSrc = parsed.type === 'gdrive' ? getGDriveDirectUrl(parsed.id) : parsed.src;
      modalVideo.src = streamSrc;
      modalVideo.muted = false;
      modalVideo.volume = 1.0;
      modalVideo.loop = true;
      modalVideo.controls = true;
      modalVideo.playsInline = true;
      modalVideo.style.display = 'block';
      modalVideo.play().catch(() => {
        // Fallback caso o navegador exija mute por política estrita
        modalVideo.muted = true;
        modalVideo.play().catch(() => {});
      });
    }
    if (clickShield) clickShield.style.display = 'none';
  } else if (parsed.type === 'instagram') {
    if (modalIg) {
      modalIg.innerHTML = `
        <blockquote
          class="instagram-media"
          data-instgrm-captioned="false"
          data-instgrm-permalink="https://www.instagram.com/reel/${parsed.id}/"
          data-instgrm-version="14"
          style="background: #000; border: 0; border-radius: 0; margin: 0; padding: 0; width: 100%; max-width: 100%; height: 100%; min-height: 100%;"
        ></blockquote>
      `;
      modalIg.style.display = 'flex';

      // Processa o embed usando a API oficial do Instagram
      if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
        window.instgrm.Embeds.process(modalIg);
      } else {
        setTimeout(() => {
          if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
            window.instgrm.Embeds.process(modalIg);
          }
        }, 500);
      }
    }
    if (clickShield) clickShield.style.display = 'none';
  }
}

function openModal(video, playlist) {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return;

  previouslyFocused = document.activeElement;
  currentPlaylist   = playlist || [video];
  currentIndex      = currentPlaylist.findIndex(v => v.id === video.id);
  if (currentIndex < 0) currentIndex = 0;

  loadVideo(currentPlaylist[currentIndex]);

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  triggerFilmBurn();
  if (closeBtn) requestAnimationFrame(() => closeBtn.focus());
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;

  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(resetModalPlayer, 300);
  if (previouslyFocused) previouslyFocused.focus();
}

/* --- Navegação entre vídeos com animação --- */

function navigateTo(direction) {
  const modalReel = document.querySelector('.modal__reel');
  if (!modalReel) return;

  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= currentPlaylist.length) return;

  const exitClass  = direction > 0 ? 'modal__reel--exit-up'   : 'modal__reel--exit-down';
  const enterClass = direction > 0 ? 'modal__reel--enter-up'  : 'modal__reel--enter-down';

  triggerFilmBurnSwipe();

  modalReel.classList.add(exitClass);

  setTimeout(() => {
    modalReel.classList.remove(exitClass);
    currentIndex = nextIndex;
    loadVideo(currentPlaylist[currentIndex]);
    modalReel.classList.add(enterClass);
    modalReel.addEventListener('animationend', () => {
      modalReel.classList.remove(enterClass);
    }, { once: true });
  }, 350);
}

/* --- Event listeners para o modal e gestos --- */

function setupEventListeners() {
  const modal      = document.getElementById('modal');
  const backdrop   = document.getElementById('modal-backdrop');
  const closeBtn   = document.getElementById('modal-close');
  const modalReel  = document.querySelector('.modal__reel');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (modalReel) {
    let touchStartY = 0;
    let touchStartX = 0;
    let isSwiping   = false;

    modalReel.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isSwiping = false;
    }, { passive: true });

    modalReel.addEventListener('touchmove', (e) => {
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      if (dy > dx && dy > 10) isSwiping = true;
    }, { passive: true });

    modalReel.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dy) < 60) return;
      navigateTo(dy < 0 ? 1 : -1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modal) return;
    const isOpen = modal.getAttribute('aria-hidden') === 'false';
    if (e.key === 'Escape' && isOpen) { closeModal(); return; }
    if (!isOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); navigateTo(1);  }
    if (e.key === 'ArrowUp')   { e.preventDefault(); navigateTo(-1); }
  });

  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.disabled && el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }
}

/* ============================================================
   UTILITIES
   ============================================================ */

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   INIT — Renderização imediata e síncrona
   ============================================================ */

function initApp() {
  // 1. Renderiza imediatamente com VIDEOS_DATA
  renderGrid(VIDEOS_DATA);
  initFilters(VIDEOS_DATA);
  setupEventListeners();

  // 2. Tenta atualizar via videos.json em segundo plano (se disponível)
  fetch('./videos.json?t=' + Date.now())
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('Response not ok');
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        activeVideosList = data;
        renderGrid(activeVideosList);
        initFilters(activeVideosList);
      }
    })
    .catch((_) => {
      // Ignora erro silenciosamente, pois VIDEOS_DATA já foi exibido com sucesso
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
