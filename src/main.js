import HeaderComponent from './view/header-component.js';
import AddTaskFormComponent from './view/form-add-task-component.js';
import TaskBoardPresenter from './presenter/tasks-board-presenter.js';
import { render, RenderPosition } from './framework/render.js';
import TasksModel from './model/task-model.js';
import TasksApiService from './tasks-api-service.js';

const bodyContainer = document.querySelector('.board-app');
const END_POINT = 'https://6815013e225ff1af162ace92.mockapi.io/';

const taskModel = new TasksModel({
  tasksApiService: new TasksApiService(END_POINT),
});

const tasksBoardPresenter = new TaskBoardPresenter({
  boardContainer: bodyContainer,
  taskModel, 
});

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new AddTaskFormComponent(), bodyContainer, RenderPosition.BEFOREEND);

tasksBoardPresenter.init();

const addTaskFormElement = document.querySelector('.add-task__form');
const inputElement = addTaskFormElement.querySelector('#add-task');

addTaskFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const taskTitle = inputElement.value.trim();
  if (taskTitle === '') return;

  tasksBoardPresenter.createTask(taskTitle);
  inputElement.value = '';
});
