import { tasks } from './mock/task.js';
import TaskModel from './model/task-model.js';
import BoardContainerComponent from './view/board-container-component.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import { render } from './framework/render.js';

function initApp() {
  try {
    const taskModel = new TaskModel(tasks);
    console.log('Model initialized with tasks:', taskModel.tasks); // Используем геттер tasks вместо getTasks()

    const boardContainerComponent = new BoardContainerComponent();
    
    const appContainer = document.querySelector('#app');
    if (!appContainer) {
      throw new Error('App container not found');
    }
    render(boardContainerComponent, appContainer);

    const taskBoardElement = boardContainerComponent.element.querySelector('.task-board');
    
    if (!taskBoardElement) {
      throw new Error('Task board element not found');
    }

    const boardPresenter = new TasksBoardPresenter({
      container: taskBoardElement,
      taskModel
    });
    boardPresenter.init();

    console.log('Application initialized successfully');

  } catch (error) {
    console.error('Failed to initialize app:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = 'Произошла ошибка при загрузке приложения';
    document.body.prepend(errorElement);
  }
}

document.addEventListener('DOMContentLoaded', initApp);