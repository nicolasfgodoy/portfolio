/**
 * app.js — Portfolio Videomaker — Nicolas Godoy
 * Renderização síncrona imediata com fallback VIDEOS_DATA,
 * sincronização dinâmica com Cloudflare R2 / Worker,
 * parser de URLs, miniaturas dinâmicas, filtros e modal com transição film-burn.
 */

/* ============================================================
   EMBEDDED DATA — Fallback inicial para carregamento instantâneo
   ============================================================ */

const VIDEOS_DATA = [
  {
    "id": 1,
    "title": "@RyuTheRunner",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/ryutherunner/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/ryutherunner/video.mp4",
    "duration": ""
  },
  {
    "id": 2,
    "title": "@Dubatuq feat @99",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/dubatuq-feat-99/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/dubatuq-feat-99/video.mp4",
    "duration": ""
  },
  {
    "id": 3,
    "title": "@BurguerExpo Dia 1",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/burguerexpo-dia-1/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/burguerexpo-dia-1/video.mp4",
    "duration": ""
  },
  {
    "id": 4,
    "title": "@BurgerExpo Dia 2",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/burgerexpo-dia-2/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/burgerexpo-dia-2/video.mp4",
    "duration": ""
  },
  {
    "id": 5,
    "title": "@Supernova",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/supernova/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/supernova/video.mp4",
    "duration": ""
  },
  {
    "id": 6,
    "title": "@Peers Band (01)",
    "category": "Casamentos",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/peers-band-01/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/peers-band-01/video.mp4",
    "duration": ""
  },
  {
    "id": 7,
    "title": "@VulgoFK",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/vulgofk/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/vulgofk/video.mp4",
    "duration": ""
  },
  {
    "id": 8,
    "title": "@Peers Band (02)",
    "category": "Casamentos",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/peers-band-02/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/peers-band-02/video.mp4",
    "duration": ""
  },
  {
    "id": 9,
    "title": "@Dubatuq",
    "category": "Casamentos",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/dubatuq/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/dubatuq/video.mp4",
    "duration": ""
  },
  {
    "id": 10,
    "title": "@Finesse (01)",
    "category": "Baladas",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/finesse-01/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/finesse-01/video.mp4",
    "duration": ""
  },
  {
    "id": 11,
    "title": "@Finesse (02)",
    "category": "Baladas",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/finesse-02/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/finesse-02/video.mp4",
    "duration": ""
  },
  {
    "id": 12,
    "title": "@Beco do Espeto",
    "category": "Baladas",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/beco-do-espeto/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/beco-do-espeto/video.mp4",
    "duration": ""
  },
  {
    "id": 13,
    "title": "@ExpoPizzaria Dia 1",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/expopizzaria-dia-1/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/expopizzaria-dia-1/video.mp4",
    "duration": ""
  },
  {
    "id": 14,
    "title": "@ExpoPizzaria Dia 2",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/expopizzaria-dia-2/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/expopizzaria-dia-2/video.mp4",
    "duration": ""
  },
  {
    "id": 15,
    "title": "@Quizomba",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/quizomba/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/quizomba/video.mp4",
    "duration": ""
  },
  {
    "id": 16,
    "title": "@Dubatuq feat @Shopee",
    "category": "Shows",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/dubatuq-feat-shopee/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/dubatuq-feat-shopee/video.mp4",
    "duration": ""
  },
  {
    "id": 17,
    "title": "@DjKimCotrim",
    "category": "Corporativo",
    "date": "",
    "location": "São Paulo, BR",
    "description": "4K, Dynamic, Color Grading, S-Log",
    "thumbnail": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/djkimcotrim/preview.mp4",
    "videoUrl": "https://pub-1dce3e5b589446cb9be315800a068e05.r2.dev/projetos/djkimcotrim/video.mp4",
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

  /* YouTube watch */
  const ytWatch = u.match(/(?:youtube\.com\/watch\?.*v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytWatch) return { type: 'youtube', id: ytWatch[1] };

  /* YouTube Shorts */
  const ytShort = u.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (ytShort) return { type: 'youtube', id: ytShort[1] };

  /* YouTube embed */
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

  /* Qualquer outro URL */
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
   THUMBNAIL
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
   MODAL WIPE — animação de transição estilo introdução do site
   ============================================================ */

function triggerModalWipe() {
  const wipe = document.getElementById('modal-wipe');
  if (!wipe) return;
  wipe.classList.remove('modal-wipe--active');
  void wipe.offsetWidth;
  wipe.classList.add('modal-wipe--active');
  setTimeout(() => {
    wipe.classList.remove('modal-wipe--active');
  }, 1800);
}

/* ============================================================
   RENDER — CARD & LAZY LOADING VIA INTERSECTION OBSERVER
   ============================================================ */

let gridCardObserver = null;

function setupGridObserver() {
  if (gridCardObserver) {
    gridCardObserver.disconnect();
  }

  gridCardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        const vEl = card.querySelector('video.card__thumb');
        if (!vEl) return;

        if (entry.isIntersecting) {
          if (!vEl.src && vEl.dataset.src) {
            vEl.src = vEl.dataset.src;
          }
          vEl.play().catch(() => {});
        } else {
          if (vEl.src) {
            vEl.pause();
          }
        }
      });
    },
    { rootMargin: '200px 0px', threshold: 0.05 }
  );
}

