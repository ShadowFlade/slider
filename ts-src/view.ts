import App from './app'
import * as slider from './jquery.slider'
import Model from './model'
import EventMixin from './eventemitter'

class View extends EventMixin {
  _slider: HTMLElement
  _slider_range: HTMLElement
  _slider_handle: HTMLElement
  pxOptions: Array<string> = ['height', 'width']
  _model: Model
  handle_state: object = {
    x: 0,
    y: 0,
  }
  constructor(controller, options, item, model: Model) {
    super()
    // super()
    item.innerHTML = model.template
    this._model = model
    this._slider = Array.from(
      item.getElementsByClassName(
        model._innerOptions.className
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._slider_range = Array.from(
      item.getElementsByClassName(
        `${model._innerOptions.className}-range`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._slider_handle = Array.from(
      item.getElementsByClassName(
        `${this._model._innerOptions.className}-handle`.trim()
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this.initiateOptions(this.convertOptions(options))
    let clone: Node = this._slider_handle.cloneNode(true)
    if (model._innerOptions.type == 'single') {
    } else {
      this._slider_handle.after(clone)
    }
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
