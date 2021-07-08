import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
// import {ICoords} from './model'
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
  onMouseDown() {
    this._slider_handle.addEventListener('mousedown', (event) => {
      event.preventDefault()
      if (event.target == this._slider_handle) {
        // console.log('event target is handle')
        this._model.on('handleMoved', this.transferData.bind(this))
        let handle = this._slider_handle
        let slider = this._slider
        let target = event.target as HTMLDivElement
        let shiftX = event.x - this._slider_handle.getBoundingClientRect().left

        let mouseMove = (e) => {
          this.transferData({ y: e.clientY, x: e.clientX })
        }
        let onMouseUp = (e) => {
          document.removeEventListener('mousemove', mouseMove)
          document.removeEventListener('mouseUp', onMouseUp)
        }
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }
    })
  }

  transferData(data) {
    if (data.caller == 'model') {
      this._view.refresh(data)
      return
    }
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