function buildCard(video, playlist) {
  try {
    const li = document.createElement('li');
    li.className = 'card';
    li.dataset.category = video.category || 'Geral';
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `${video.title || 'Vídeo'} — ${video.category || ''}`);

    // Thumbnail é exclusivamente a miniatura (preview.mp4 ou imagem)
    const thumbSrc = video.thumbnail || '';

    li.innerHTML = `
      <video class="card__thumb" data-src="${escHtml(thumbSrc)}" muted loop playsinline preload="none" width="100%"></video>
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
  setupGridObserver();

  if (!Array.isArray(videos) || videos.length === 0) {
    const p = document.createElement('p');
    p.className = 'grid__loading';
    p.textContent = 'Nenhum vídeo nesta categoria.';
    grid.appendChild(p);
    return;
  }

  const fragment = document.createDocumentFragment();
  let renderedCount = 0;
  const createdCards = [];

  videos.forEach((v) => {
    try {
      const card = buildCard(v, videos);
      if (card) {
        fragment.appendChild(card);
        createdCards.push(card);
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
    if (gridCardObserver) {
      createdCards.forEach((c) => gridCardObserver.observe(c));
    }
  }

  const statEl = document.getElementById('stat-projects');
  if (statEl) statEl.textContent = activeVideosList.length;
}

/* ============================================================
   FILTERS
   ============================================================ */

function updatePillPosition(activeBtn) {
  const nav = document.getElementById('filters-nav');
  const pill = document.getElementById('filters-pill');
  if (!nav || !pill || !activeBtn) return;

  const navRect = nav.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();

  const left = btnRect.left - navRect.left + nav.scrollLeft;
  const width = btnRect.width;

  pill.style.transform = `translateX(${left}px)`;
  pill.style.width = `${width}px`;
  pill.style.opacity = '1';
}

function initFilters(allVideos) {
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));
  const activeBtn = document.querySelector('.filter-btn--active') || buttons[0];

  if (activeBtn) {
    updatePillPosition(activeBtn);
  }

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.filter-btn--active');
    if (currentActive) updatePillPosition(currentActive);
  });

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const currentActive = document.querySelector('.filter-btn--active');
      if (btn === currentActive) return;

      const prevIndex = buttons.indexOf(currentActive);
      const direction = index > prevIndex ? 'left' : 'right';

      buttons.forEach((b) => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      updatePillPosition(btn);

      const grid = document.getElementById('video-grid');
      if (grid) {
        grid.classList.remove('grid--slide-left', 'grid--slide-right');
        grid.classList.add(direction === 'left' ? 'grid--slide-left' : 'grid--slide-right');
      }

      const filter = btn.dataset.filter;
      const filtered = filter === 'all'
        ? allVideos
        : allVideos.filter((v) => (v.category || '').toLowerCase() === filter.toLowerCase());

      setTimeout(() => {
        renderGrid(filtered);
        if (grid) {
          grid.style.transition = 'none';
          grid.classList.remove('grid--slide-left', 'grid--slide-right');
          grid.classList.add(direction === 'left' ? 'grid--slide-right' : 'grid--slide-left');
          void grid.offsetWidth;
          grid.style.transition = '';
          grid.classList.remove('grid--slide-left', 'grid--slide-right');
        }
      }, 150);
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
  currentIndex      = currentPlaylist.findIndex(v => String(v.id) === String(video.id));
  if (currentIndex < 0) currentIndex = 0;

  loadVideo(currentPlaylist[currentIndex]);

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  triggerModalWipe();
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

  modalReel.classList.add(exitClass);

  setTimeout(() => {
    modalReel.classList.remove(exitClass);
    currentIndex = nextIndex;
    triggerModalWipe();
    loadVideo(currentPlaylist[currentIndex]);

    modalReel.classList.add(enterClass);
    modalReel.addEventListener('animationend', () => {
      modalReel.classList.remove(enterClass);
    }, { once: true });
  }, 220);
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
   INIT — Renderização imediata e sincronização com Worker / R2
   ============================================================ */

function setupIntroAnimation() {
  const splash = document.getElementById('splash-intro');
  if (!splash) return;

  const startSplash = () => {
    document.documentElement.classList.add('fonts-loaded');
    splash.classList.add('splash-active');
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startSplash);
  } else {
    startSplash();
  }

  setTimeout(() => {
    splash.classList.add('splash-finish');
    document.body.classList.remove('loading-intro');
    splash.remove();
  }, 3300);
}

function initApp() {
  setupIntroAnimation();

  // 1. Renderiza imediatamente com VIDEOS_DATA
  renderGrid(VIDEOS_DATA);
  initFilters(VIDEOS_DATA);
  setupEventListeners();

  // 2. Sincroniza dinamicamente com o feed configurado na sua Cloudflare Worker
  fetch('https://portfolio-api.nicolasfgodoy.workers.dev/api/portfolio-config')
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('Response not ok');
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        // Mapeia os dados do R2 preservando thumbnail e videoUrl originais
        activeVideosList = data.map((item, index) => ({
          id: item.id || item.slug || index + 1,
          title: item.title,
          category: item.category || 'Geral',
          date: item.date || '',
          location: item.location || 'São Paulo, BR',
          description: item.description || (item.tags || []).join(', '),
          thumbnail: item.thumbnail || item.videoUrl,
          videoUrl: item.videoUrl || item.thumbnail,
          duration: item.duration || ''
        }));

        renderGrid(activeVideosList);
        initFilters(activeVideosList);
      }
    })
    .catch((_) => {
      // Caso a API demore ou falhe, o fallback VIDEOS_DATA já está na tela
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
