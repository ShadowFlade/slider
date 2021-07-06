import EventMixin from './eventemitter'

interface InnerOptions {
  className: string
  type: string
  position: string
  stepSize: number
  toolTip: boolean
}
// interface IType {
//   single: string
//   double:string
// }
// type Type=keyof IType
class Model extends EventMixin {
  private _slider: Element
  private _slider_range: Element
  private _slider_handle: Element
  private _item: Element
  // public _options: object
  public template: string =
    "<div class='slider' id='x'><div class='slider-range'></div><div class='slider-handle'></div></div>"
  modifiable_options: Array<string> = [
    'width',
    'height',
    'color',
    'background-color',
  ]
  unmodifiable_options: Array<string> = [] //TODO можно ли это изменить на условие, что если не соответствует интерфейсу, то в зависимости от соответствия перекидывать в нужный объект, то есть если

  options = {
    width: 200,
    height: 5,
  }
  public _innerOptions: InnerOptions = {
    className: 'slider',
    position: 'horizontal',
    type: 'single',
    stepSize: 1,
    toolTip: false,
  }
  constructor(options, item) {
    super()
    // this._options = options
    this._item = item
    this.initOptions(options)
  }
  initOptions(options) {
    for (let option in options) {
      if (this.modifiable_options[option]) {
        this.options[option] = options[option]
      } else if (this.unmodifiable_options[option]) {
        this._innerOptions[option] = options[option]
      }
    }
  }

  public getOption(option: string) {
    return this.options[option]
  }
  public getOptins() {
    return this.options
  }
  public setOptions(object) {
    Object.assign(this._innerOptions, object)
    return this._innerOptions
  }
  public getItem() {
    return this._item
  }
}
export default Model
