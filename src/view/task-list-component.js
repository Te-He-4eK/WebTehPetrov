import { createElement } from '../framework/render.js';

function createTaskListTemplate() {
    return (`<ul class="task-list"></ul>`);
}

export default class TaskListComponent {
    getTemplate() {
        return createTaskListTemplate();
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