/**
 * HTML Template System
 * Centralizes HTML generation for better maintainability and reusability
 *
 * Benefits:
 * - Separates HTML structure from logic
 * - Single source of truth for component markup
 * - Easier to maintain consistent styling
 * - Reduced code duplication
 */

const Templates = {
  /**
   * Artwork selector card template
   * @param {Object} artwork - Artwork data
   * @returns {string} HTML string
   */
  artworkCard(artwork) {
    return `
      <div style="font-size: 32px; margin-bottom: var(--space-sm);">🖼️</div>
      <p style="font-size: var(--size-caption); font-weight: 600; color: var(--color-text-primary); margin: 0 0 var(--space-xs) 0;">
        ${artwork.title_zh}
      </p>
      <p style="font-size: 12px; color: var(--color-text-secondary); margin: 0;">
        ${artwork.year}
      </p>
    `;
  },

  /**
   * Persona selector card template
   * @param {Object} persona - Persona data
   * @returns {string} HTML string
   */
  personaSelectorCard(persona) {
    return `
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
  },

  /**
   * Persona detail card template (in personas section)
   * @param {Object} persona - Persona data
   * @returns {string} HTML string
   */
  personaDetailCard(persona) {
    return `
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
  },

  /**
   * Error alert template
   * @param {string} message - Error message
   * @returns {string} HTML string
   */
  errorAlert(message) {
    return `
      <div class="alert-title">错误</div>
      <div class="alert-message">${message}</div>
    `;
  },

  /**
   * Comparison critique card template
   * @param {Object} critique - Critique data
   * @param {Object} persona - Persona data
   * @returns {string} HTML string
   */
  comparisonCard(critique, persona) {
    return `
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
  },

  /**
   * Get template for component
   * @param {string} componentName - Name of component
   * @param {...any} args - Component data (variable arguments)
   * @returns {string} Rendered HTML
   */
  render(componentName, ...args) {
    const method = this[componentName];
    if (typeof method !== 'function') {
      console.warn(`Template "${componentName}" not found`);
      return '';
    }
    return method.call(this, ...args);
  }
};
