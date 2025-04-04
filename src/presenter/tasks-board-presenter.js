import { TaskStatus } from '../const.js';
import TaskComponent from '../view/task-component.js';
import { render, remove } from '../framework/render.js';
import ClearButtonComponent from '../view/clear-button-component.js';

export default class TasksBoardPresenter {
  #container = null;
  #taskModel = null;
  #taskComponents = new Map();
  #clearButtonComponent = null;

  constructor({ container, taskModel }) {
    this.#container = container;
    this.#taskModel = taskModel;
    
    if (this.#taskModel && typeof this.#taskModel.addObserver === 'function') {
      this.#taskModel.addObserver(this.#handleModelChange);
    } else {
      console.error('TaskModel is not properly initialized');
    }
  }

  init() {
    if (!this.#container) {
      console.error('Container is not defined');
      return;
    }
    this.#renderBoard();
    this.#renderClearButton();
  }

  #renderBoard() {
    Object.values(TaskStatus).forEach(status => {
      const columnElement = this.#container.querySelector(`[data-status="${status}"]`);
      if (columnElement) {
        this.#renderColumn(status, columnElement);
      }
    });
  }

  #renderColumn(status, columnElement) {
    const tasks = this.#taskModel.getTasksByStatus(status);
    const taskListElement = columnElement.querySelector('.task-list');
    
    if (!taskListElement) {
      console.error(`Task list not found for status: ${status}`);
      return;
    }

    taskListElement.innerHTML = '';
    tasks.forEach(task => this.#renderTask(task, taskListElement));
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent(task, {
      onDelete: () => this.#handleDeleteTask(task.id)
    });

    render(taskComponent, container);
    this.#taskComponents.set(task.id, taskComponent);
  }

  #renderClearButton() {
    const trashColumn = this.#container.querySelector(`[data-status="${TaskStatus.TRASH}"]`);
    if (trashColumn) {
      this.#clearButtonComponent = new ClearButtonComponent({
        onClick: () => this.#handleClearTrash()
      });
      render(this.#clearButtonComponent, trashColumn);
    }
  }

  #handleModelChange = () => {
    this.#renderBoard();
  };

  #handleDeleteTask(taskId) {
    this.#taskModel.changeTaskStatus(taskId, TaskStatus.TRASH);
  }

  #handleClearTrash() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
      this.#taskModel.getTasksByStatus(TaskStatus.TRASH).forEach(task => {
        this.#taskModel.deleteTask(task.id);
      });
    }
  }

  destroy() {
    this.#taskComponents.forEach(component => remove(component));
    this.#taskComponents.clear();
    remove(this.#clearButtonComponent);
    
    if (this.#taskModel && typeof this.#taskModel.removeObserver === 'function') {
      this.#taskModel.removeObserver(this.#handleModelChange);
    }
  }
}