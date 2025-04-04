import { tasks } from './mock/task.js';
import TaskModel from './model/task-model.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';

console.log('Initial tasks:', tasks);

try {
  const taskModel = new TaskModel(tasks);
  
  console.log('Model tasks:', taskModel.getTasks());
  
  const boardContainer = document.querySelector('.task-board');
  
  if (!boardContainer) {
    throw new Error('Board container not found in DOM');
  }

  const boardPresenter = new TasksBoardPresenter({
    container: boardContainer,
    taskModel
  });
  
  boardPresenter.init();
} catch (error) {
  console.error('Initialization error:', error);
}