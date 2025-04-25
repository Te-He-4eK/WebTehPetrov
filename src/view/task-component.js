import { AbstractComponent } from '../framework/view/abstract-component.js';

export default class TaskComponent extends AbstractComponent {
  #task = null;
  #handlers = null;

  constructor(task, handlers = {}) {
    super();
    this.#task = task;
    this.#handlers = handlers;
  }

  get template() {
    return `
      <div class="task" data-task-id="${this.#task.id}" data-status="${this.#task.status}">
        <div class="task__header">
          <span class="task__title">${this.#task.title}</span>
        
          </button>
        </div>
      </div>
    `;
  }

  _setEventListeners() {
    this.element.querySelector('.task__delete-btn')
      .addEventListener('click', (evt) => {
        evt.preventDefault();
        this.#handlers.onDelete?.();
      });
  }
}