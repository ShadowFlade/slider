import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
// import {ICoords} from './model'
class Pres extends EventMixin {
  _slider: HTMLElement

  _sliderRange: HTMLElement

  _sliderHandle: HTMLElement

  _model: Model

  _view: View

  pxOptions: Array<string> = ['height', 'width']

  constructor(model) {
    super()
    this._model = model
  }

  convertOptions(options: object) {
    const newOptions = {}
    Object.assign(newOptions, this._model.getOptions(), options)
    for (const i in newOptions) {
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
    const behavior = this._model._innerOptions
    this._view.show(this._model.template, options)
    if (behavior.type !== 'single') {
      const clone: Node = this._sliderHandle.cloneNode(true)
      this._sliderHandle.after(clone)
    }
  }

  getView(view): void {
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
    this._sliderRange = Array.from(
      item.getElementsByClassName(
        `${this._model._innerOptions.className}-range`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderHandle = Array.from(
      item.getElementsByClassName(
        `${this._model._innerOptions.className}-handle`.trim()
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    return {
      slider: this._slider,
      range: this._sliderRange,
      handle: this._sliderHandle,
    }
  }

  onMouseDown(): void {
    this._sliderHandle.addEventListener('mousedown', (event) => {
      event.preventDefault()
      if (event.target == this._sliderHandle) {
        // console.log('event target is handle')
        this._model.on('handleMoved', this.transferData.bind(this))
        const handle = this._sliderHandle
        const slider = this._slider
        const target = event.target as HTMLDivElement
        const shiftX = event.x - this._sliderHandle.getBoundingClientRect().left

        const mouseMove = (e) => {
          this.transferData({ y: e.clientY, x: e.clientX })
        }
        const onMouseUp = (e) => {
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
