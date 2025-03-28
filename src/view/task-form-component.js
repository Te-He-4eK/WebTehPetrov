import { createElement } from '../framework/render.js';

function createTaskFormTemplate() {
    return (`
        <form class="task-input">
            <label class="title" for="taskInput">Новая задача</label>
            <fieldset class="input-container">
                <input type="text" id="taskInput" placeholder="Название задачи...">
                <button type="submit">+ Добавить</button>
            </fieldset>
        </form>
    `);
}

export default class TaskFormComponent {
    getTemplate() {
        return createTaskFormTemplate();
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