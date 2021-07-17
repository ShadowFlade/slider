import EventMixin from './eventemitter'

interface InnerOptions {
  className: string
  type: string
  position: string
  stepSize: number
  toolTip: boolean
  maxValue: number
  minValue: number
  maxMinDifference: number
  betweenMarkers: number
  marker: boolean
}

interface ICoords {
  x: number
  xMin: number
  xMax: number
  y: number
  yMin: number
  yMax: number
  stepSize: number
  value: number
  caller: string
  valuePerPx: number
  maxValue: number
  minValue: number
  leftMargin: number
  clicked: boolean
  valueWidth: number
}

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
    stepSize: 0,
    value: 0,
    caller: '',
    maxValue: 0,
    minValue: 0,
    valuePerPx: 1,
    valueWidth: 0,
    leftMargin: 0,
    clicked: false,
  }

  public _innerOptions: InnerOptions = {
    className: 'slider',
    position: 'horizontal',
    type: 'single',
    stepSize: 90,
    toolTip: true,
    maxValue: 0,
    minValue: 0,
    maxMinDifference: 0,
    marker: true,
    betweenMarkers: 40,
  }

  validate(data) {
    if (data.x > data.xMax) {
      data.x = data.xMax
    } else if (data.x < data.xMin) {
      data.x = data.xMin
    }
    if (data.value > data.maxValue) {
      data.value = data.maxValue
    } else if (data.value < data.minValue) {
      data.value = data.minValue
    }
  }

  renew(data) {
    this.coords.caller = 'model' // TODO this shouldnt be here,have to think of a better way
    if (data.clicked) {
      // const newOpt = Object.assign({}, this.coords)
      for (const i in data) {
        this.coords[i] = data[i]
      }
      // this.coords.value = data.value
      // this.coords.clicked = true
      this.validate(this.coords)
      this.trigger('coords changed', this.coords)
    } else {
      for (const i in data) {
        this.coords[i] = data[i]
      }
      this.coords.value =
        (this.coords.x - this.coords.leftMargin) * this.coords.valuePerPx
      this.validate(this.coords)
      this.trigger('coords changed', this.coords)
    }

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
      this._innerOptions.maxValue - this._innerOptions.minValue
    const diff = this._innerOptions.maxMinDifference
    this.coords.valuePerPx = diff / this.options.width
    this.coords.stepSize = this._innerOptions.stepSize
    this.coords.maxValue = this._innerOptions.maxValue
    this.coords.minValue = this._innerOptions.minValue
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
