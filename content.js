(() => {
  'use strict';

  const TOOLBAR_CLASS = 'yt-playlist-search-bar';
  const INPUT_CLASS = 'yt-playlist-search-input';
  const CLEAR_CLASS = 'yt-playlist-search-clear';
  const SORT_CLASS = 'yt-playlist-sort-btn';
  const COUNT_CLASS = 'yt-playlist-search-count';
  const HIDDEN_CLASS = 'yt-search-hidden';
  const LIST_CLASS = 'yt-playlist-list-enhanced';

  const MODAL_SELECTOR = [
    'ytmusic-add-to-playlist-renderer',
    'ytd-add-to-playlist-renderer',
    'yt-contextual-sheet-layout',
    '.ytm-bottom-sheet-layout'
  ].join(',');

  const ITEM_SELECTOR = [
    'ytmusic-playlist-add-to-option-renderer',
    'ytd-playlist-add-to-option-renderer',
    'toggleable-list-item-view-model',
    'ytm-compact-playlist-renderer'
  ].join(',');

  const LIST_SELECTOR = [
    '#playlists',
    'yt-list-view-model',
    '#items'
  ].join(',');

  let attachScheduled = false;
  let originalOrderCounter = 0;

  function normalizeText(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('tr-TR')
      .replace(/ı/g, 'i')
      .replace(/\s+/g, ' ')
      .trim();
  }

  
  function getItemTitle(item) {
    if (!item) return '';

    const explicitCandidates = [
      'yt-formatted-string[title]',
      '#title[title]',
      '#label[title]',
      '.ytListItemViewModelTitle[title]',
      '.ytListItemViewModelTitle',
      '#title yt-formatted-string',
      '#label yt-formatted-string',
      'yt-formatted-string',
      '.title'
    ];

    for (const selector of explicitCandidates) {
      const element = item.querySelector(selector);
      if (!element) continue;

      const titleAttr = element.getAttribute && element.getAttribute('title');
      if (titleAttr && titleAttr.trim()) return titleAttr.trim();

      const text = element.textContent && element.textContent.trim();
      if (text) return text;
    }

    // Yeni view-model yapılarında başlık bazen doğrudan item/button aria-label'ında bulunuyor.
    const ariaCandidates = [
      item,
      item.querySelector('button[aria-label]'),
      item.querySelector('[role="checkbox"][aria-label]'),
      item.querySelector('[aria-label]')
    ].filter(Boolean);

    for (const element of ariaCandidates) {
      const aria = element.getAttribute && element.getAttribute('aria-label');
      if (aria && aria.trim()) return aria.split(',')[0].trim();
    }

    return item.textContent ? item.textContent.trim() : '';
  }

  function getItems(scope) {
    if (!scope) return [];
    return Array.from(scope.querySelectorAll(ITEM_SELECTOR));
  }

  function isVisible(element) {
    if (!element || !element.isConnected) return false;
    if (element.closest('[hidden], [aria-hidden="true"]')) return false;

    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function findListContainer(modal) {
    if (!modal) return null;

    const candidates = Array.from(modal.querySelectorAll(LIST_SELECTOR));
    let best = null;
    let bestCount = 0;

    for (const candidate of candidates) {
      const count = getItems(candidate).length;
      if (count > bestCount) {
        best = candidate;
        bestCount = count;
      }
    }

    if (best) return best;

    const firstItem = modal.querySelector(ITEM_SELECTOR);
    if (!firstItem) return null;

    return firstItem.closest('#playlists, yt-list-view-model, #items') || firstItem.parentElement;
  }

  function ensureOriginalOrder(items) {
    for (const item of items) {
      if (!item.dataset.ytPlaylistSearchOrder) {
        originalOrderCounter += 1;
        item.dataset.ytPlaylistSearchOrder = String(originalOrderCounter);
      }
    }
  }

  function applyFilter(state) {
    const items = getItems(state.list);
    ensureOriginalOrder(items);

    const query = normalizeText(state.input.value);
    let visibleCount = 0;

    for (const item of items) {
      const matches = !query || normalizeText(getItemTitle(item)).includes(query);
      item.classList.toggle(HIDDEN_CLASS, !matches);
      if (matches) visibleCount += 1;
    }

    state.clearButton.hidden = !state.input.value;
    state.count.textContent = query ? `${visibleCount}/${items.length}` : String(items.length);
  }

  function sortItems(state) {
    const items = getItems(state.list);
    if (items.length < 2) return;

    ensureOriginalOrder(items);

    const direction = state.sortButton.dataset.direction || 'none';
    let nextDirection;

    if (direction === 'none') nextDirection = 'asc';
    else if (direction === 'asc') nextDirection = 'desc';
    else nextDirection = 'none';

    const sorted = [...items];

    if (nextDirection === 'none') {
      sorted.sort((a, b) =>
        Number(a.dataset.ytPlaylistSearchOrder || 0) - Number(b.dataset.ytPlaylistSearchOrder || 0)
      );
      state.sortButton.textContent = 'A-Z';
      state.sortButton.title = 'A-Z sırala';
    } else {
      sorted.sort((a, b) => {
        const titleA = getItemTitle(a);
        const titleB = getItemTitle(b);
        const compared = titleA.localeCompare(titleB, 'tr', {
          numeric: true,
          sensitivity: 'base'
        });
        return nextDirection === 'asc' ? compared : -compared;
      });

      state.sortButton.textContent = nextDirection === 'asc' ? 'A-Z ↓' : 'Z-A ↑';
      state.sortButton.title = nextDirection === 'asc'
        ? 'Z-A sırala'
        : 'Orijinal sıraya dön';
    }

    state.sortButton.dataset.direction = nextDirection;

    const parent = items[0].parentElement;
    if (!parent || !sorted.every(item => item.parentElement === parent)) return;

    const fragment = document.createDocumentFragment();
    sorted.forEach(item => fragment.appendChild(item));
    parent.appendChild(fragment);

    applyFilter(state);
  }

  function buildToolbar(list) {
    const toolbar = document.createElement('div');
    toolbar.className = TOOLBAR_CLASS;
    toolbar.dataset.platform = location.hostname === 'music.youtube.com' ? 'music' : 'youtube';

    const inputWrap = document.createElement('div');
    inputWrap.className = 'yt-playlist-search-input-wrap';

    const input = document.createElement('input');
    input.type = 'search';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = 'Oynatma listesi ara...';
    input.className = INPUT_CLASS;
    input.setAttribute('aria-label', 'Oynatma listesi ara');

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = CLEAR_CLASS;
    clearButton.textContent = '×';
    clearButton.title = 'Aramayı temizle';
    clearButton.setAttribute('aria-label', 'Aramayı temizle');
    clearButton.hidden = true;

    const count = document.createElement('span');
    count.className = COUNT_CLASS;
    count.setAttribute('aria-live', 'polite');

    const sortButton = document.createElement('button');
    sortButton.type = 'button';
    sortButton.className = SORT_CLASS;
    sortButton.textContent = 'A-Z';
    sortButton.title = 'A-Z sırala';
    sortButton.setAttribute('aria-label', 'Oynatma listelerini sırala');
    sortButton.dataset.direction = 'none';

    inputWrap.appendChild(input);
    inputWrap.appendChild(clearButton);
    toolbar.appendChild(inputWrap);
    toolbar.appendChild(count);
    toolbar.appendChild(sortButton);

    const state = { toolbar, input, clearButton, count, sortButton, list };

    for (const eventType of ['click', 'mousedown', 'mouseup', 'pointerdown', 'touchstart']) {
      toolbar.addEventListener(eventType, event => event.stopPropagation());
    }

    toolbar.addEventListener('keydown', event => {
      event.stopPropagation();

      if (event.key === 'Escape' && input.value) {
        event.preventDefault();
        input.value = '';
        applyFilter(state);
      }
    });

    input.addEventListener('input', () => applyFilter(state));

    clearButton.addEventListener('click', event => {
      event.preventDefault();
      input.value = '';
      applyFilter(state);
      input.focus();
    });

    sortButton.addEventListener('click', event => {
      event.preventDefault();
      sortItems(state);
    });

    return state;
  }

  function attachToModal(modal) {
    if (!modal || !isVisible(modal)) return false;

    const list = findListContainer(modal);
    if (!list) return false;

    const sheet = modal.closest('yt-contextual-sheet-layout, .ytm-bottom-sheet-layout') || modal;
    sheet.classList.add('yt-playlist-enhanced-sheet');

    const items = getItems(list);
    if (!items.length) return false;

    list.classList.add(LIST_CLASS);
    ensureOriginalOrder(items);

    let toolbar = modal.querySelector(`.${TOOLBAR_CLASS}`);
    let state = toolbar && toolbar._ytPlaylistSearchState;

 
    const toolbarIsComplete = Boolean(
      state &&
      state.input && state.input.isConnected &&
      state.clearButton && state.clearButton.isConnected &&
      state.count && state.count.isConnected &&
      state.sortButton && state.sortButton.isConnected
    );

    if (!toolbar || !toolbarIsComplete) {
      const oldToolbar = toolbar;
      state = buildToolbar(list);
      toolbar = state.toolbar;

      if (oldToolbar && oldToolbar.parentElement) {
        oldToolbar.replaceWith(toolbar);
      } else {
        const insertionParent = list.parentElement;
        if (!insertionParent) return false;
        insertionParent.insertBefore(toolbar, list);
      }

      toolbar._ytPlaylistSearchState = state;
    } else {
      state.list = list;
      toolbar.dataset.platform = location.hostname === 'music.youtube.com' ? 'music' : 'youtube';
    }

    applyFilter(state);
    return true;
  }

  function attachPlaylistTools() {
    const modals = Array.from(document.querySelectorAll(MODAL_SELECTOR));
    if (!modals.length) return false;

    let attached = false;

    for (const modal of modals) {
      if (attachToModal(modal)) attached = true;
    }

    return attached;
  }

  function scheduleAttach() {
    if (attachScheduled) return;
    attachScheduled = true;

    requestAnimationFrame(() => {
      attachScheduled = false;
      attachPlaylistTools();
    });
  }

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length || mutation.removedNodes.length) {
        scheduleAttach();
        break;
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });


  document.addEventListener('click', () => {
    scheduleAttach();
    setTimeout(scheduleAttach, 120);
    setTimeout(scheduleAttach, 320);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleAttach, { once: true });
  } else {
    scheduleAttach();
  }
})();
