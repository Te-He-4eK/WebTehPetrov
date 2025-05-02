import { AbstractComponent } from '../framework/view/abstract-component.js';

const createListEmptyComponent = (status, label) => {
    return `
      <div class="task-section task-section--empty ${status}">
        <h3>${label}</h3>
        <p class="empty-text">Пустой Список</p>
      </div>
    `;
};

export default class ListEmptyComponent extends AbstractComponent {
  constructor({ status, label }) {
    super();
    this.status = status;
    this.label = label;
  }

  get template() {
    return createListEmptyComponent(this.status, this.label);
  }
}
