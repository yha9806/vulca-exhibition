/**
 * Simple Unit Testing Framework
 * Provides basic assertion and test suite functionality
 *
 * Usage:
 * ```javascript
 * TestFramework.suite('DataIndexes', () => {
 *   TestFramework.test('should index artworks', () => {
 *     TestFramework.assert.isTrue(DataIndexes.artworksById.size > 0);
 *   });
 * });
 * ```
 */

const TestFramework = {
  // Test statistics
  stats: {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    currentSuite: null
  },

  // Assertion methods
  assert: {
    /**
     * Assert that a value is truthy
     */
    isTrue(value, message = '') {
      if (!value) {
        throw new Error(`Assertion failed: expected truthy, got ${value}. ${message}`);
      }
    },

    /**
     * Assert that a value is falsy
     */
    isFalse(value, message = '') {
      if (value) {
        throw new Error(`Assertion failed: expected falsy, got ${value}. ${message}`);
      }
    },

    /**
     * Assert strict equality
     */
    equals(actual, expected, message = '') {
      if (actual !== expected) {
        throw new Error(`Assertion failed: expected ${expected}, got ${actual}. ${message}`);
      }
    },

    /**
     * Assert loose equality
     */
    deepEquals(actual, expected, message = '') {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Assertion failed: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. ${message}`);
      }
    },

    /**
     * Assert value is null
     */
    isNull(value, message = '') {
      if (value !== null) {
        throw new Error(`Assertion failed: expected null, got ${value}. ${message}`);
      }
    },

    /**
     * Assert value is defined
     */
    isDefined(value, message = '') {
      if (value === undefined) {
        throw new Error(`Assertion failed: expected defined, got undefined. ${message}`);
      }
    },

    /**
     * Assert value is an instance of a class
     */
    isInstanceOf(value, constructor, message = '') {
      if (!(value instanceof constructor)) {
        throw new Error(`Assertion failed: expected instance of ${constructor.name}. ${message}`);
      }
    },

    /**
     * Assert array contains value
     */
    includes(array, value, message = '') {
      if (!array.includes(value)) {
        throw new Error(`Assertion failed: array does not include ${value}. ${message}`);
      }
    }
  },

  /**
   * Create a test suite
   * @param {string} name - Suite name
   * @param {Function} callback - Suite callback
   */
  suite(name, callback) {
    const previousSuite = this.stats.currentSuite;
    this.stats.currentSuite = name;

    console.log(`\n🧪 Test Suite: ${name}`);
    console.log('─'.repeat(50));

    try {
      callback();
    } catch (error) {
      console.error(`❌ Suite failed: ${error.message}`);
    }

    this.stats.currentSuite = previousSuite;
  },

  /**
   * Define a test
   * @param {string} description - Test description
   * @param {Function} testFn - Test function
   */
  test(description, testFn) {
    this.stats.totalTests++;
    const suitePrefix = this.stats.currentSuite ? `${this.stats.currentSuite} › ` : '';

    try {
      testFn();
      this.stats.passedTests++;
      console.log(`✓ ${description}`);
    } catch (error) {
      this.stats.failedTests++;
      console.error(`✗ ${description}`);
      console.error(`  → ${error.message}`);
    }
  },

  /**
   * Get test statistics
   * @returns {Object} Test statistics
   */
  getStats() {
    return {
      ...this.stats,
      passRate: (this.stats.totalTests > 0
        ? ((this.stats.passedTests / this.stats.totalTests) * 100).toFixed(1)
        : 'N/A') + '%'
    };
  },

  /**
   * Print test report
   */
  report() {
    const stats = this.getStats();
    console.log('\n\n📊 === TEST REPORT ===');
    console.log(`Total Tests: ${stats.totalTests}`);
    console.log(`Passed: ${stats.passedTests} ✓`);
    console.log(`Failed: ${stats.failedTests} ✗`);
    console.log(`Pass Rate: ${stats.passRate}`);
    console.log('====================\n');

    return stats;
  }
};

/**
 * Built-in test suites
 */

// Test DataIndexes functionality
TestFramework.suite('DataIndexes', () => {
  TestFramework.test('DataIndexes should be defined', () => {
    TestFramework.assert.isDefined(DataIndexes);
  });

  TestFramework.test('init() should populate indexes', () => {
    const prevSize = DataIndexes.artworksById.size;
    DataIndexes.init();
    TestFramework.assert.isTrue(DataIndexes.artworksById.size >= prevSize);
  });

  TestFramework.test('getArtwork() should return artwork by ID', () => {
    if (DataIndexes.artworksById.size > 0) {
      const id = DataIndexes.artworksById.keys().next().value;
      const artwork = DataIndexes.getArtwork(id);
      TestFramework.assert.isDefined(artwork);
      TestFramework.assert.equals(artwork.id, id);
    }
  });

  TestFramework.test('getCritique() should return critique by compound key', () => {
    if (DataIndexes.critiquesByKey.size > 0) {
      const key = DataIndexes.critiquesByKey.keys().next().value;
      const critique = DataIndexes.getCritique(...key.split(':'));
      TestFramework.assert.isDefined(critique);
    }
  });

  TestFramework.test('getStats() should return correct counts', () => {
    const stats = DataIndexes.getStats();
    TestFramework.assert.isTrue(stats.artworks > 0);
    TestFramework.assert.isTrue(stats.critiques > 0);
  });
});

// Test Templates functionality
TestFramework.suite('Templates', () => {
  TestFramework.test('Templates should be defined', () => {
    TestFramework.assert.isDefined(Templates);
  });

  TestFramework.test('render() should return HTML string', () => {
    const mockArtwork = {
      title_zh: '测试作品',
      year: 2024
    };
    const html = Templates.render('artworkCard', mockArtwork);
    TestFramework.assert.isTrue(typeof html === 'string');
    TestFramework.assert.isTrue(html.includes('测试作品'));
  });

  TestFramework.test('templates should contain expected methods', () => {
    TestFramework.assert.isDefined(Templates.artworkCard);
    TestFramework.assert.isDefined(Templates.personaSelectorCard);
    TestFramework.assert.isDefined(Templates.errorAlert);
    TestFramework.assert.isDefined(Templates.comparisonCard);
  });
});

// Test AppState functionality
TestFramework.suite('AppState', () => {
  TestFramework.test('AppState should be defined', () => {
    TestFramework.assert.isDefined(AppState);
  });

  TestFramework.test('setSelectedArtwork() should update state', () => {
    AppState.setSelectedArtwork('test-artwork');
    TestFramework.assert.equals(AppState.selectedArtwork, 'test-artwork');
  });

  TestFramework.test('setSelectedPersona() should update state', () => {
    AppState.setSelectedPersona('test-persona');
    TestFramework.assert.equals(AppState.selectedPersona, 'test-persona');
  });

  TestFramework.test('getCritique() should be callable', () => {
    const critique = AppState.getCritique('test-artwork', 'test-persona');
    // May be null/undefined, but shouldn't throw
    TestFramework.assert.isDefined(critique !== null);
  });
});

// Test EventDelegation initialization
TestFramework.suite('EventDelegation', () => {
  TestFramework.test('EventDelegation should be defined', () => {
    TestFramework.assert.isDefined(EventDelegation);
  });

  TestFramework.test('EventDelegation.init() should be callable', () => {
    try {
      EventDelegation.init();
      // If no error thrown, test passes
      TestFramework.assert.isTrue(true);
    } catch (e) {
      throw new Error(`init() failed: ${e.message}`);
    }
  });
});

// Test PerformanceMonitor
TestFramework.suite('PerformanceMonitor', () => {
  TestFramework.test('PerformanceMonitor should be defined', () => {
    TestFramework.assert.isDefined(PerformanceMonitor);
  });

  TestFramework.test('mark() should record metrics', () => {
    const beforeSize = Object.keys(PerformanceMonitor.metrics.marks).length;
    PerformanceMonitor.mark('test-mark');
    const afterSize = Object.keys(PerformanceMonitor.metrics.marks).length;
    TestFramework.assert.isTrue(afterSize > beforeSize);
  });

  TestFramework.test('getSummary() should return object', () => {
    const summary = PerformanceMonitor.getSummary();
    TestFramework.assert.isDefined(summary);
    TestFramework.assert.isDefined(summary.currentTime);
  });
});
