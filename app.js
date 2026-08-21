/**
 * app.js — Portfolio Videomaker — Nicolas Godoy
 * Modular ES module: fetch com fallback CORS, parser de URLs,
 * renderização de grid, filtros e modal com suporte a YouTube,
 * Instagram Reels e vídeos nativos (.mp4/.webm).
 */

/* ============================================================
   FALLBACK DATA — usado quando fetch falha (file://)
   ============================================================ */

const FALLBACK_VIDEOS = [
  {
    "id": 1,
    "title": "Vídeo YouTube 1",
    "category": "Casamentos",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://img.youtube.com/vi/I7pqmzxUXXc/hqdefault.jpg",
    "videoUrl": "https://www.youtube.com/watch?v=I7pqmzxUXXc",
    "duration": ""
  },
  {
    "id": 2,
    "title": "Vídeo YouTube 2",
    "category": "Shows",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://img.youtube.com/vi/5Qag5em1IdM/hqdefault.jpg",
    "videoUrl": "https://www.youtube.com/watch?v=5Qag5em1IdM",
    "duration": ""
  },
  {
    "id": 3,
    "title": "Vídeo YouTube 3",
    "category": "Baladas",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://img.youtube.com/vi/8qQ0Jj8LVFo/hqdefault.jpg",
    "videoUrl": "https://www.youtube.com/watch?v=8qQ0Jj8LVFo",
    "duration": ""
  },
  {
    "id": 4,
    "title": "Vídeo YouTube 4",
    "category": "Teasers",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://img.youtube.com/vi/z20rooamh28/hqdefault.jpg",
    "videoUrl": "https://www.youtube.com/watch?v=z20rooamh28",
    "duration": ""
  },
  {
    "id": 5,
    "title": "Vídeo YouTube 5",
    "category": "Corporativo",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://img.youtube.com/vi/piRPUYjzUHE/hqdefault.jpg",
    "videoUrl": "https://www.youtube.com/watch?v=piRPUYjzUHE",
    "duration": ""
  },
  {
    "id": 6,
    "title": "Reel Instagram",
    "category": "Shows",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80",
    "videoUrl": "https://www.instagram.com/reel/DD-dT-Wic5q/",
    "duration": ""
  },
  {
    "id": 7,
    "title": "Vídeo Drive 1",
    "category": "Casamentos",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80",
    "videoUrl": "https://drive.google.com/file/d/1Hu2-jUY94xgTimQYmXV-wqIB-yS-ii2Y/view?usp=drive_link",
    "duration": ""
  },
  {
    "id": 8,
    "title": "Vídeo Drive 2",
    "category": "Baladas",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
    "videoUrl": "https://drive.google.com/file/d/13LY70E7yiYwUdO8lqGdXxIQNoXXCChUM/view?usp=drive_link",
    "duration": ""
  },
  {
    "id": 9,
    "title": "Vídeo Drive 3",
    "category": "Teasers",
    "date": "",
    "location": "",
    "description": "",
    "thumbnail": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80",
    "videoUrl": "https://drive.google.com/file/d/1Fu-Hc1q1ysCJK7E_A7vkSGmsbil-zvI_/view?usp=drive_link",
    "duration": ""
  }
];

/* ============================================================
   DATA — fetch com fallback para file://
   ============================================================ */

async function fetchVideos() {
  if (window.location.protocol === 'file:') {
    return loadFallback();
  }
  try {
    const res = await fetch('./videos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    return loadFallback();
  }
}

function loadFallback() {
  try {
    const stored = window.__PORTFOLIO_VIDEOS__;
    if (Array.isArray(stored) && stored.length) return stored;
  } catch (_) { /* noop */ }
  return FALLBACK_VIDEOS;
}

/* ============================================================
   URL PARSER — detecta tipo e retorna embed info
   ============================================================ */

function parseVideoUrl(url) {
  if (!url) return { type: 'unknown', src: '' };

  const u = url.trim();

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
  if (parsed.type === 'instagram') {
    return `https://www.instagram.com/reel/${parsed.id}/embed/captioned=0/`;
  }
  if (parsed.type === 'gdrive') {
    return `https://drive.google.com/file/d/${parsed.id}/preview?autoplay=1`;
  }
  return parsed.src || '';
}

/* ============================================================
   FILM BURN — animação de transição ao abrir modal
   ============================================================ */

function triggerFilmBurn() {
  const burn = document.getElementById('film-burn');
  burn.classList.remove('film-burn--active');
  void burn.offsetWidth;
  burn.classList.add('film-burn--active');
}

function triggerFilmBurnSwipe() {
  const burn = document.getElementById('film-burn-swipe');
  burn.classList.remove('film-burn--active');
  void burn.offsetWidth;
  burn.classList.add('film-burn--active');
}

/* ============================================================
   THUMBNAIL — gera fallback se não houver
   ============================================================ */

function getThumbnail(video) {
  if (video.thumbnail) return video.thumbnail;
  const parsed = parseVideoUrl(video.videoUrl);
  if (parsed.type === 'youtube') {
    return `https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg`;
  }
  return '';
}

/* ============================================================
   RENDER — CARD
   ============================================================ */

function buildCard(video, playlist) {
  const li = document.createElement('li');
  li.className = 'card';
  li.dataset.category = video.category;
  li.setAttribute('role', 'listitem');
  li.setAttribute('tabindex', '0');
  li.setAttribute('aria-label', `${video.title} — ${video.category}, ${video.duration}`);

  const thumb = getThumbnail(video);
  const parsed = parseVideoUrl(video.videoUrl);
  const typeLabel = parsed.type === 'instagram' ? 'IG' : parsed.type === 'native' ? '▶' : '▶';

  li.innerHTML = `
    ${thumb
      ? `<img class="card__thumb" src="${escHtml(thumb)}" alt="${escHtml(video.title)}" loading="lazy" decoding="async" />`
      : `<div class="card__thumb card__thumb--placeholder"></div>`
    }
    <div class="card__overlay" aria-hidden="true">
      <div class="card__play">
        <div class="card__play-icon">
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
            <path d="M1 1.5L15 9L1 16.5V1.5Z" fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <span class="card__category">${escHtml(video.category)}</span>
      <h2 class="card__title">${escHtml(video.title)}</h2>
    </div>
    <span class="card__duration" aria-hidden="true">${escHtml(video.duration)}</span>
    ${parsed.type === 'instagram'
      ? '<span class="card__badge card__badge--ig" aria-hidden="true">IG</span>'
      : ''
    }
  `;

  li.addEventListener('click', () => openModal(video, playlist));
  li.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(video, playlist);
    }
  });

  return li;
}

