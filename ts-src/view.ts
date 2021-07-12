import App from './app'
import * as slider from './jquery.slider'
import Model from './model'
import EventMixin from './eventemitter'
import Pres from './pres'

class View extends EventMixin {
  _slider: HTMLElement

  _sliderRange: HTMLElement

  _sliderHandle: HTMLElement
  _sliderTooltip

  items

  _model: Model

  _pres: Pres

  _item

  constructor(pres, options, item, model: Model) {
    super()
    this._model = model
    this._pres = pres
    this._item = item
  }

  show(node, options) {
    // const items = this.trigger('built') //TODO this should be working,but its not,trigget should return an object,it does,but the we cant get it in View.show()
    // const { slider, range, handle } = items
    // this._item.innerHTML = node.toString()
    this._item.appendChild(node)
    this._slider = Array.from(
      this._item.getElementsByClassName(
        this._model._innerOptions.className
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderRange = Array.from(
      this._item.getElementsByClassName(
        `${this._model._innerOptions.className}-range`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderHandle = Array.from(
      this._item.getElementsByClassName(
        `${this._model._innerOptions.className}-handle`.trim()
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderTooltip = Array.from(
      this._item.getElementsByClassName(
        'tooltip'
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this.initiateOptions(options)
    return {
      slider: this._slider,
      range: this._sliderRange,
      handle: this._sliderHandle,
    }
    // this.trigger('built')
    // const { slider, range, handle } = this.items
    // this._slider = slider
    // this._sliderRange = range
    // this._sliderHandle = handle
  }

  initiateOptions(options) {
    for (const option of Object.keys(options)) {
      this._slider.style[option] = options[option]
    }
  }

  refreshCoords(data) {
    // let newLeft = data.x - shiftX - this._slider.offsetLeft
    // let newLeft = data.x - shiftX - this._slider.getBoundingClientRect().left
    const newLeft = data.x - this._sliderHandle.offsetWidth
    const newProgressRight = data.x
    const newProgressLeft = 0
    this._sliderRange.style.width = data.x + 'px'
    this._sliderHandle.style.left = newLeft + 'px'
    this._sliderTooltip.textContent = data.value
  }
}
export default View
