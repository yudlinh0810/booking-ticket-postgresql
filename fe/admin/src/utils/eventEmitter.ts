type Callback = () => void;

class EventEmitter {
  private events: { [key: string]: Callback[] } = {};

  on(event: string, callback: Callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => cb());
    }
  }

  off(event: string, callback: Callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

export const eventEmitter = new EventEmitter();
