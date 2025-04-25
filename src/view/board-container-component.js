import { AbstractComponent } from '../framework/view/abstract-component.js';
import HeaderComponent from './header-component.js';
import TaskFormComponent from './task-form-component.js';

/**
 * @extends AbstractComponent
 */
export default class BoardContainerComponent extends AbstractComponent {
  constructor() {
    super();
    this._headerComponent = new HeaderComponent();
    this._taskFormComponent = new TaskFormComponent();
  }

  /**
   * @return {string}
   */
  get template() {
    return `
      <div class="board-container">
        <!-- Шапка приложения -->
        <header class="header"></header>
        
        <!-- Форма добавления новой задачи -->
        <section class="task-form"></section>
        
        <!-- Контейнер для доски задач -->
        <section class="task-board"></section>
      </div>
    `;
  }

  initialize() {
    render(this._headerComponent, this.element.querySelector('.header'));
    render(this._taskFormComponent, this.element.querySelector('.task-form'));
  }
}