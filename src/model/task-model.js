import { TaskStatus } from '../const.js';

export default class TaskModel {
  #tasks = [];
  #observers = [];

  constructor(tasks = []) {
    this.#tasks = tasks.map(task => ({
      ...task,
      status: task.status || TaskStatus.BACKLOG
    }));
  }

  get tasks() {
    return [...this.#tasks];
  }

  getTaskById(taskId) {
    return this.#tasks.find(task => task.id === taskId);
  }

  getTasksByStatus(status) {
    return this.#tasks.filter(task => task.status === status);
  }

  addTask(title) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      status: TaskStatus.BACKLOG
    };
    this.#tasks.push(newTask);
    this.#notifyObservers();
    return newTask;
  }

  changeTaskStatus(taskId, newStatus) {
    const task = this.getTaskById(taskId);
    if (!task || !Object.values(TaskStatus).includes(newStatus)) return false;
    
    task.status = newStatus;
    this.#notifyObservers();
    return true;
  }

  deleteTask(taskId) {
    this.#tasks = this.#tasks.filter(task => task.id !== taskId);
    this.#notifyObservers();
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