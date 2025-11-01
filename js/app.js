/**
 * Main Application Script
 * Exhibition Platform - Core Logic
 * Version: 2.0.2 - CDN Cache Bust
 *
 * Handles:
 * - Page initialization
 * - Data loading (personas, artworks)
 * - Component rendering
 * - Event listeners
 * - State management
 */

// ==================== APPLICATION STATE ====================

const AppState = {
  personas: [],
  artworks: [],
  critiqueLibrary: [],
  selectedArtwork: null,
  selectedPersona: null,
  loading: false,

  init() {
    console.log('AppState initialized');
  },

  setSelectedArtwork(id) {
    this.selectedArtwork = id;
    this.updateSelectionStatus();
    console.log('Selected artwork:', id);
  },

  setSelectedPersona(id) {
    this.selectedPersona = id;
    this.updateSelectionStatus();
    console.log('Selected persona:', id);
  },

  getCritique(artworkId, personaId) {
    return this.critiqueLibrary.find(c =>
      c.artwork_id === artworkId && c.persona_id === personaId
    );
  },

  updateSelectionStatus() {
    const statusEl = document.getElementById('selectionStatus');
    const btnEl = document.getElementById('getCritiqueBtn');
    if (!statusEl || !btnEl) return;

    if (this.selectedArtwork && this.selectedPersona) {
      const artwork = this.artworks.find(a => a.id === this.selectedArtwork);
      const persona = this.personas.find(p => p.persona_id === this.selectedPersona);
      statusEl.textContent = `已选择: ${artwork?.title_zh || artwork?.title} & ${persona?.name_zh || persona?.name_en}`;
      btnEl.disabled = false;
      btnEl.style.opacity = '1';
    } else {
      statusEl.textContent = '请选择一件作品和一位评论家';
      btnEl.disabled = true;
      btnEl.style.opacity = '0.5';
    }
  }
};

// ==================== DATA LOADING ====================

async function loadData() {
  try {
    // Load personas data
    const personasResponse = await fetch('/data/personas.json');
    if (!personasResponse.ok) throw new Error(`HTTP ${personasResponse.status}`);
    const personasData = await personasResponse.json();
    AppState.personas = personasData.personas;
    console.log('Loaded personas:', AppState.personas);

    // Load artworks and critiques from embedded data (avoids CDN caching issues)
    if (typeof ExhibitionData !== 'undefined') {
      AppState.artworks = ExhibitionData.artworks;
      AppState.critiqueLibrary = ExhibitionData.critiques;
      console.log('Loaded artworks:', AppState.artworks.length);
      console.log('Loaded critique library:', AppState.critiqueLibrary.length, 'critiques');
    } else {
      throw new Error('Exhibition data not loaded');
    }

    renderPersonas();
    renderArtworkSelector();
    renderPersonaSelector();
    setupEventListeners();
  } catch (error) {
    console.error('Error loading data:', error);
    showError('无法加载展览数据，请刷新页面重试。');
    renderPersonas(); // Still render whatever we have
  }
}

// ==================== RENDERING ====================

