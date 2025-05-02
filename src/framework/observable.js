export default class Observable {
    #observers = new Set();
  
    addObserver(observer) {
      this.#observers.add(observer);
    }
  
    removeObserver(observer) {
      this.#observers.delete(observer);
    }
  
    _notify(event, payload) {
      for (const observer of this.#observers) {
        observer(event, payload);
      }
    }
  }
  