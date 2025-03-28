import { createElement } from '../framework/render.js';

function createTaskComponentTemplate(taskText) {
    return `<li class="task" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-radius: 5px; background: white; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); margin-bottom: 10px; width: 100%;">${taskText}</li>`;
}

export default class TaskComponent {
    constructor(taskText) {
        this.taskText = taskText;
    }

    getTemplate() {
        return createTaskComponentTemplate(this.taskText);
    }

    getElement() {
        if (!this.element) {
            this.element = createElement(this.getTemplate());
        }
        return this.element;
    }

    removeElement() {
        this.element = null;
    }
}

import HeaderComponent from './header-component.js';
import FormAddTaskComponent from './form-add-task-component.js';
import TaskBoardComponent from './task-board-component.js';
import TaskListComponent from './task-list-component.js';
import { render } from '../framework/render.js';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const taskBoardContainer = document.querySelector('.taskboard');

render(new HeaderComponent(), bodyContainer, 'beforebegin');
render(new FormAddTaskComponent(), formContainer);
const boardComponent = new TaskBoardComponent();
render(boardComponent, taskBoardContainer);

const taskLists = [];
for (let i = 0; i < 4; i++) {
    const taskList = new TaskListComponent();
    render(taskList, boardComponent.getElement());
    taskLists.push(taskList);
}

taskLists.forEach(taskList => {
    for (let i = 0; i < 4; i++) {
        render(new TaskComponent(`Задача ${i + 1}`), taskList.getElement());
    }
});

const taskBoard = document.querySelector('.taskboard');
if (taskBoard) {
    taskBoard.style.cssText = 'display: flex; justify-content: space-between; gap: 20px; width: 100%;';
}

document.querySelectorAll('.task-list').forEach(taskList => {
    taskList.style.cssText = 'display: flex; flex-direction: column; gap: 10px; width: 100%;';
});