function renderGrid(videos) {
  const grid = document.getElementById('video-grid');
  grid.innerHTML = '';

  if (videos.length === 0) {
    const p = document.createElement('p');
    p.className = 'grid__loading';
    p.textContent = 'Nenhum vídeo nesta categoria.';
    grid.appendChild(p);
    return;
  }

  const fragment = document.createDocumentFragment();
  videos.forEach((v) => fragment.appendChild(buildCard(v, videos)));
  grid.appendChild(fragment);
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
   MODAL
   ============================================================ */

const modal         = document.getElementById('modal');
const backdrop      = document.getElementById('modal-backdrop');
const closeBtn      = document.getElementById('modal-close');
const modalIframe   = document.getElementById('modal-iframe');
const modalVideo    = document.getElementById('modal-video');
const modalIg       = document.getElementById('modal-instagram');
const modalWrap     = document.getElementById('modal-video-wrap');
const clickShield   = document.getElementById('modal-click-shield');
const modalReel     = document.querySelector('.modal__reel');

let previouslyFocused = null;
let currentPlaylist   = [];
let currentIndex      = 0;

function resetModalPlayer() {
  modalIframe.style.display = 'none';
  modalVideo.style.display  = 'none';
  modalIg.style.display     = 'none';
  modalIframe.src  = '';
  modalVideo.src   = '';
  modalVideo.pause && modalVideo.pause();
  modalIg.innerHTML = '';
}

function loadVideo(video) {
  document.getElementById('modal-category').textContent = video.category;
  document.getElementById('modal-title').textContent    = video.title;

  resetModalPlayer();

  const parsed = parseVideoUrl(video.videoUrl);

  if (parsed.type === 'youtube' || parsed.type === 'gdrive' || parsed.type === 'iframe') {
    modalIframe.src = buildEmbedSrc(parsed, true);
    modalIframe.style.display = 'block';
    clickShield.style.display = 'block';
  } else if (parsed.type === 'instagram') {
    modalIg.innerHTML = `
      <iframe
        src="${escHtml(buildEmbedSrc(parsed))}"
        class="modal__ig-frame"
        frameborder="0"
        scrolling="no"
        allowtransparency="true"
        allow="encrypted-media"
        title="Instagram Reel"
      ></iframe>
    `;
    modalIg.style.display = 'flex';
    clickShield.style.display = 'block';
  } else if (parsed.type === 'native') {
    modalVideo.src = parsed.src;
    modalVideo.loop = true;
    modalVideo.style.display = 'block';
    clickShield.style.display = 'none';
    modalVideo.play().catch(() => {});
  }
}

function openModal(video, playlist) {
  previouslyFocused = document.activeElement;
  currentPlaylist   = playlist || [video];
  currentIndex      = currentPlaylist.findIndex(v => v.id === video.id);
  if (currentIndex < 0) currentIndex = 0;

  loadVideo(currentPlaylist[currentIndex]);

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  triggerFilmBurn();
  requestAnimationFrame(() => closeBtn.focus());
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(resetModalPlayer, 300);
  if (previouslyFocused) previouslyFocused.focus();
}

/* --- Navegação entre vídeos com animação ------------------- */

function navigateTo(direction) {
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

navPrev.addEventListener('click', () => navigateTo(-1));
navNext.addEventListener('click', () => navigateTo(1));

/* --- Touch / swipe ----------------------------------------- */

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

/* --- Teclado ----------------------------------------------- */

document.addEventListener('keydown', (e) => {
  const isOpen = modal.getAttribute('aria-hidden') === 'false';
  if (e.key === 'Escape' && isOpen) { closeModal(); return; }
  if (!isOpen) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); navigateTo(1);  }
  if (e.key === 'ArrowUp')   { e.preventDefault(); navigateTo(-1); }
});

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

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
   INIT
   ============================================================ */

async function init() {
  const grid = document.getElementById('video-grid');

  try {
    const videos = await fetchVideos();
    const statEl = document.getElementById('stat-projects');
    if (statEl) statEl.textContent = videos.length;
    renderGrid(videos);
    initFilters(videos);
  } catch (err) {
    console.error('[Portfolio]', err);
    grid.innerHTML = '<p class="grid__loading">Erro ao carregar os vídeos.</p>';
  }
}

init();
