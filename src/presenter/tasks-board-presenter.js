import { TaskStatus } from '../const.js';
import { render, remove } from '../framework/render.js';
import TaskComponent from '../view/task-component.js';
import EmptyTaskComponent from '../view/empty-task-component.js';
import ClearButtonComponent from '../view/clear-button-component.js';

export default class TaskBoardPresenter {
  #container = null;
  #taskModel = null;
  #taskComponents = new Map();
  #clearButtonComponent = null;

  constructor({ container, taskModel }) {
    if (!container || !taskModel) {
      throw new Error('Invalid arguments for TaskBoardPresenter');
    }
    
    this.#container = container;
    this.#taskModel = taskModel;
    this.#taskModel.addObserver(this.#handleModelChange);
  }

  init() {
    if (!this.#container) {
      console.error('Container not set for TaskBoardPresenter');
      return;
    }
    this.#renderBoard();
  }

  #renderBoard() {
    Object.values(TaskStatus).forEach(status => {
      const columnElement = this.#getColumnElement(status);
      if (columnElement) {
        this.#renderColumn(status, columnElement);
      }
    });
  }

  #getColumnElement(status) {
    return this.#container.querySelector(`[data-status="${status}"]`);
  }

  #renderColumn(status, columnElement) {
    const tasks = this.#taskModel.getTasksByStatus(status);
    const taskListElement = columnElement.querySelector('.task-list');
    
    if (!taskListElement) {
      console.error(`Task list not found for status: ${status}`);
      return;
    }

    taskListElement.innerHTML = '';
    
    if (tasks.length === 0) {
      this.#renderEmptyState(taskListElement);
    } else {
      this.#renderTasks(tasks, taskListElement);
      if (status === TaskStatus.TRASH) {
        this.#renderClearButton(columnElement);
      }
    }
  }

  #renderTasks(tasks, container) {
    tasks.forEach(task => {
      const taskComponent = new TaskComponent(task, {
        onDelete: () => this.#handleDeleteTask(task.id)
      });
      render(taskComponent, container);
      this.#taskComponents.set(task.id, taskComponent);
    });
  }

  #renderEmptyState(container) {
    render(new EmptyTaskComponent(), container);
  }

  #renderClearButton(container) {
    this.#clearButtonComponent = new ClearButtonComponent({
      onClick: () => this.#handleClearTrash()
    });
    render(this.#clearButtonComponent, container);
  }

  #handleModelChange = () => {
    this.#renderBoard();
  };

  #handleDeleteTask(taskId) {
    this.#taskModel.changeTaskStatus(taskId, TaskStatus.TRASH);
  }

  #handleClearTrash() {
    const trashTasks = this.#taskModel.getTasksByStatus(TaskStatus.TRASH);
    if (trashTasks.length > 0 && confirm('Очистить корзину?')) {
      trashTasks.forEach(task => this.#taskModel.deleteTask(task.id));
    }
  }

  destroy() {
    this.#taskComponents.forEach(component => remove(component));
    this.#taskComponents.clear();
    
    if (this.#clearButtonComponent) {
      remove(this.#clearButtonComponent);
    }
    
    if (this.#taskModel) {
      this.#taskModel.removeObserver(this.#handleModelChange);
    }
  }
}