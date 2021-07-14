import EventMixin from './eventemitter'

interface InnerOptions {
  className: string
  type: string
  position: string
  stepSize: number
  toolTip: boolean
  max: number
  min: number
  maxMinDifference: number
}

interface ICoords {
  x: number
  xMin: number
  xMax: number
  y: number
  yMin: number
  yMax: number
  progress: number
  stepSize: number
  value: number
  caller: string
  valuePerPx: number
  max: number
  min: number
  leftMargin: number
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
    xMax: 0,
    y: 0,
    yMin: 0,
    yMax: 0,
    progress: 0,
    stepSize: 0,
    value: 0,
    caller: '',
    max: 0,
    min: 0,
    valuePerPx: 1,
    leftMargin: 0,
  }

  public _innerOptions: InnerOptions = {
    className: 'slider',
    position: 'horizontal',
    type: 'single',
    stepSize: 50,
    toolTip: false,
    max: 0,
    min: 0,
    maxMinDifference: 0,
  }

  validate(data) {
    if (data.x > data.xMax) {
      data.x = data.xMax
    } else if (data.x < data.xMin) {
      data.x = data.xMin
      console.log('validatin min')
    }
    if (data.value > data.max) {
      data.value = data.max
    } else if (data.value < data.min) {
      data.value = data.min
    }
  }

  renew(data) {
    for (const i in data) {
      this.coords[i] = data[i]
    }
    this.coords.caller = 'model' // TODO this shouldnt be here,have to think of a better way
    this.coords.value =
      (this.coords.x - this.coords.leftMargin) * this.coords.valuePerPx
    this.validate(this.coords)
    this.trigger('handleMoved', this.coords)
    return this.coords
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
      } else {
        this._innerOptions[option] = options[option]
      }
    }
    this.coords.xMax = this.options.width
    this._innerOptions.maxMinDifference =
      this._innerOptions.max - this._innerOptions.min
    const diff = this._innerOptions.maxMinDifference
    this.coords.valuePerPx = diff / this.options.width
    this.coords.stepSize = this._innerOptions.stepSize
    this.coords.max = this._innerOptions.max
    this.coords.min = this._innerOptions.min
  }

  public getOption(option: string) {
    return this.options[option]
  }

  public getOptions() {
    return this.options
  }

  public getSettings() {
    return this._innerOptions
  }

  // public setOptions(object) {
  //   Object.assign(this._innerOptions, object)
  //   return this._innerOptions
  // }

  public getItem() {
    return this._item
  }
}
export { ICoords }
export default Model
