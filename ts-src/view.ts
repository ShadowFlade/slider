import App from './app'
import * as slider from './jquery.slider'
import Model from './model'
import EventMixin from './eventemitter'
import Pres from './pres'

class View extends EventMixin {
  _slider: HTMLElement

  _sliderRange: HTMLElement

  _sliderHandle: HTMLElement

  items

  _model: Model

  _pres: Pres

  _item

  handle_state: object = {
    x: 0,
    y: 0,
  }

  constructor(pres, options, item, model: Model) {
    super()
    item.innerHTML = model.template
    this._model = model
    this._pres = pres
    this._item = item

    //
    // if (model._innerOptions.type == 'single') {
    // } else {
    //
    // }
  }

  show(template, options) {
    this._item.innnerHTML = template

    // const items = this.trigger('built') //TODO this should be working,but its not,trigget should return an object,it does,but the we cant get it in View.show()
    // const { slider, range, handle } = items
    this.trigger('built')
    const { slider, range, handle } = this.items
    this._slider = slider
    this._sliderRange = range
    this._sliderHandle = handle
    this.initiateOptions(options)
  }

  initiateOptions(options) {
    for (const option of Object.keys(options)) {
      this._slider.style[option] = options[option]
    }
  }

  refresh(data) {
    // let newLeft = data.x - shiftX - this._slider.offsetLeft
    // let newLeft = data.x - shiftX - this._slider.getBoundingClientRect().left
    const newLeft = data.x - this._sliderHandle.offsetWidth
    this._sliderHandle.style.left = newLeft + 'px'
  }
}
export default View
