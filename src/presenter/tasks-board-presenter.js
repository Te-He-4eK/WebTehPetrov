import TaskBoardComponent from "../view/task-board-component.js";
import TaskListComponent from "../view/task-list-component.js";
import TaskComponent from "../view/task-component.js";
import AddTaskFormComponent from "../view/form-add-task-component.js";
import DeleteButtonComponent from "../view/clear-button-component.js";
import { Status, StatusLabel, UserAction, UpdateType } from "../const.js";
import { render, remove, RenderPosition } from "../framework/render.js";
import LoadingViewComponent from "../view/loading-view-component.js";

export default class TaskBoardPresenter {
  #boardContainer = null;
  #taskModel = null;
  #taskBoardComponent = null;
  #addTaskFormComponent = null;
  #taskListComponents = new Map();
  #loadingComponent = new LoadingViewComponent();
  #isInitialized = false;

  constructor({ boardContainer, taskModel }) {
    this.#boardContainer = boardContainer;
    this.#taskModel = taskModel;
    this.#taskModel.addObserver(this.#handleModelEvent);
    this.#taskBoardComponent = new TaskBoardComponent();
  }

  async init() {
    if (this.#isInitialized) return;
    
    try {
      render(this.#loadingComponent, this.#boardContainer);
      await this.#taskModel.init();
      remove(this.#loadingComponent);
      this.#renderBoard();
      this.#renderAddTaskForm();
      this.#isInitialized = true;
    } catch (error) {
      remove(this.#loadingComponent);
      console.error('Initialization failed:', error);
    }
  }

  #renderBoard() {
    if (this.#boardContainer.contains(this.#taskBoardComponent.element)) {
      this.#boardContainer.innerHTML = '';
    }
    render(this.#taskBoardComponent, this.#boardContainer);
    this.#renderAllTaskLists();
  }

  #renderAddTaskForm() {
    if (this.#addTaskFormComponent) {
      remove(this.#addTaskFormComponent);
    }

    this.#addTaskFormComponent = new AddTaskFormComponent();
    this.#addTaskFormComponent.setSubmitHandler((title) => {
      this.#taskModel.addTask(title)
        .catch(err => console.error('Failed to add task:', err));
    });
    render(this.#addTaskFormComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderAllTaskLists() {
    this.#taskListComponents.forEach(component => remove(component));
    this.#taskListComponents.clear();

    Object.values(Status).forEach(status => {
      this.#renderTaskList(status);
    });
  }

  #renderTaskList(status) {
    const tasks = this.#taskModel.getTasksByStatus(status);
    const taskListComponent = new TaskListComponent({
      status,
      label: StatusLabel[status],
      onTaskDrop: this.#handleTaskDrop
    });

    this.#taskListComponents.set(status, taskListComponent);
    render(taskListComponent, this.#taskBoardComponent.element);

    if (tasks.length > 0) {
      tasks.forEach(task => this.#renderTask(task, taskListComponent));
      
      if (status === Status.BASKET) {
        this.#renderDeleteButton(taskListComponent);
      }
    } else if (status === Status.BASKET) {
      this.#renderEmptyBasket(taskListComponent);
    }
  }

  #renderTask(task, listComponent) {
    const taskComponent = new TaskComponent({
      task,
      onTaskDrop: this.#handleTaskDrop
    });
    render(taskComponent, listComponent.element.querySelector('.task-list'));
  }

  #renderDeleteButton(container) {
    const deleteButton = new DeleteButtonComponent();
    deleteButton.setClickHandler(() => {
      if (confirm('Вы уверены, что хотите очистить корзину?')) {
        this.#handleClearBasketClick();
      }
    });
    render(deleteButton, container.element);
  }

  #renderEmptyBasket(container) {
    const emptyElement = document.createElement('p');
    emptyElement.textContent = 'Корзина пуста';
    emptyElement.className = 'empty-basket';
    container.element.querySelector('.task-list').append(emptyElement);
  }

  #handleTaskDrop = async (taskId, newStatus) => {
    try {
      await this.#taskModel.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  #handleClearBasketClick = async () => {
    try {
      await this.#taskModel.clearBasketTasks();
    } catch (err) {
      console.error('Failed to clear basket:', err);
    }
  };

  #handleModelEvent = (event) => {
    if (this.#loadingComponent?.element) {
      remove(this.#loadingComponent);
    }
    
    switch (event) {
      case UpdateType.INIT:
        if (!this.#isInitialized) {
          this.#renderBoard();
          this.#renderAddTaskForm();
          this.#isInitialized = true;
        }
        break;
        
      case UpdateType.MAJOR:
        this.#renderAllTaskLists();
        break;
        
      case UpdateType.MINOR:
        this.#updateTaskLists();
        break;
        
      default:
        this.#renderAllTaskLists();
    }
  };

  #updateTaskLists() {
    this.#taskListComponents.forEach((listComponent, status) => {
      const listElement = listComponent.element.querySelector('.task-list');
      listElement.innerHTML = '';
      
      const tasks = this.#taskModel.getTasksByStatus(status);
      tasks.forEach(task => this.#renderTask(task, listComponent));
      
      if (status === Status.BASKET) {
        if (tasks.length > 0) {
          if (!listComponent.element.querySelector('.delete-btn')) {
            this.#renderDeleteButton(listComponent);
          }
        } else {
          this.#renderEmptyBasket(listComponent);
        }
      }
    });
  }
}