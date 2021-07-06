interface eventmixin {
  _eventHandlers: {}
  on(eventname: string, handler: Function): void
  off(eventname: string, handler: Function): void
  trigger(eventaname: string, args: any): void
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
    let handlers = this._eventHandlers && this._eventHandlers[eventName]
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

  /**
   * Сгенерировать событие с указанным именем и данными
   * this.trigger('select', data1, data2);
   */
  trigger(eventName: string, ...args: []) {
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      // console.log('no')
      return // обработчиков для этого события нет
    }

    // вызовем обработчики
    this._eventHandlers[eventName].forEach((handler) => {
      handler.apply(this, args) //??
      // console.log(`this is this: ${this.name} and this is args: ${args}`)
    })
  }
}

export default EventMixin
