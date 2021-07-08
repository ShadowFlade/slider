import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
class Controller extends EventMixin {
  _slider: HTMLElement
  _slider_range: HTMLElement
  _slider_handle: HTMLElement
  _model: Model
  _view: View
  constructor(item, options, model, view, elements) {
    super()
    this._model = model
    this._view = view
    // {slider:this._slider,handle:this._slider_handle,range:this._slider_range}=elements
    this._slider = elements[0]
    this._slider_handle = elements[1]
    this._slider_range = elements[2]
    // this._view.on('handleMovement', this.transfer_data)
  }
  transfer_data(data: object) {
    this._model.renew(data)
  }
  bindMouseMove(handle, slider) {
    handle.ondragstart = function () {
      return false
    }
    handle.addEventListener('mousedown', function (event) {
      // function mouseUp() {
      //   document.removeEventListener('mouseup', mouseUp)
      //   document.removeEventListener('mousemove', mouseMove)
      // }
    })
  }
}

export default Controller
