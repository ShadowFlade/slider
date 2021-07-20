interface eventmixin {
  _eventHandlers: {}
  on(eventname: string, handler: Function): void
  off(eventname: string, handler: Function): void
  trigger(eventaname: string, args: any, context?): void
}

class EventMixin implements eventmixin {
  _eventHandlers: {}

  on(eventName: string, handler: Function) {
    if (!this._eventHandlers) this._eventHandlers = {}
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = []
    }
    this._eventHandlers[eventName].push(handler)
  }

  off(eventName: string, handler: Function) {
    const handlers = this._eventHandlers && this._eventHandlers[eventName]
    if (!handlers) return
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1)
      }
    }
  }

  // unsubscribe(eventName, callback) {
  //   this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
  // }

  trigger(eventName: string, args?) {
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      return
    }

    this._eventHandlers[eventName].forEach((handler) => {
      const that = this
      const result = handler.call(this, args)

      return result // ??
    })
  }
}

export default EventMixin
