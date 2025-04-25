import { createElement } from '../framework/render.js';
import { TaskStatus } from '../const.js';

/**
 * Компонент доски задач (содержит все колонки)
 */
export default class TaskBoardComponent {
  constructor() {
    this.element = null;
  }

  /**
   * Возвращает локализованное название статуса
   * @param {string} status 
   * @return {string}
   */
  getStatusTitle(status) {
    const statusTitles = {
      [TaskStatus.BACKLOG]: 'Бэклог',
      [TaskStatus.IN_PROGRESS]: 'В процессе',
      [TaskStatus.DONE]: 'Готово',
      [TaskStatus.TRASH]: 'Корзина'
    };
    return statusTitles[status] || status;
  }

  /**
   * @param {string} status 
   * @return {string}
   */
  createColumnTemplate(status) {
    return `
      <div class="column ${status}" data-status="${status}">
        <div class="column-title">${this.getStatusTitle(status)}</div>
        <div class="task-list" id="${status}-tasks"></div>
      </div>
    `;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `
      <div class="task-board">
        ${Object.values(TaskStatus).map(status => 
          this.createColumnTemplate(status)
        ).join('')}
      </div>
    `;
  }

  /**
   * @return {HTMLElement}
   */
  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  /**
   * @param {string} status 
   * @return {HTMLElement|null}
   */
  getColumnElement(status) {
    if (!this.element) return null;
    return this.element.querySelector(`[data-status="${status}"]`);
  }

  /**
   * @param {string} status 
   * @return {HTMLElement|null}
   */
  getTaskListElement(status) {
    const column = this.getColumnElement(status);
    return column ? column.querySelector('.task-list') : null;
  }

  removeElement() {
    if (this.element) {
      this.element = null;
    }
  }
}