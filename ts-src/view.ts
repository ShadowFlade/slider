import App from './app'
import * as slider from './jquery.slider'
import Model from './model'
import EventMixin from './eventemitter'
import Pres from './pres'

class View extends EventMixin {
  _slider: HTMLElement
  _slider_range: HTMLElement
  _slider_handle: HTMLElement
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

    // let clone: Node = this._slider_handle.cloneNode(true)
    // if (model._innerOptions.type == 'single') {
    // } else {
    //   this._slider_handle.after(clone)
    // }
  }
  show(template, options) {
    this._item.innnerHTML = template

    // const items = this.trigger('built') //TODO this should be working,but its not,trigget should return an object,it does,but the we cant get it in View.show()
    // const { slider, range, handle } = items
    this.trigger('built')
    const { slider, range, handle } = this.items
    this._slider = slider
    this._slider_range = range
    this._slider_handle = handle
    this.initiateOptions(options)
  }

  initiateOptions(options) {
    for (let option of Object.keys(options)) {
      this._slider.style[option] = options[option]
    }
  }

  refresh(data) {
    // let newLeft = data.x - shiftX - this._slider.offsetLeft
    // let newLeft = data.x - shiftX - this._slider.getBoundingClientRect().left
    let newLeft = data.x - this._slider_handle.offsetWidth
    console.log(newLeft)
    this._slider_handle.style.left = newLeft + 'px'
  }
}
export default View
