import { createElement } from './render.js';

function createTaskBoardTemplate() {
    return (`
        <section class="task-board"></section>
    `);
}

export default class TaskBoardComponent {
    getTemplate() {
        return createTaskBoardTemplate();
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