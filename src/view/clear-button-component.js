import { createElement } from '../framework/render.js';

/**
 * @return {string} HTML-строка
 */
function createClearButtonTemplate() {
  return `
    <button class="clear-btn" aria-label="Очистить корзину">
      Очистить корзину
    </button>
  `;
}

/**
 * @class
 */
export default class ClearButtonComponent {
  constructor({ onClick }) {
    this._onClick = onClick;
    this._element = null;
    this._button = null;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createClearButtonTemplate();
  }

  /**
   * @return {HTMLElement}
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._button = this._element.querySelector('.clear-btn');
      this._setEventListeners();
    }
    return this._element;
  }

  /**
   * @private
   */
  _setEventListeners() {
    if (this._button && this._onClick) {
      this._button.addEventListener('click', (evt) => {
        evt.preventDefault();
        this._onClick();
      });
    }
  }

    removeElement() {
    if (this._button) {
      this._button.removeEventListener('click', this._onClick);
      this._button = null;
    }
    this._element = null;
  }
}