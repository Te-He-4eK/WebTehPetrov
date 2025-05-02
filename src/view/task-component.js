import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate(task) {
  return `<li class="task">${task.title}</li>`;
}

export default class TaskComponent extends AbstractComponent {
  constructor({ task, onTaskDrop }) {
    super();
    this.task = task;
    this.#onTaskDrop = onTaskDrop;

    this.#makeDraggable();
    this.#setDropHandler();
  }

  get template() {
    return createTaskComponentTemplate(this.task);
  }

  #onTaskDrop = null;

  #makeDraggable() {
    this.element.setAttribute('draggable', true);

    this.element.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', this.task.id);
    });
  }

  #setDropHandler() {
    this.element.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.element.style.borderTop = '2px solid #000';
    });

    this.element.addEventListener('dragleave', () => {
      this.element.style.borderTop = '';
    });

    this.element.addEventListener('drop', (event) => {
      event.preventDefault();
      this.element.style.borderTop = '';

      const draggedTaskId = event.dataTransfer.getData('text/plain');

      if (this.#onTaskDrop) {
        this.#onTaskDrop(draggedTaskId, this.task.status);
      }
    });
  }
}
