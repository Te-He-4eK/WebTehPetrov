import { createElement } from '../render.js';

export class AbstractComponent {
  #element = null;

  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error('Нельзя создавать экземпляры AbstractComponent напрямую');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error('Абстрактный метод не реализован: get template');
  }

  removeElement() {
    this.#element = null;
  }
}
