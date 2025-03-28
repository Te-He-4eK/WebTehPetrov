import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TaskBoardComponent from './view/task-board-component.js';
import TaskListComponent from './view/task-list-component.js';
import TaskComponent from './view/task-component.js';
import { render } from './framework/render.js';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const taskBoardContainer = document.querySelector('.taskboard');

render(new HeaderComponent(), bodyContainer, 'beforebegin');
render(new FormAddTaskComponent(), formContainer);
const boardComponent = new TaskBoardComponent();
render(boardComponent, taskBoardContainer);

const taskList = new TaskListComponent();
render(taskList, boardComponent.getElement());

for (let i = 0; i < 4; i++) {
    render(new TaskComponent(`Задача ${i + 1}`), taskList.getElement());
}

;

const taskBoard = document.querySelector('.taskboard');
if (taskBoard) {
    taskBoard.style.cssText = 'display: flex; justify-content: space-between; gap: 20px; width: 100%;';
}

document.querySelectorAll('.task-list').forEach(taskList => {
    taskList.style.cssText = 'display: flex; flex-direction: column; gap: 10px; width: 100%;';
});