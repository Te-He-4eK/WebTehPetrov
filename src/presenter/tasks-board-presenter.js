import TaskBoardComponent from "../view/task-board-component.js";
import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import DeleteButtonComponent from "../view/clear-button-component.js";
import { Status, StatusLabel, UserAction, UpdateType } from "../const.js";
import { render } from "../framework/render.js";
import LoadingViewComponent from "../view/loading-view-component.js";

export default class TaskBoardPresenter {
  #boardContainer = null;
  #taskModel = null;
  #taskBoardComponent = null;
  #taskLists = {};
  #clearButtonComponent = null;
  #loadingComponent = new LoadingViewComponent();

  constructor({ boardContainer, taskModel }) {
    if (!boardContainer) {
      throw new Error('Board container element is required');
    }

    if (!taskModel || typeof taskModel.addObserver !== 'function') {
      throw new Error('Valid taskModel with addObserver method is required');
    }

    this.#boardContainer = boardContainer;
    this.#taskModel = taskModel;
    this.#taskModel.addObserver(this.#handleModelEvent);
    this.#taskBoardComponent = new TaskBoardComponent();
  }

  async init() {
    try {
      render(this.#loadingComponent, this.#boardContainer);

      await this.#taskModel.init();

      if (this.#loadingComponent && this.#loadingComponent.element) {
        this.#loadingComponent.element.remove();
        this.#loadingComponent = null;
      }

      render(this.#taskBoardComponent, this.#boardContainer);
      this.#renderTasksList();
    } catch (error) {
      console.error('Task board initialization failed:', error);

      if (this.#loadingComponent && this.#loadingComponent.element) {
        this.#loadingComponent.element.remove();
        this.#loadingComponent = null;
      }
    }
  }

  async createTask(title) {
    if (!title.trim()) return;

    try {
      await this.#taskModel.addTask(title.trim());
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  }

  #renderTasksList() {
    this.#taskBoardComponent.element.innerHTML = ''; 
    this.#taskLists = {}; 

    Object.values(Status).forEach((status) => {
      const tasks = this.#taskModel.tasks.filter(task => task.status === status);

      const taskList = new TaskListComponent({
        status,
        label: StatusLabel[status],
        onTaskDrop: this.#handleTaskDrop
      });

      this.#taskLists[status] = taskList;
      render(taskList, this.#taskBoardComponent.element);

      tasks.forEach(task => this.#renderTask(task, taskList));

      if (status === Status.BASKET) {
        this.#renderClearButton(taskList);
      }
    });
  }

  #renderTask(task, listComponent) {
    const taskComponent = new TaskComponent({
      task,
      onTaskDrop: this.#handleTaskDrop
    });

    render(taskComponent, listComponent.element.querySelector('.task-list'));
  }

  #renderClearButton(listComponent) {
    if (!this.#clearButtonComponent) {
      this.#clearButtonComponent = new DeleteButtonComponent();
      this.#clearButtonComponent.element.addEventListener('click', this.#handleClearBasketClick);
      render(this.#clearButtonComponent, listComponent.element, 'afterend');
    }
    this.#updateClearButtonState();
  }

  #clearBoard() {
    Object.values(this.#taskLists).forEach(component => component.removeElement());
    this.#taskLists = {};
    this.#clearButtonComponent?.removeElement();
    this.#clearButtonComponent = null;
  }

  #handleTaskDrop = async (taskId, newStatus, beforeTaskId = null) => {
    try {
      await this.#taskModel.updateTaskStatus(taskId, newStatus, beforeTaskId);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  #handleClearBasketClick = async () => {
    try {
      await this.#taskModel.clearBasketTasks();
    } catch (err) {
      console.error('Failed to clear basket:', err);
    }
  };

  #handleModelEvent = (event, payload) => {
    switch (event) {
      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
      case UpdateType.INIT:
        if (this.#loadingComponent && this.#loadingComponent.element) {
          this.#loadingComponent.element.remove();
          this.#loadingComponent = null;
        }

        this.#clearBoard();
        this.#renderTasksList();
        break;

      default:
        console.warn(`Unhandled model event: ${event}`);
    }
  };

  #updateClearButtonState() {
    if (this.#clearButtonComponent) {
      const hasBasketTasks = this.#taskModel.tasks.some(task => task.status === Status.BASKET);
      this.#clearButtonComponent.element.disabled = !hasBasketTasks;
    }
  }
}
