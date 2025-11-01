/**
 * Performance Monitoring System
 * Tracks and reports performance metrics for the exhibition platform
 *
 * Metrics tracked:
 * - Page Load Time
 * - Data Loading Duration
 * - Rendering Performance
 * - Interaction Response Times
 * - Memory Usage
 */

const PerformanceMonitor = {
  // Storage for performance metrics
  metrics: {
    pageStart: performance.now(),
    marks: {},
    measures: {},
    interactions: []
  },

  /**
   * Initialize performance monitoring
   */
  init() {
    // Mark page start
    performance.mark('page-start');
    this.metrics.pageStart = performance.now();

    // Monitor when DOMContentLoaded fires
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.mark('dom-content-loaded');
      });
    } else {
      this.mark('dom-content-loaded');
    }

    // Monitor when window.onload fires
    if (document.readyState === 'complete') {
      this.mark('page-fully-loaded');
    } else {
      window.addEventListener('load', () => {
        this.mark('page-fully-loaded');
      });
    }

    console.log('✓ Performance monitoring initialized');
  },

  /**
   * Mark a point in time
   * @param {string} label - Mark label
   */
  mark(label) {
    performance.mark(label);
    this.metrics.marks[label] = performance.now() - this.metrics.pageStart;
    console.log(`  ⏱ ${label}: ${this.metrics.marks[label].toFixed(1)}ms`);
  },

  /**
   * Measure duration between two marks
   * @param {string} label - Measure label
   * @param {string} startMark - Start mark name
   * @param {string} endMark - End mark name
   */
  measure(label, startMark, endMark) {
    try {
      performance.measure(label, startMark, endMark);
      const measure = performance.getEntriesByName(label)[0];
      this.metrics.measures[label] = measure.duration;
      console.log(`  📊 ${label}: ${measure.duration.toFixed(1)}ms`);
    } catch (e) {
      console.warn(`Measure "${label}" failed:`, e.message);
    }
  },

  /**
   * Track interaction performance
   * @param {string} action - Action name (e.g., 'select-artwork', 'get-critique')
   * @param {number} duration - Duration in milliseconds
   */
  trackInteraction(action, duration) {
    this.metrics.interactions.push({
      action,
      duration,
      timestamp: Date.now()
    });

    // Log significant interactions
    if (duration > 100) {
      console.warn(`⚠️  Slow interaction "${action}": ${duration.toFixed(1)}ms`);
    } else {
      console.log(`  ✓ Interaction "${action}": ${duration.toFixed(1)}ms`);
    }
  },

  /**
   * Get current performance summary
   * @returns {Object} Performance metrics summary
   */
  getSummary() {
    const now = performance.now() - this.metrics.pageStart;
    const marks = this.metrics.marks;

    return {
      pageStart: this.metrics.pageStart,
      currentTime: now.toFixed(1) + 'ms',
      domContentLoaded: marks['dom-content-loaded']?.toFixed(1) + 'ms' || 'N/A',
      pageFullyLoaded: marks['page-fully-loaded']?.toFixed(1) + 'ms' || 'N/A',
      dataLoadStart: marks['data-loading-start']?.toFixed(1) + 'ms' || 'N/A',
      dataLoadEnd: marks['data-loading-end']?.toFixed(1) + 'ms' || 'N/A',
      dataLoadDuration: this.metrics.measures['data-loading']?.toFixed(1) + 'ms' || 'N/A',
      dataIndexInit: marks['data-index-init']?.toFixed(1) + 'ms' || 'N/A',
      renderingStart: marks['rendering-start']?.toFixed(1) + 'ms' || 'N/A',
      renderingEnd: marks['rendering-end']?.toFixed(1) + 'ms' || 'N/A',
      renderingDuration: this.metrics.measures['rendering']?.toFixed(1) + 'ms' || 'N/A',
      interactionCount: this.metrics.interactions.length,
      averageInteractionTime: (this.metrics.interactions.length > 0
        ? (this.metrics.interactions.reduce((sum, i) => sum + i.duration, 0) / this.metrics.interactions.length).toFixed(1)
        : 'N/A') + 'ms'
    };
  },

  /**
   * Log performance summary to console
   */
  logSummary() {
    const summary = this.getSummary();
    console.log('\n📈 === PERFORMANCE SUMMARY ===');
    console.log(`DOM Content Loaded: ${summary.domContentLoaded}`);
    console.log(`Page Fully Loaded: ${summary.pageFullyLoaded}`);
    console.log(`Data Loading: ${summary.dataLoadDuration}`);
    console.log(`Data Index Init: ${summary.dataIndexInit}`);
    console.log(`Rendering: ${summary.renderingDuration}`);
    console.log(`Total Interactions: ${summary.interactionCount}`);
    console.log(`Average Interaction Time: ${summary.averageInteractionTime}`);
    console.log('================================\n');
  },

  /**
   * Get memory usage (if available)
   * @returns {Object|null} Memory usage info
   */
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      };
    }
    return null;
  },

  /**
   * Export metrics as JSON
   * @returns {string} JSON string of metrics
   */
  exportMetrics() {
    return JSON.stringify({
      marks: this.metrics.marks,
      measures: this.metrics.measures,
      interactions: this.metrics.interactions,
      memory: this.getMemoryUsage(),
      summary: this.getSummary()
    }, null, 2);
  }
};
