import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
// import {ICoords} from './model'
class Pres extends EventMixin {
  _item: HTMLElement
  _slider: HTMLElement

  _sliderRange: HTMLElement

  _sliderHandle: HTMLElement

  _model: Model

  _view: View

  pxOptions: Array<string> = ['height', 'width']

  constructor(model, item) {
    super()
    this._model = model
    this._item = item
  }

  getView(view): void {
    this._view = view
    view.on('optionsRequired', this.getOptions.bind(this))
  }

  makeSlider(behavior) {
    const container = document.createElement('div')
    container.classList.add('slider-container')
    // const sliderWrap=document.createElement('div')
    // sliderWrap.classList.add('slider-wrap')
    const slider = document.createElement('div')
    slider.classList.add('slider')
    const range = document.createElement('div')
    range.classList.add('slider-range')
    const handle = document.createElement('div')
    handle.classList.add('slider-handle')
    const tool = document.createElement('div')
    tool.classList.add('tooltip')
    handle.append(tool)
    const min = document.createElement('span')
    min.style.transform = 'translateX(-100%)'
    min.classList.add('slider-min')
    const max = document.createElement('span')
    max.classList.add('slider-max')
    container.append(min)
    container.append(slider)
    container.append(max)
    slider.appendChild(range)
    slider.appendChild(handle)
    if (behavior.type !== 'single') {
      const clone: Node = handle.cloneNode(true)
      handle.after(clone)
      slider.appendChild(range)
    }
    min.textContent = behavior.min
    max.textContent = behavior.max

    return container
  }
  init() {
    const options = this.convertOptions(this._model.getOptions())
    const behavior = this._model.getSettings()
    const sliderObject = this._view.show(this.makeSlider(behavior), options)
    const { slider, range, handle } = sliderObject
    this._slider = slider
    this._sliderRange = range
    this._sliderHandle = handle
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

  onMouseDown(): void {
    this._sliderHandle.ondragstart = function () {
      return false
    }

    this._sliderHandle.addEventListener('mousedown', (event) => {
      event.preventDefault()
      if (event.target == this._sliderHandle) {
        this._model.on('handleMoved', this.transferData.bind(this))
        const handle = this._sliderHandle
        const slider = this._slider
        const target = event.target as HTMLDivElement
        const shiftX =
          event.clientX - this._sliderHandle.getBoundingClientRect().left
        const mouseMove = (e) => {
          this.transferData({ y: e.clientY, x: e.clientX, shiftX: shiftX })
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
      this._view.refreshCoords(data)
      return
    }
    this._model.renew(data)
  }

  getOptions() {
    return this._model.getOptions()
  }
}

export default Pres
