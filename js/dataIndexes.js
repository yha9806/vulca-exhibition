/**
 * Data Indexing System
 * Provides O(1) lookups for artworks, personas, and critiques
 * Built from ExhibitionData to avoid multiple linear scans
 *
 * Performance Impact:
 * - Before: 7 .find() calls on arrays, O(n) each
 * - After: Direct Map access, O(1) constant time
 */

const DataIndexes = {
  // Maps for fast lookups
  artworksById: new Map(),
  personasById: new Map(),
  critiquesByKey: new Map(), // key format: "artwork-id:persona-id"

  /**
   * Initialize all indexes from ExhibitionData
   * Call this after ExhibitionData and AppState are loaded
   */
  init() {
    if (typeof ExhibitionData === 'undefined') {
      console.error('DataIndexes: ExhibitionData not found');
      return false;
    }

    // Index artworks
    ExhibitionData.artworks.forEach(artwork => {
      this.artworksById.set(artwork.id, artwork);
    });
    console.log(`✓ Indexed ${this.artworksById.size} artworks`);

    // Index personas
    if (AppState.personas && AppState.personas.length > 0) {
      AppState.personas.forEach(persona => {
        this.personasById.set(persona.id, persona);
      });
      console.log(`✓ Indexed ${this.personasById.size} personas`);
    }

    // Index critiques by compound key
    ExhibitionData.critiques.forEach(critique => {
      const key = `${critique.artwork_id}:${critique.persona_id}`;
      this.critiquesByKey.set(key, critique);
    });
    console.log(`✓ Indexed ${this.critiquesByKey.size} critiques`);

    return true;
  },

  /**
   * Get artwork by ID - O(1) lookup
   * @param {string} id - Artwork ID
   * @returns {Object|undefined} Artwork object or undefined
   */
  getArtwork(id) {
    return this.artworksById.get(id);
  },

  /**
   * Get persona by ID - O(1) lookup
   * @param {string} id - Persona ID
   * @returns {Object|undefined} Persona object or undefined
   */
  getPersona(id) {
    return this.personasById.get(id);
  },

  /**
   * Get critique by artwork and persona IDs - O(1) lookup
   * @param {string} artworkId - Artwork ID
   * @param {string} personaId - Persona ID
   * @returns {Object|undefined} Critique object or undefined
   */
  getCritique(artworkId, personaId) {
    const key = `${artworkId}:${personaId}`;
    return this.critiquesByKey.get(key);
  },

  /**
   * Get all critiques for a specific artwork
   * @param {string} artworkId - Artwork ID
   * @returns {Array} Array of critique objects
   */
  getCritiquesByArtwork(artworkId) {
    const result = [];
    this.critiquesByKey.forEach((critique, key) => {
      if (key.startsWith(`${artworkId}:`)) {
        result.push(critique);
      }
    });
    return result;
  },

  /**
   * Get all critiques for a specific persona
   * @param {string} personaId - Persona ID
   * @returns {Array} Array of critique objects
   */
  getCritiquesByPersona(personaId) {
    const result = [];
    this.critiquesByKey.forEach((critique, key) => {
      if (key.endsWith(`:${personaId}`)) {
        result.push(critique);
      }
    });
    return result;
  },

  /**
   * Get statistics about indexed data
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      artworks: this.artworksById.size,
      personas: this.personasById.size,
      critiques: this.critiquesByKey.size,
      totalDataPoints: this.artworksById.size + this.personasById.size + this.critiquesByKey.size
    };
  }
};
