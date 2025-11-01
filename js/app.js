/**
 * Main Application Script
 * Exhibition Platform - Core Logic
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
    console.log('Selected artwork:', id);
  },

  setSelectedPersona(id) {
    this.selectedPersona = id;
    console.log('Selected persona:', id);
  },

  getCritique(artworkId, personaId) {
    return this.critiqueLibrary.find(c =>
      c.artwork_id === artworkId && c.persona_id === personaId
    );
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

    // Load artworks data
    const artworksResponse = await fetch('/data/artworks.json');
    if (!artworksResponse.ok) throw new Error(`HTTP ${artworksResponse.status}`);
    const artworksData = await artworksResponse.json();
    AppState.artworks = artworksData.artworks;
    console.log('Loaded artworks:', AppState.artworks);

    // Load pre-written critiques (optional - silently fail if unavailable)
    try {
      const timestamp = new Date().getTime();
      const critiquesResponse = await fetch(`/data/critiques.json?v=${timestamp}`);
      if (critiquesResponse.ok) {
        const critiquesData = await critiquesResponse.json();
        AppState.critiqueLibrary = critiquesData.critiques;
        console.log('Loaded critique library:', AppState.critiqueLibrary.length, 'critiques');
      } else {
        console.warn('Critique library not available, continuing without it');
        AppState.critiqueLibrary = [];
      }
    } catch (err) {
      console.warn('Could not load critique library:', err);
      AppState.critiqueLibrary = [];
    }

    renderPersonas();
  } catch (error) {
    console.error('Error loading data:', error);
    showError('无法加载展览数据，请刷新页面重试。');
    renderPersonas(); // Still render whatever we have
  }
}

// ==================== RENDERING ====================

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

  // Check if we're in a development environment with local data
  // For now, try to load from JSON files
  loadData();

  // Add any additional event listeners here
  setupEventListeners();
});

function setupEventListeners() {
  // Placeholder for future interactive features
  console.log('Event listeners set up');
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
