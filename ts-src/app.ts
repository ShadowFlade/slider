// import * as $ from 'jquery'
import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
import Controller from './controller'

class App {
  constructor(item, options) {
    this._model = new Model(options, item)
    this._view = new View(this._controller, options, item, this._model)
    this._controller = new Controller(item, options, this._model)
    // return item
  }
  _model: Model
  _view: object
  _controller: object

  // init(item) {}

  destroy() {}
}

export default App
