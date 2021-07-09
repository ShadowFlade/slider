import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
// import {ICoords} from './model'
class Pres extends EventMixin {
  _slider: HTMLElement
  _slider_range: HTMLElement
  _slider_handle: HTMLElement
  _model: Model
  _view: View
  pxOptions: Array<string> = ['height', 'width']
  constructor(options, model) {
    super()
    this._model = model

    // this._view.on('handleMovement', this.transfer_data)
  }
  convertOptions(options: object) {
    let newOptions = {}
    Object.assign(newOptions, this._model.getOptions(), options)
    for (let i in newOptions) {
      if (this.pxOptions.includes(i)) {
        newOptions[i] = `${newOptions[i]}px`
      } else {
        newOptions[i] = newOptions[i]
      }
    }
    return newOptions
  }

  init() {
    const options = this.convertOptions(this._model.getOptions())
    this._view.show(this._model.template, options)
  }

  getView(view) {
    this._view = view
    view.on('optionsRequired', this.getOptions.bind(this))
    view.on('built', this.sendItems.bind(this))
  }

  sendItems(): object {
    // console.log(this, ': this from pres')
    const items = this.fetchItems()
    this._view.items = items
    return items
  }
  fetchItems(): object {
    const item = this._model.getItem()
    this._slider = Array.from(
      item.getElementsByClassName(
        this._model._innerOptions.className
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._slider_range = Array.from(
      item.getElementsByClassName(
        `${this._model._innerOptions.className}-range`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._slider_handle = Array.from(
      item.getElementsByClassName(
        `${this._model._innerOptions.className}-handle`.trim()
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    return {
      slider: this._slider,
      range: this._slider_range,
      handle: this._slider_handle,
    }
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

  getOptions() {
    return this._model.getOptions()
  }
}

export default Pres
