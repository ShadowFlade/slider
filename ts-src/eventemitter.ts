interface eventmixin {
  _eventHandlers: Record<string, unknown>;
  on(eventname: string, handler: () => void): void;
  off(eventname: string, handler: () => void): void;
  trigger(eventaname: string, ...args: []): void;
}

class EventMixin implements eventmixin {
  _eventHandlers: Record<string, Array<() => void>>;

  on(eventName: string, handler: () => void): void {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  }

  off(eventName: string, handler: () => void): void {
    const handlers = this._eventHandlers && this._eventHandlers[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i += 1) {
      if (handlers[i] === handler) {
        handlers.splice((i -= 1), 1);
      }
    }
  }

  // unsubscribe(eventName, callback) {
  //   this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
  // }

  trigger(eventName: string, ...args): void {
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      return;
    }
    this._eventHandlers[eventName].forEach((handler) => {
      const result = handler.call(this, ...args);

      return result;
    });
  }
}

export default EventMixin;
