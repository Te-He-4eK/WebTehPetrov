import { AbstractComponent } from '../framework/view/abstract-component.js';

function createDeleteButtonComponentTemplate() {
  return (
    `<button class="delate-btn" type="button">
        <span>✖ Очистить</span>
    </button>`
  );
}

export default class DeleteBtnComponent extends AbstractComponent {
  get template() {
    return createDeleteButtonComponentTemplate();
  }

  setClickHandler(callback) {
    this.element.addEventListener('click', callback);
  }

  setDisabled(isDisabled) {
    this.element.disabled = isDisabled;
  }
}