// import * as $ from 'jquery'
import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
import Pres from './pres'

class App {
  constructor(item, options) {
    this._model = new Model(options, item)
    this._pres = new Pres(options, this._model)
    this._view = new View(this._pres, options, item, this._model)

    this._pres.getView(this._view)
    this._pres.init()

    this._pres.onMouseDown()

    // return item
  }
  _model: Model
  _view: View
  _pres: Pres

  // init(item) {}

  destroy() {}
}

export default App

// , [
//   this._pres._slider,
//   this._pres._slider_handle,
//   this._pres._slider_range,
// ]
