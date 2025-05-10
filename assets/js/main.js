// --- darkmode.js ---
document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const dropdown = document.getElementById('theme-dropdown-btn');
  const options = document.getElementById('theme-options');
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');

  const THEMES = {
    light: {
      name: 'Clair',
      icon: '/assets/icons/light.webp',
    },
    dark: {
      name: 'Sombre',
      icon: '/assets/icons/moon.webp',
    },
    system: {
      name: 'Système',
      icon: '/assets/icons/system.webp',
    },
  };

  const getSystem = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const getSaved = () => {
    const saved = localStorage.getItem('theme');
    return THEMES.hasOwnProperty(saved) ? saved : 'system';
  };

  const applyTheme = mode => {
    const validMode = THEMES.hasOwnProperty(mode) ? mode : 'system';
    const resolved = validMode === 'system' ? getSystem() : validMode;
    html.classList.toggle('dark', resolved === 'dark');
    icon.src = THEMES[validMode].icon;
    label.textContent = THEMES[validMode].name;
  };

  const setTheme = mode => {
    if (mode === 'system') {
      localStorage.removeItem('theme');
    } else if (THEMES.hasOwnProperty(mode)) {
      localStorage.setItem('theme', mode);
    } else {
      console.warn(`Thème invalide ignoré : ${mode}`);
      return;
    }
    applyTheme(mode);
    options.classList.add('hidden');
    dropdown.setAttribute('aria-expanded', 'false');
  };

  // Initialisation
  applyTheme(getSaved());

  // Ouverture/fermeture du menu
  dropdown.addEventListener('click', () => {
    options.classList.toggle('hidden');
    dropdown.setAttribute(
      'aria-expanded',
      options.classList.contains('hidden') ? 'false' : 'true'
    );
  });

  // Choix du thème
  options.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      setTheme(theme);
    });
  });

  // Fermeture du menu si clic en dehors
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target) && !options.contains(e.target)) {
      options.classList.add('hidden');
      dropdown.setAttribute('aria-expanded', 'false');
    }
  });
});

// --- navbarcore.js ---
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.querySelector('.navbar-burger');
  const menu = document.querySelector('.navbar-menu');
  const close = document.querySelector('.navbar-close');
  const backdrop = document.querySelector('.navbar-backdrop');
  const header = document.getElementById('site-header');

  let isHeaderVisible = true;
  let lastScrollTop = 0;
  let mouseLastMoved = Date.now();
  let inactivityTimer;
  let scrollPosition = 0;

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  // --- MENU BURGER ----
  function openMenu() {
    if (menu) {
      scrollPosition = window.scrollY;

      // Bloque le scroll et garde la position visuellement
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      menu.classList.remove('hidden', 'animate-slide-fade-out');
      void menu.offsetWidth;
      menu.classList.add(
        'fixed',
        'inset-0',
        'w-screen',
        'h-screen',
        'z-[999]',
        'animate-slide-fade-in'
      );
    }
  }

  function closeMenu() {
    if (menu) {
      menu.classList.remove('animate-slide-fade-in');
      menu.classList.add('animate-slide-fade-out');

      setTimeout(() => {
        menu.classList.add('hidden');
        menu.classList.remove(
          'fixed',
          'inset-0',
          'w-screen',
          'h-screen',
          'z-[999]'
        );

        // Restaure la position scroll sans effet de saut
        const scrollY = parseInt(document.body.style.top || '0') * -1;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      }, 300);
    }
  }

  // --- HEADER VISIBILITY ---
  function showHeader() {
    if (!isHeaderVisible) {
      header.classList.remove('translate-y-neg-120');
      isHeaderVisible = true;
    }
  }

  function hideHeader() {
    const scrollTop = window.scrollY;
    if (
      isHeaderVisible &&
      scrollTop > 0 &&
      header.classList.contains('w-[30%]')
    ) {
      header.classList.add('translate-y-neg-120');
      isHeaderVisible = false;
    }
  }

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      hideHeader();
    }, 2000);
  }

  // --- HEADER WIDTH ---
  function updateHeaderWidth() {
    const scrollTop = window.scrollY;
    const isDesktop = window.innerWidth > 768;

    if (!isDesktop) return;

    if (scrollTop === 0) {
      header.classList.add('w-full', 'py-2');
      header.classList.remove('w-[30%]', 'shadow-md');
      showHeader(); // Toujours visible en haut de page
    } else {
      const wasCompact = header.classList.contains('w-[30%]');
      header.classList.add('w-[30%]', 'shadow-md');
      header.classList.remove('w-full', 'py-2');

      // Si on vient juste de compacter → lancer timer
      if (!wasCompact) {
        resetInactivityTimer();
      }
    }
  }

  // --- ÉVÉNEMENTS ---
  if (burger) burger.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  window.addEventListener('scroll', () => {
    updateHeaderWidth();
    // On ne reset pas l'inactivité ici (plus de disparition au scroll seul)
  });

  window.addEventListener('mousemove', () => {
    mouseLastMoved = Date.now();
    showHeader();

    if (header.classList.contains('w-[30%]')) {
      resetInactivityTimer();
    }
  });

  window.addEventListener('resize', updateHeaderWidth);

  // --- INIT ---
  updateHeaderWidth();
  showHeader();
});

