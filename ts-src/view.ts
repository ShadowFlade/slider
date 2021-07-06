import App from './app'
import * as slider from './jquery.slider'
import Model from './model'

class View {
  _slider: HTMLElement
  _slider_range: HTMLElement
  _slider_handle: HTMLElement
  pxOptions: Array<string> = ['height', 'width']
  _model: Model
  constructor(controller, options, item, model: Model) {
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
        `${model._innerOptions.className}-handle`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this.initiateOptions(this.convertOptions(options))
    let clone: Node = this._slider_handle.cloneNode(true)
    if (model._innerOptions.type == 'single') {
      return
    } else {
      // this._slider.insertAdjacentHTML('beforeend', clone)
      this._slider_handle.after(clone)
    }
  }
  convertOptions(options: object) {
    let newOptions = {}
    Object.assign(newOptions, this._model.getOptins(), options)
    for (let i in newOptions) {
      console.log(`settings attribute:${i} ${newOptions[i]}`)
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
}
export default View
