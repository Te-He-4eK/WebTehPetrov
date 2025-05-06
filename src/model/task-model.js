import Observable from '../framework/observable.js';
import { generateID } from '../utils.js';
import { UpdateType, UserAction, Status } from '../const.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #tasks = [];
  #isInitialized = false;

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#tasks;
  }

  get isInitialized() {
    return this.#isInitialized;
  }

  getTasksByStatus(status) {
    return this.#tasks.filter(task => task.status === status);
  }

  async init() {
    if (this.#isInitialized) return;
    
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#tasks = tasks.map(this.#adaptToClient);
      this.#isInitialized = true;
      this._notify(UpdateType.INIT);
    } catch (err) {
      this.#tasks = [];
      throw new Error('Failed to load tasks');
    }
  }

  async addTask(title) {
    const newTask = {
      title: title.trim(),
      status: Status.BACKLOG,
      id: generateID(),
      created: new Date()
    };

    if (!newTask.title) return;

    try {
      const response = await this.#tasksApiService.addTask(newTask);
      const adaptedTask = this.#adaptToClient(response);
      this.#tasks.push(adaptedTask);
      this._notify(UserAction.ADD_TASK, adaptedTask);
      return adaptedTask;
    } catch (err) {
      throw new Error('Failed to add task');
    }
  }

  async updateTaskStatus(taskId, newStatus) {
    const taskIndex = this.#tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = this.#tasks[taskIndex];
    if (task.status === newStatus) return;

    const oldStatus = task.status;
    task.status = newStatus;

    try {
      const response = await this.#tasksApiService.updateTask(task);
      const adaptedTask = this.#adaptToClient(response);
      this.#tasks[taskIndex] = adaptedTask;
      this._notify(UserAction.UPDATE_TASK, adaptedTask);
    } catch (err) {
      task.status = oldStatus;
      throw new Error('Failed to update task');
    }
  }

  async clearBasketTasks() {
    const basketTaskIds = this.#tasks
      .filter(task => task.status === Status.BASKET)
      .map(task => task.id);

    if (basketTaskIds.length === 0) return;

    try {
      await Promise.all(basketTaskIds.map(id => 
        this.#tasksApiService.deleteTask(id)
      ));
      
      this.#tasks = this.#tasks.filter(task => 
        !basketTaskIds.includes(task.id)
      );
      
      this._notify(UpdateType.MAJOR);
    } catch (err) {
      throw new Error('Failed to clear basket');
    }
  }

  #adaptToClient(task) {
    return {
      id: task.id,
      title: task.title,
      status: task.status || Status.BACKLOG,
      created: task.created || new Date()
    };
  }
}