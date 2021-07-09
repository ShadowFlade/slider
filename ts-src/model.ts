import EventMixin from './eventemitter'

interface InnerOptions {
  className: string
  type: string
  position: string
  stepSize: number
  toolTip: boolean
}

interface ICoords {
  x: number
  xMin: number
  xMax: number
  y: number
  yMin: number
  yMax: number
  caller: string
}
// interface IType {
//   single: string
//   double:string
// }
// type Type=keyof IType
class Model extends EventMixin {
  private _slider: Element

  private _sliderRange: Element

  private _sliderHandle: Element

  private _item: Element

  // public _options: object
  public template =
    "<div class='slider' id='x'><div class='slider-range'></div><div class='slider-handle'></div></div>"

  modifiable_options: Array<string> = [
    'width',
    'height',
    'color',
    'background-color',
  ]

  unmodifiable_options: Array<string> = [] // TODO можно ли это изменить на условие, что если не соответствует интерфейсу, то в зависимости от соответствия перекидывать в нужный объект, то есть если

  options = {
    width: 200,
    height: 5,
  }

  coords: ICoords = {
    x: 0,
    xMin: 0,
    xMax: 200,
    y: 0,
    yMin: 0,
    yMax: 0,
    caller: '',
  }

  validate(data) {
    if (data.x > data.xMax) {
      data.x = data.xMax
    } else if (data.x < data.xMin) {
      data.x = data.xMin
    }
  }

  renew(data) {
    for (const i in data) {
      this.coords[i] = data[i]
    }
    this.coords.caller = 'model' // TODO this shouldnt be here,have to think of a better way
    this.validate(this.coords)
    this.trigger('handleMoved', this.coords)

    return this.coords
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
    for (const option in options) {
      if (this.modifiable_options.includes(option)) {
        this.options[option] = options[option]
      } else if (this.unmodifiable_options.includes(option)) {
        this._innerOptions[option] = options[option]
      }
    }
  }

  public getOption(option: string) {
    return this.options[option]
  }

  public getOptions() {
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
export { ICoords }
export default Model
