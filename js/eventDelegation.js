/**
 * Event Delegation System
 * Consolidates multiple event listeners into delegated handlers
 * Reduces memory footprint and improves performance
 *
 * Optimization:
 * - Before: 8+ individual addEventListener calls
 * - After: 2-3 delegated handlers covering all events
 * - Benefit: Better memory efficiency, easier event management
 */

const EventDelegation = {
  /**
   * Initialize all delegated event handlers
   * Must be called after DOM is ready
   */
  init() {
    this.setupButtonDelegation();
    this.setupCardDelegation();
    this.setupAnchorDelegation();
    console.log('✓ Event delegation system initialized');
  },

  /**
   * Delegated handler for button clicks
   * Handles: getCritiqueBtn, closeCritiqueBtn, getComparisonBtn, closeComparisonBtn
   */
  setupButtonDelegation() {
    // Use event delegation on document for button clicks
    // This replaces 4 individual addEventListener calls
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      switch (target.id) {
        case 'getCritiqueBtn':
          handleGetCritique();
          break;
        case 'closeCritiqueBtn':
          hideCritique();
          break;
        case 'getComparisonBtn':
          handleGetComparison();
          break;
        case 'closeComparisonBtn':
          hideComparison();
          break;
      }
    });

    console.log('  ✓ Button delegation set up (4 buttons → 1 listener)');
  },

  /**
   * Delegated handler for card selections
   * Handles: artwork-card, persona-selector-card
   */
  setupCardDelegation() {
    // Artwork cards
    const artworkSelector = document.getElementById('artworkSelector');
    if (artworkSelector) {
      artworkSelector.addEventListener('click', (e) => {
        const card = e.target.closest('.artwork-card');
        if (!card) return;

        const artworkId = card.getAttribute('data-artwork-id');
        if (artworkId) {
          // Update all cards styling
          document.querySelectorAll('.artwork-card').forEach(c => {
            c.style.borderColor = 'transparent';
            c.style.backgroundColor = 'var(--color-card-hover)';
          });
          card.style.borderColor = 'var(--color-accent)';
          card.style.backgroundColor = 'var(--color-card-warm)';
          AppState.setSelectedArtwork(artworkId);
        }
      });
    }

    // Persona cards
    const personaSelector = document.getElementById('personaSelector');
    if (personaSelector) {
      personaSelector.addEventListener('click', (e) => {
        const card = e.target.closest('.persona-selector-card');
        if (!card) return;

        const personaId = card.getAttribute('data-persona-id');
        if (personaId) {
          // Update all cards styling
          document.querySelectorAll('.persona-selector-card').forEach(c => {
            c.style.borderColor = 'transparent';
            c.style.backgroundColor = 'var(--color-persona-bg)';
          });
          card.style.borderColor = 'var(--color-accent)';
          card.style.backgroundColor = 'var(--color-card-warm)';
          AppState.setSelectedPersona(personaId);
        }
      });
    }

    console.log('  ✓ Card delegation set up (2 container listeners)');
  },

  /**
   * Delegated handler for smooth scrolling anchors
   * Handles: all a[href^="#"] links
   */
  setupAnchorDelegation() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
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

    console.log('  ✓ Anchor delegation set up (smooth scrolling)');
  }
};