function renderArtworkSelector() {
  const container = document.getElementById('artworkSelector');
  if (!container || !AppState.artworks || AppState.artworks.length === 0) {
    console.warn('Artwork selector container not found or no artworks loaded');
    return;
  }

  container.innerHTML = '';

  AppState.artworks.forEach(artwork => {
    const card = document.createElement('div');
    card.className = 'artwork-card';
    card.setAttribute('data-artwork-id', artwork.id);
    card.style.cssText = `
      padding: var(--space-md);
      border: 2px solid transparent;
      border-radius: var(--border-radius-lg);
      background-color: #F0EEE8;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    `;
    card.innerHTML = `
      <div style="font-size: 32px; margin-bottom: var(--space-sm);">🖼️</div>
      <p style="font-size: var(--size-caption); font-weight: 600; color: var(--color-text-primary); margin: 0 0 var(--space-xs) 0;">
        ${artwork.title_zh}
      </p>
      <p style="font-size: 12px; color: var(--color-text-secondary); margin: 0;">
        ${artwork.year}
      </p>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.artwork-card').forEach(c => {
        c.style.borderColor = 'transparent';
        c.style.backgroundColor = '#F0EEE8';
      });
      card.style.borderColor = 'var(--color-accent)';
      card.style.backgroundColor = '#FFF8F0';
      AppState.setSelectedArtwork(artwork.id);
    });

    container.appendChild(card);
  });
}

function renderPersonaSelector() {
  const container = document.getElementById('personaSelector');
  if (!container || !AppState.personas || AppState.personas.length === 0) {
    console.warn('Persona selector container not found or no personas loaded');
    return;
  }

  container.innerHTML = '';

  AppState.personas.forEach(persona => {
    const card = document.createElement('div');
    card.className = 'persona-selector-card';
    card.setAttribute('data-persona-id', persona.persona_id);
    card.style.cssText = `
      padding: var(--space-md);
      border: 2px solid transparent;
      border-radius: var(--border-radius-lg);
      background-color: #F0EEE8;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    `;
    card.innerHTML = `
      <div style="
        width: 60px;
        height: 60px;
        background-color: #E8E4D8;
        border-radius: var(--border-radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin: 0 auto var(--space-sm);
      ">
        ${persona.name_zh.charAt(0)}
      </div>
      <p style="font-size: 12px; font-weight: 600; color: var(--color-text-primary); margin: 0; line-height: 1.4;">
        ${persona.name_zh}<br><span style="font-weight: 400; font-size: 10px; color: var(--color-text-secondary);">${persona.name_en}</span>
      </p>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.persona-selector-card').forEach(c => {
        c.style.borderColor = 'transparent';
        c.style.backgroundColor = '#F0EEE8';
      });
      card.style.borderColor = 'var(--color-accent)';
      card.style.backgroundColor = '#FFF8F0';
      AppState.setSelectedPersona(persona.persona_id);
    });

    container.appendChild(card);
  });
}

function renderPersonas() {
  const container = document.querySelector('#personas .grid');
  if (!container || !AppState.personas || AppState.personas.length === 0) {
    console.warn('Personas container not found or no personas loaded');
    return;
  }

  // Clear placeholder
  container.innerHTML = '';

  // Render each persona
  AppState.personas.forEach(persona => {
    const card = createPersonaCard(persona);
    container.appendChild(card);
  });
}

function createPersonaCard(persona) {
  const card = document.createElement('div');
  card.className = 'card card-lg';
  card.innerHTML = `
    <div class="text-center">
      <div class="persona-portrait" style="
        width: 120px;
        height: 120px;
        background-color: #F0EEE8;
        margin: 0 auto var(--space-md);
        border-radius: var(--border-radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--size-display-small);
        color: var(--color-gray-accent);
      ">
        ${persona.name_zh ? persona.name_zh.charAt(0) : '·'}
      </div>
      <h3>${persona.name_zh} <small style="font-size: 0.6em; font-weight: normal;">${persona.name_en}</small></h3>
      <p class="mt-sm" style="font-size: var(--size-caption); color: var(--color-text-secondary);">
        ${persona.era}
      </p>
      <p class="mt-md" style="font-size: var(--size-body); text-align: left; line-height: 1.6;">
        ${persona.biography}
      </p>
      <div class="mt-lg">
        <strong style="display: block; margin-bottom: var(--space-sm); font-size: var(--size-caption); color: var(--color-text-secondary);">
          评论维度
        </strong>
        <div style="
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-sm);
          text-align: left;
          font-size: var(--size-caption);
        ">
          <div><strong>R</strong> 视觉表现: ${persona.rpait_weights?.representation || '-'}</div>
          <div><strong>P</strong> 哲学思想: ${persona.rpait_weights?.philosophy || '-'}</div>
          <div><strong>A</strong> 美学原理: ${persona.rpait_weights?.aesthetics || '-'}</div>
          <div><strong>I</strong> 诠释深度: ${persona.rpait_weights?.interpretation || '-'}</div>
        </div>
      </div>
    </div>
  `;
  return card;
}

// ==================== ERROR HANDLING ====================

function showError(message) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-error';
  alert.innerHTML = `
    <div class="alert-title">错误</div>
    <div class="alert-message">${message}</div>
  `;
  document.querySelector('main').insertBefore(alert, document.querySelector('main').firstChild);
}

// ==================== SMOOTH SCROLLING ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#main-content') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  AppState.init();

  // Load data and set up interactive features
  loadData();
});

function setupEventListeners() {
  // Get Critique Button
  const getCritiqueBtn = document.getElementById('getCritiqueBtn');
  if (getCritiqueBtn) {
    getCritiqueBtn.addEventListener('click', handleGetCritique);
  }

  // Close Critique Button
  const closeCritiqueBtn = document.getElementById('closeCritiqueBtn');
  if (closeCritiqueBtn) {
    closeCritiqueBtn.addEventListener('click', hideCritique);
  }

  console.log('Event listeners set up');
}

function handleGetCritique() {
  if (!AppState.selectedArtwork || !AppState.selectedPersona) {
    console.warn('Please select both artwork and persona');
    return;
  }

  const critique = AppState.getCritique(AppState.selectedArtwork, AppState.selectedPersona);
  if (!critique) {
    console.warn('Critique not found');
    showError('评论未找到，请重试。');
    return;
  }

  displayCritique(critique);
}

function displayCritique(critique) {
  const artwork = AppState.artworks.find(a => a.id === critique.artwork_id);
  const persona = AppState.personas.find(p => p.persona_id === critique.persona_id);

  if (!artwork || !persona) {
    console.warn('Artwork or persona not found');
    return;
  }

  // Update critique display
  document.getElementById('critiquePersonaName').textContent = `${persona.name_zh} (${persona.name_en})`;
  document.getElementById('critiqueArtworkTitle').textContent = `${artwork.title_zh}`;
  document.getElementById('critiqueEnglish').textContent = critique.critique;
  document.getElementById('critiqueChinese').textContent = critique.critique_zh;

  // Show critique display
  const display = document.getElementById('critiqueDisplay');
  if (display) {
    display.style.display = 'block';
    // Smooth scroll to critique
    setTimeout(() => {
      display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  console.log('Critique displayed:', critique);
}

function hideCritique() {
  const display = document.getElementById('critiqueDisplay');
  if (display) {
    display.style.display = 'none';
  }
}

// ==================== UTILITIES ====================

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppState, loadData, renderPersonas };
}
