import { AbstractComponent } from '../framework/view/abstract-component.js';

export default class EmptyTaskComponent extends AbstractComponent {
  get template() {
    return `
      <div class="task-list__empty">
        <p>Задач пока нет</p>
      </div>
    `;
  }
}