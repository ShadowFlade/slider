// import * as $ from 'jquery'
import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
import Pres from './pres'

class App {
  constructor(item, options) {
    this._model = new Model(options, item)
    this._pres = new Pres(this._model, this._model.getItem())
    this._view = new View(this._pres, options, item, this._model)

    this._pres.getView(this._view)
    this._pres.init()

    this._pres.onMouseDown()

    return
  }

  _model: Model

  _view: View

  _pres: Pres

  destroy() {}
}

export default App
