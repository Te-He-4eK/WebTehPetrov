import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TaskBoardComponent from './view/task-board-component.js';
import TaskListComponent from './view/task-list-component.js';
import TaskComponent from './view/task-component.js';
import { render, RenderPosition } from './framework/render.js';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const taskBoardContainer = document.querySelector('.taskboard');

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new FormAddTaskComponent(), formContainer);
const boardComponent = new TaskBoardComponent();
render(boardComponent, taskBoardContainer);

const taskTitles = ["Бэклог", "В процессе", "Готово", "Корзина"];
const taskLists = [];

taskTitles.forEach((title) => {
    const taskList = new TaskListComponent();
    render(taskList, boardComponent.getElement());
    taskLists.push({ taskList, title });
});

taskLists.forEach(({ taskList, title }) => {
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;
    titleElement.style.marginBottom = "10px";
    titleElement.style.textAlign = "center";

    taskList.getElement().insertAdjacentElement("beforebegin", titleElement);

    for (let i = 0; i < 4; i++) {
        render(new TaskComponent(`Задача ${i + 1}`), taskList.getElement());
    }
});

const taskBoard = document.querySelector('.taskboard');
if (taskBoard) {
    taskBoard.style.cssText = 'display: flex; justify-content: space-between; gap: 20px; width: 100%;';
}

document.querySelectorAll('.task-list').forEach(taskList => {
    taskList.style.cssText = 'display: flex; flex-direction: column; gap: 10px; width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px;';
});
