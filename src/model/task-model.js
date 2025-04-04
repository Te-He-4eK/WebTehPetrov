import { TaskStatus } from '../const.js';

export default class TaskModel {
  #tasks = [];
  #observers = [];

  constructor(tasks = []) {
    this.#tasks = tasks.map(task => ({
      ...task,
      status: task.status || TaskStatus.BACKLOG
    }));
    this.#observers = []; 
  }

  getTasks() {
    return [...this.#tasks];
  }

  getTaskById(taskId) {
    return this.#tasks.find(task => task.id === taskId);
  }

  getTasksByStatus(status) {
    return this.#tasks.filter(task => task.status === status);
  }

  changeTaskStatus(taskId, newStatus) {
    const task = this.getTaskById(taskId);
    if (!task) return false;

    task.status = newStatus;
    this.#notifyObservers();
    return true;
  }

  addObserver(observer) {
    if (typeof observer === 'function') {
      this.#observers.push(observer);
    }
  }

  removeObserver(observer) {
    this.#observers = this.#observers.filter(obs => obs !== observer);
  }

  #notifyObservers() {
    this.#observers.forEach(observer => observer());
  }
}