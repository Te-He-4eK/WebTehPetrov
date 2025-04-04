import { createElement } from '../framework/render.js';

/**
 * @param {Object} task 
 * @param {number} task.id 
 * @param {string} task.title 
 * @param {string} task.status 
 * @return {string} 
 */
const createTaskTemplate = (task) => {
  return `
    <div class="task" data-task-id="${task.id}" data-status="${task.status}">
      <div class="task__header">
        <span class="task__title">${task.title}</span>
        <button class="task__delete-btn" aria-label="Удалить задачу" title="Удалить">
          <svg class="delete-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;
};

export default class TaskComponent {
  /**
   * @param {Object} task 
   * @param {Object} handlers 
   * @param {Function} handlers.onDelete 
   */
  constructor(task, handlers = {}) {
    this._task = task;
    this._handlers = handlers;
    this._element = null;
    this._deleteButton = null;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createTaskTemplate(this._task);
  }

  /**
   * @return {HTMLElement}
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._setEventListeners();
    }
    return this._element;
  }

  /**
   * @private
   */
  _setEventListeners() {
    this._deleteButton = this._element.querySelector('.task__delete-btn');
    
    if (this._deleteButton && this._handlers.onDelete) {
      this._deleteButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        this._handlers.onDelete();
      });
      
      this._deleteButton.addEventListener('mouseenter', () => {
        this._deleteButton.classList.add('hover');
      });
      
      this._deleteButton.addEventListener('mouseleave', () => {
        this._deleteButton.classList.remove('hover');
      });
    }
  }

  removeElement() {
    if (this._deleteButton) {
      this._deleteButton.removeEventListener('click', this._handlers.onDelete);
      this._deleteButton = null;
    }
    this._element = null;
  }
}