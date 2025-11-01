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
      DataIndexes.init();
    }

    renderPersonas();
    renderArtworkSelector();
    renderPersonaSelector();
    setupEventListeners();

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
        c.style.backgroundColor = 'var(--color-card-hover)';
      });
      card.style.borderColor = 'var(--color-accent)';
      card.style.backgroundColor = 'var(--color-card-warm)';
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
    card.innerHTML = `
      <div style="
        width: 60px;
        height: 60px;
        background-color: var(--color-card-border);
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
        c.style.backgroundColor = 'var(--color-persona-bg)';
      });
      card.style.borderColor = 'var(--color-accent)';
      card.style.backgroundColor = 'var(--color-card-warm)';
      AppState.setSelectedPersona(persona.id);
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
        background-color: var(--color-persona-bg);
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

  // Get Comparison Button
  const getComparisonBtn = document.getElementById('getComparisonBtn');
  if (getComparisonBtn) {
    getComparisonBtn.addEventListener('click', handleGetComparison);
  }

  // Close Comparison Button
  const closeComparisonBtn = document.getElementById('closeComparisonBtn');
  if (closeComparisonBtn) {
    closeComparisonBtn.addEventListener('click', hideComparison);
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
    card.innerHTML = `
      <div style="margin-bottom: var(--space-sm);">
        <h5 style="font-size: var(--size-body); font-weight: 600; color: var(--color-text-primary); margin: 0 0 var(--space-xs) 0;">
          ${persona.name_zh} <span style="font-size: 0.7em; font-weight: normal; color: var(--color-text-secondary);">${persona.name_en}</span>
        </h5>
        <p style="font-size: var(--size-caption); color: var(--color-text-secondary); margin: 0;">
          ${persona.era}
        </p>
      </div>
      <div style="line-height: 1.6;">
        <p style="font-size: var(--size-caption); color: var(--color-text-primary); margin: 0 0 var(--space-sm) 0;">
          <strong>English:</strong>
        </p>
        <p style="font-size: var(--size-caption); color: var(--color-text-primary); margin: 0 0 var(--space-md) 0;">
          ${critique.critique}
        </p>
        <p style="font-size: var(--size-caption); color: var(--color-text-primary); margin: 0 0 var(--space-sm) 0;">
          <strong>中文：</strong>
        </p>
        <p style="font-size: var(--size-caption); color: var(--color-text-primary); margin: 0;">
          ${critique.critique_zh}
        </p>
      </div>
      <div style="margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px solid #f0f0f0;">
        <p style="font-size: var(--size-caption); color: var(--color-text-secondary); margin: 0;">
          <strong>评论维度：</strong> R ${persona.rpait_weights?.representation || '-'} |
          P ${persona.rpait_weights?.philosophy || '-'} |
          A ${persona.rpait_weights?.aesthetics || '-'} |
          I ${persona.rpait_weights?.interpretation || '-'} |
          T ${persona.rpait_weights?.technique || '-'}
        </p>
      </div>
    `;
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
