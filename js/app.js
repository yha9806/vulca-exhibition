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
    // Use DataIndexes for O(1) lookup instead of array.find() O(n)
    if (typeof DataIndexes !== 'undefined') {
      return DataIndexes.getCritique(artworkId, personaId);
    }
    // Fallback to linear search if DataIndexes not available
    return this.critiqueLibrary.find(c =>
      c.artwork_id === artworkId && c.persona_id === personaId
    );
  },

  updateSelectionStatus() {
    const statusEl = document.getElementById('selectionStatus');
    const btnEl = document.getElementById('getCritiqueBtn');
    if (!statusEl || !btnEl) return;

    if (this.selectedArtwork && this.selectedPersona) {
      const artwork = (typeof DataIndexes !== 'undefined')
        ? DataIndexes.getArtwork(this.selectedArtwork)
        : this.artworks.find(a => a.id === this.selectedArtwork);
      const persona = (typeof DataIndexes !== 'undefined')
        ? DataIndexes.getPersona(this.selectedPersona)
        : this.personas.find(p => p.id === this.selectedPersona);
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
  if (typeof PerformanceMonitor !== 'undefined') {
    PerformanceMonitor.mark('data-loading-start');
  }

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

    // Initialize data indexes for O(1) lookups
    if (typeof DataIndexes !== 'undefined') {
      if (typeof PerformanceMonitor !== 'undefined') {
        PerformanceMonitor.mark('data-index-init-start');
      }
      DataIndexes.init();
      if (typeof PerformanceMonitor !== 'undefined') {
        PerformanceMonitor.mark('data-index-init-end');
        PerformanceMonitor.measure('data-index-init', 'data-index-init-start', 'data-index-init-end');
      }
    }

    if (typeof PerformanceMonitor !== 'undefined') {
      PerformanceMonitor.mark('rendering-start');
    }

    renderPersonas();
    renderArtworkSelector();
    renderPersonaSelector();
    setupEventListeners();

    if (typeof PerformanceMonitor !== 'undefined') {
      PerformanceMonitor.mark('rendering-end');
      PerformanceMonitor.measure('rendering', 'rendering-start', 'rendering-end');
      PerformanceMonitor.mark('data-loading-end');
      PerformanceMonitor.measure('data-loading', 'data-loading-start', 'data-loading-end');
    }

    // Initialize exhibition plan if available
    if (typeof initExhibitionPlan !== 'undefined') {
      initExhibitionPlan();
    }
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
      background-color: var(--color-card-hover);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    `;
    card.innerHTML = Templates.render('artworkCard', artwork);

    // Event listener removed - handled by event delegation in eventDelegation.js
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
    card.setAttribute('data-persona-id', persona.id);
    card.style.cssText = `
      padding: var(--space-md);
      border: 2px solid transparent;
      border-radius: var(--border-radius-lg);
      background-color: var(--color-persona-bg);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    `;
    card.innerHTML = Templates.render('personaSelectorCard', persona);

    // Event listener removed - handled by event delegation in eventDelegation.js
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
  card.innerHTML = Templates.render('personaDetailCard', persona);
  return card;
}

// ==================== ERROR HANDLING ====================

function showError(message) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-error';
  alert.innerHTML = Templates.render('errorAlert', message);
  document.querySelector('main').insertBefore(alert, document.querySelector('main').firstChild);
}

// ==================== SMOOTH SCROLLING ====================
// Smooth scrolling now handled by event delegation in eventDelegation.js

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize performance monitoring
  if (typeof PerformanceMonitor !== 'undefined') {
    PerformanceMonitor.init();
  }

  console.log('DOM Content Loaded');
  AppState.init();

  // Load data and set up interactive features
  loadData();
});

function setupEventListeners() {
  // Initialize delegated event handlers
  if (typeof EventDelegation !== 'undefined') {
    EventDelegation.init();
  } else {
    console.warn('EventDelegation not loaded, falling back to direct listeners');
    // Fallback for if eventDelegation.js fails to load
    const getCritiqueBtn = document.getElementById('getCritiqueBtn');
    if (getCritiqueBtn) getCritiqueBtn.addEventListener('click', handleGetCritique);
    const closeCritiqueBtn = document.getElementById('closeCritiqueBtn');
    if (closeCritiqueBtn) closeCritiqueBtn.addEventListener('click', hideCritique);
    const getComparisonBtn = document.getElementById('getComparisonBtn');
    if (getComparisonBtn) getComparisonBtn.addEventListener('click', handleGetComparison);
    const closeComparisonBtn = document.getElementById('closeComparisonBtn');
    if (closeComparisonBtn) closeComparisonBtn.addEventListener('click', hideComparison);
  }

  console.log('Event listeners set up (delegated)');
}

function handleGetCritique() {
  if (!AppState.selectedArtwork || !AppState.selectedPersona) {
    console.warn('Please select both artwork and persona');
    return;
  }

  const interactionStart = performance.now();
  const critique = AppState.getCritique(AppState.selectedArtwork, AppState.selectedPersona);
  if (!critique) {
    console.warn('Critique not found');
    showError('评论未找到，请重试。');
    return;
  }

  displayCritique(critique);
}

function displayCritique(critique) {
  const artwork = (typeof DataIndexes !== 'undefined')
    ? DataIndexes.getArtwork(critique.artwork_id)
    : AppState.artworks.find(a => a.id === critique.artwork_id);
  const persona = (typeof DataIndexes !== 'undefined')
    ? DataIndexes.getPersona(critique.persona_id)
    : AppState.personas.find(p => p.id === critique.persona_id);

  if (!artwork || !persona) {
    console.warn('Artwork or persona not found');
    return;
  }

  // Update critique display
  document.getElementById('critiquePersonaName').textContent = `${persona.name_zh} (${persona.name_en})`;
  document.getElementById('critiqueArtworkTitle').textContent = `${artwork.title_zh}`;
  document.getElementById('critiqueEnglish').textContent = critique.critique;
  document.getElementById('critiqueChinese').textContent = critique.critique_zh;

  // Draw RPAIT chart
  drawRpaitChart(persona);

  // Show critique display
  const display = document.getElementById('critiqueDisplay');
  if (display) {
    display.style.display = 'block';
    // Smooth scroll to critique
    setTimeout(() => {
      display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  // Track interaction performance if available
  if (typeof PerformanceMonitor !== 'undefined' && window.__interactionStart) {
    const duration = performance.now() - window.__interactionStart;
    PerformanceMonitor.trackInteraction('get-critique', duration);
    delete window.__interactionStart;
  }

  console.log('Critique displayed:', critique);
}

function hideCritique() {
  const display = document.getElementById('critiqueDisplay');
  if (display) {
    display.style.display = 'none';
  }
}

// ==================== COMPARISON VIEW ====================

function handleGetComparison() {
  if (!AppState.selectedArtwork) {
    console.warn('Please select an artwork for comparison');
    return;
  }

  // Get all critiques for the selected artwork
  const critiques = AppState.critiqueLibrary.filter(c => c.artwork_id === AppState.selectedArtwork);
  if (critiques.length === 0) {
    console.warn('No critiques found for this artwork');
    showError('未找到该作品的评论');
    return;
  }

  displayComparison(critiques);
}

function displayComparison(critiques) {
  const artwork = (typeof DataIndexes !== 'undefined')
    ? DataIndexes.getArtwork(critiques[0].artwork_id)
    : AppState.artworks.find(a => a.id === critiques[0].artwork_id);
  if (!artwork) {
    console.warn('Artwork not found');
    return;
  }

  // Update comparison title
  document.getElementById('comparisonArtworkTitle').textContent = `${artwork.title_zh} - 多角度评论`;

  // Clear previous comparison grid
  const comparisonGrid = document.getElementById('comparisonGrid');
  comparisonGrid.innerHTML = '';

  // Create comparison card for each critique
  critiques.forEach(critique => {
    const persona = (typeof DataIndexes !== 'undefined')
      ? DataIndexes.getPersona(critique.persona_id)
      : AppState.personas.find(p => p.id === critique.persona_id);
    if (!persona) return;

    const card = document.createElement('div');
    card.style.cssText = `
      background-color: #fff;
      padding: var(--space-md);
      border-radius: var(--border-radius-lg);
      border: 1px solid #e0e0e0;
    `;
    card.innerHTML = Templates.render('comparisonCard', critique, persona);
    comparisonGrid.appendChild(card);
  });

  // Show comparison display
  const display = document.getElementById('comparisonDisplay');
  if (display) {
    display.style.display = 'block';
    setTimeout(() => {
      display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  console.log('Comparison displayed for', critiques.length, 'personas');
}

function hideComparison() {
  const display = document.getElementById('comparisonDisplay');
  if (display) {
    display.style.display = 'none';
  }
}

// ==================== RPAIT VISUALIZATION ====================

let rpaitChartInstance = null;

function drawRpaitChart(persona) {
  const canvas = document.getElementById('rpaitChart');
  if (!canvas || !persona || !persona.rpait_weights) {
    console.warn('Canvas or persona data not available for RPAIT chart');
    return;
  }

  // Destroy existing chart if it exists
  if (rpaitChartInstance) {
    rpaitChartInstance.destroy();
  }

  const weights = persona.rpait_weights;
  const data = {
    labels: ['表现 R', '哲学 P', '美学 A', '诠释 I', '技术 T'],
    datasets: [{
      label: persona.name_zh,
      data: [
        weights.representation || 0,
        weights.philosophy || 0,
        weights.aesthetics || 0,
        weights.interpretation || 0,
        weights.technique || 0
      ],
      borderColor: 'var(--color-accent, #D4A373)',
      backgroundColor: 'rgba(212, 163, 115, 0.1)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: 'var(--color-accent, #D4A373)',
      pointBorderColor: 'var(--color-white-pure, #fff)',
      pointBorderWidth: 2
    }]
  };

  const ctx = canvas.getContext('2d');
  rpaitChartInstance = new Chart(ctx, {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 8,
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
          borderColor: 'var(--color-accent, #D4A373)',
          borderWidth: 1
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          ticks: {
            stepSize: 2,
            font: { size: 10 },
            color: 'var(--color-text-secondary, #999)'
          },
          grid: {
            color: 'var(--color-border, #e0e0e0)'
          },
          pointLabels: {
            font: { size: 11 },
            color: 'var(--color-text-primary, #333)'
          }
        }
      }
    }
  });

  console.log('RPAIT chart drawn for:', persona.name_zh);
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

// ==================== EXHIBITION PLAN RENDERING ====================

function initExhibitionPlan() {
  if (typeof ExhibitionPlan === 'undefined') {
    console.warn('ExhibitionPlan data not loaded');
    return;
  }

  renderBudgetChart();
  renderBudgetTable();
  renderTimeline();
  renderUpgrades();
  renderRisks();
  console.log('Exhibition plan initialized');
}

function renderBudgetChart() {
  const canvas = document.getElementById('budgetChart');
  if (!canvas) return;

  const budgetItems = ExhibitionPlan.budget.items;
  const labels = budgetItems.map(item => item.name_zh);
  const data = budgetItems.map(item => item.budget);
  const colors = budgetItems.map(item => item.color);

  // Destroy existing chart if it exists
  if (window.budgetChartInstance) {
    window.budgetChartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  window.budgetChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12 },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const percentage = ((value / ExhibitionPlan.budget.subtotal) * 100).toFixed(1);
              return `${label}: ¥${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function renderBudgetTable() {
  const container = document.getElementById('budgetTable');
  if (!container) return;

  let html = '<table style="width: 100%; border-collapse: collapse; font-size: var(--size-body);">';
  html += '<thead><tr style="background-color: var(--color-bg-light); border-bottom: 2px solid var(--color-accent);">';
  html += '<th style="padding: var(--space-sm); text-align: left;">类别</th>';
  html += '<th style="padding: var(--space-sm); text-align: left;">具体项目</th>';
  html += '<th style="padding: var(--space-sm); text-align: right;">单价</th>';
  html += '<th style="padding: var(--space-sm); text-align: right;">小计</th>';
  html += '</tr></thead><tbody>';

  ExhibitionPlan.budget.items.forEach((category, idx) => {
    category.details.forEach((detail, detailIdx) => {
      const isFirstRow = detailIdx === 0;
      html += '<tr style="border-bottom: 1px solid var(--color-border);">';

      if (isFirstRow) {
        html += `<td style="padding: var(--space-sm); font-weight: 600; color: var(--color-accent); vertical-align: top; border-right: 2px solid ${category.color};" rowspan="${category.details.length}">`;
        html += `${category.name_zh}<br><span style="font-size: var(--size-caption); color: var(--color-text-secondary); font-weight: 400;">¥${category.budget}</span>`;
        html += '</td>';
      }

      html += `<td style="padding: var(--space-sm);">${detail.item}</td>`;
      html += `<td style="padding: var(--space-sm); text-align: right;">¥${detail.price}</td>`;
      html += `<td style="padding: var(--space-sm); text-align: right; font-weight: 600;">¥${detail.subtotal}</td>`;
      html += '</tr>';
    });
  });

  html += '<tr style="background-color: var(--color-bg-lighter); border-top: 2px solid var(--color-accent); font-weight: 600;">';
  html += '<td colspan="3" style="padding: var(--space-sm); text-align: right;">小计</td>';
  html += `<td style="padding: var(--space-sm); text-align: right;">¥${ExhibitionPlan.budget.subtotal}</td>`;
  html += '</tr>';
  html += '<tr style="background-color: var(--color-border-light);">';
  html += '<td colspan="3" style="padding: var(--space-sm); text-align: right;">应急储备金 (5%)</td>';
  html += `<td style="padding: var(--space-sm); text-align: right;">¥${ExhibitionPlan.budget.contingency}</td>`;
  html += '</tr>';
  html += '<tr style="background-color: var(--color-accent); color: white; font-weight: 700;">';
  html += '<td colspan="3" style="padding: var(--space-sm); text-align: right;">总计</td>';
  html += `<td style="padding: var(--space-sm); text-align: right;">¥${ExhibitionPlan.budget.total}</td>`;
  html += '</tr></tbody></table>';

  container.innerHTML = html;
}

function renderTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  let html = '';
  ExhibitionPlan.timeline.forEach((week) => {
    html += `<div style="padding: var(--space-md); border-left: 4px solid var(--color-accent); background-color: #fafaf9; border-radius: var(--border-radius-lg);">`;
    html += `<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-sm);">`;
    html += `<h4 style="font-size: var(--size-body); margin: 0;">第 ${week.week} 周：${week.phase_zh}</h4>`;
    html += `<span style="font-size: var(--size-caption); color: var(--color-text-secondary);">${week.phase_en}</span>`;
    html += `</div>`;
    html += `<ul style="margin: 0; padding-left: var(--space-lg); color: var(--color-text-secondary);">`;
    week.tasks.forEach(task => {
      html += `<li style="margin-bottom: var(--space-xs);">${task}</li>`;
    });
    html += `</ul></div>`;
  });

  container.innerHTML = html;
}

function renderUpgrades() {
  const container = document.getElementById('upgradesContainer');
  if (!container) return;

  let html = '';
  ExhibitionPlan.upgrades.forEach((upgrade) => {
    html += `<div style="padding: var(--space-md); border: 1px solid #e0e0e0; border-radius: var(--border-radius-lg); background-color: #fafaf9;">`;
    html += `<h4 style="font-size: var(--size-body); margin: 0 0 var(--space-sm) 0; color: var(--color-accent);">`;
    html += `${upgrade.name_zh}`;
    html += `</h4>`;
    html += `<p style="font-size: var(--size-caption); color: var(--color-text-secondary); margin: 0 0 var(--space-md) 0;">`;
    html += typeof upgrade.cost === 'number' ? `+¥${upgrade.cost}` : upgrade.cost;
    html += `</p>`;
    html += `<ul style="margin: 0; padding-left: var(--space-lg); font-size: var(--size-caption);">`;
    upgrade.features.forEach(feature => {
      html += `<li style="margin-bottom: var(--space-xs); color: var(--color-text-primary);">${feature}</li>`;
    });
    html += `</ul></div>`;
  });

  container.innerHTML = html;
}

function renderRisks() {
  const container = document.getElementById('risksContainer');
  if (!container) return;

  let html = '';
  ExhibitionPlan.risks.forEach((risk) => {
    html += `<div style="padding: var(--space-md); border-left: 4px solid var(--color-error-dark); background-color: var(--color-error-light); border-radius: var(--border-radius-lg);">`;
    html += `<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-sm);">`;
    html += `<div>`;
    html += `<h4 style="font-size: var(--size-body); margin: 0 0 var(--space-xs) 0; color: var(--color-error-dark);">`;
    html += `${risk.risk_zh} <span style="font-size: var(--size-caption); color: var(--color-text-secondary);">${risk.risk_en}</span>`;
    html += `</h4>`;
    html += `<p style="margin: 0; font-size: var(--size-caption); color: var(--color-text-secondary);">`;
    html += `<strong>可能影响：</strong> ${risk.impact_zh}`;
    html += `</p>`;
    html += `</div>`;
    html += `</div>`;
    html += `<div style="padding: var(--space-sm); background-color: var(--color-info-light); border-radius: var(--border-radius-lg); border-left: 3px solid var(--color-info);">`;
    html += `<p style="margin: 0; font-size: var(--size-caption); color: var(--color-text-primary);">`;
    html += `<strong>应对措施：</strong> ${risk.mitigation_zh}`;
    html += `</p>`;
    html += `</div>`;
    html += `</div>`;
  });

  container.innerHTML = html;
}

// ==================== INITIALIZATION ====================

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppState, loadData, renderPersonas };
}