// --- animationCard.js (faster domino effect) ---
(function () {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  function observeElements() {
    let delay = 0;
    let count = 0;
    document.querySelectorAll('[data-observe]:not(.observed)').forEach(el => {
      el.classList.add('observed');
      el.dataset.delay = delay;
      observer.observe(el);
      delay += 50;
      count++;
      if (count % 6 === 0) delay = 0;
    });
  }

  document.addEventListener('DOMContentLoaded', observeElements);
  window.reobserveCards = observeElements;
})();
// --- infinite-scroll.js (patched) ---
/* eslint-env browser */

/**
 * Infinite Scroll
 * Used on all pages where there is a list of posts (homepage, tag index, etc).
 *
 * When the page is scrolled to 300px from the bottom, the next page of posts
 * is fetched by following the the <link rel="next" href="..."> that is output
 * by {{ghost_head}}.
 *
 * The individual post items are extracted from the fetched pages by looking for
 * a wrapper element with the class "post-card". Any found elements are appended
 * to the element with the class "post-feed" in the currently viewed page.
 */

(function (window, document) {
  if (document.documentElement.classList.contains('no-infinite-scroll')) return;

  // next link element
  var nextElement = document.querySelector('link[rel=next]');
  if (!nextElement) {
    return;
  }

  // post feed element
  var feedElement = document.querySelector('.post-feed');
  if (!feedElement) {
    return;
  }

  var buffer = 300;

  var ticking = false;
  var loading = false;

  var lastScrollY = window.scrollY;
  var lastWindowHeight = window.innerHeight;
  var lastDocumentHeight = document.documentElement.scrollHeight;

  function onPageLoad() {
    if (this.status === 404) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      return;
    }

    // append contents
    var postElements = this.response.querySelectorAll('article.post-card');
    postElements.forEach(function (item) {
      // document.importNode is important, without it the item's owner
      // document will be different which can break resizing of
      // `object-fit: cover` images in Safari
      feedElement.appendChild(document.importNode(item, true));
      if (typeof window.reobserveCards === 'function') window.reobserveCards();
    });

    // set next link
    var resNextElement = this.response.querySelector('link[rel=next]');
    if (resNextElement) {
      nextElement.href = resNextElement.href;
    } else {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    }

    // sync status
    lastDocumentHeight = document.documentElement.scrollHeight;
    ticking = false;
    loading = false;
  }

  function onUpdate() {
    // return if already loading
    if (loading) {
      return;
    }

    // return if not scroll to the bottom
    if (lastScrollY + lastWindowHeight <= lastDocumentHeight - buffer) {
      ticking = false;
      return;
    }

    loading = true;

    var xhr = new window.XMLHttpRequest();
    xhr.responseType = 'document';

    xhr.addEventListener('load', onPageLoad);

    xhr.open('GET', nextElement.href);
    xhr.send(null);
  }

  function requestTick() {
    ticking || window.requestAnimationFrame(onUpdate);
    ticking = true;
  }

  function onScroll() {
    lastScrollY = window.scrollY;
    requestTick();
  }

  function onResize() {
    lastWindowHeight = window.innerHeight;
    lastDocumentHeight = document.documentElement.scrollHeight;
    requestTick();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  requestTick();
})(window, document);
