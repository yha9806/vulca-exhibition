/**
 * Particle Effects Configuration for VULCA Platform
 * Sougwen Chung Aesthetic Philosophy - "潮汐的负形" (Tides of Negative Space)
 *
 * Purpose: Enhance hero section with subtle, poetic floating particles
 * that embody the algorithmic process as digital brush strokes.
 *
 * Philosophy:
 * - Low density (80-150 particles) preserves breathing room
 * - High transparency (0.1-0.3 alpha) maintains minimalism
 * - Slow motion (speed: 2) for meditative quality
 * - Organic drift represents AI's "thinking" process
 * - Respects user's motion preferences (prefers-reduced-motion)
 */

const VulcaParticles = {
  // State
  particleSystem: null,
  enabled: true,

  /**
   * Initialize particles on DOM ready
   */
  init() {
    // Check if should disable particles
    if (!this.shouldEnable()) {
      console.log('VULCA Particles: Disabled (mobile or prefers-reduced-motion)');
      this.enabled = false;
      return;
    }

    // Wait for Sparticles library to load
    if (typeof Sparticles === 'undefined') {
      console.warn('VULCA Particles: Sparticles library not loaded');
      return;
    }

    // Find hero section
    const heroSection = document.querySelector('.hero');
    if (!heroSection) {
      console.warn('VULCA Particles: Hero section not found');
      return;
    }

    // Ensure hero has position context for particles
    if (!heroSection.style.position || heroSection.style.position === 'static') {
      heroSection.style.position = 'relative';
    }

    try {
      // Initialize Sparticles with VULCA configuration
      this.particleSystem = new Sparticles(heroSection, {
        // ====== DENSITY (Preserve Negative Space) ======
        count: 80,                  // Low count (80-150) preserves whitespace

        // ====== MOTION (Meditative, Poetic) ======
        speed: 2,                   // Slow drift (1-3 range)
        minSpeed: 1,                // Minimum speed for variation
        maxSpeed: 3,                // Maximum speed
        drift: 2,                   // Organic, floating motion
        bounce: false,              // No bouncing (unnatural)

        // ====== SHAPE & SIZE (Subtle, Organic) ======
        shape: 'circle',            // Organic circular form
        size: 3,                    // Barely visible size
        minSize: 2,                 // Minimum particle size
        maxSize: 5,                 // Maximum particle size

        // ====== TRANSPARENCY (Ephemeral, Ghostlike) ======
        minAlpha: 0.1,              // Barely visible at minimum
        maxAlpha: 0.3,              // Still subtle at maximum
        alphaSpeed: 8,              // Gentle fading in/out
        alphaVariation: 20,         // Variation in fade patterns

        // ====== AESTHETICS (VULCA Design Tokens) ======
        color: '#D4D2CE',           // Use existing palette: subtle gray accent
        glow: 0,                    // No glow effect (maintain minimalism)
        twinkle: true,              // Poetic pulsing (optional flickering)
        parallax: 0.5,              // Subtle depth effect

        // ====== PERFORMANCE ======
        style: 'smooth',            // Smooth animation style
        disableAutoAdd: false,      // Use default particle generation

        // ====== RESPONSIVE ======
        responsiveReduceCount: true, // Reduce particles on smaller screens

        // ====== COMPOSITION ======
        globalCompositeOperation: 'source-over' // Standard blending (best performance)
      });

      console.log('✨ VULCA Particles initialized successfully');
      console.log('  Count: 80 | Speed: 2 | Alpha: 0.1-0.3 | Color: #D4D2CE');

      // Track initialization in performance monitor if available
      if (typeof PerformanceMonitor !== 'undefined') {
        PerformanceMonitor.mark('particles-init');
      }

    } catch (error) {
      console.error('VULCA Particles: Initialization error', error);
      this.enabled = false;
    }
  },

  /**
   * Determine if particles should be enabled
   * Disabled on: mobile devices, prefers-reduced-motion, low memory
   */
  shouldEnable() {
    // Check mobile viewport
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      console.log('VULCA Particles: Mobile device detected, disabling');
      return false;
    }

    // Check user accessibility preference (CRITICAL for accessibility)
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      console.log('VULCA Particles: prefers-reduced-motion detected, disabling');
      return false;
    }

    return true;
  },

  /**
   * Destroy particle system (for cleanup or toggling)
   */
  destroy() {
    if (this.particleSystem && typeof this.particleSystem.destroy === 'function') {
      this.particleSystem.destroy();
      this.particleSystem = null;
      console.log('VULCA Particles: Destroyed');
    }
  },

  /**
   * Toggle particles on/off
   */
  toggle() {
    if (this.enabled) {
      this.destroy();
      this.enabled = false;
    } else {
      this.enabled = true;
      this.init();
    }
  }
};

/**
 * Initialize particles when DOM is ready
 * Must run AFTER Sparticles library loads but BEFORE app.js modifies DOM
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    VulcaParticles.init();
  });
} else {
  // DOM already loaded (script loaded after HTML parsing)
  VulcaParticles.init();
}

/**
 * Re-initialize particles on window resize if crossing mobile breakpoint
 */
window.addEventListener('resize', () => {
  const isMobile = window.innerWidth < 768;

  if (isMobile && VulcaParticles.enabled) {
    // Crossed into mobile: disable
    VulcaParticles.destroy();
    VulcaParticles.enabled = false;
    console.log('VULCA Particles: Disabled (mobile breakpoint)');
  } else if (!isMobile && !VulcaParticles.enabled && VulcaParticles.shouldEnable()) {
    // Crossed out of mobile: re-enable
    VulcaParticles.init();
  }
}, { passive: true });
