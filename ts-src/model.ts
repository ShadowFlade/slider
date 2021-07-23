import EventMixin from './eventemitter'
interface IStyles {
  progressBarColor: string
  sliderColor: string

  handleColor: string
  sliderWidth: number
  sliderHeight: number
}
interface settings {
  className: string
  type: string
  position: string
  stepSize: number
  pxPerValue: number

  maxValue: number
  minValue: number
  maxMinDifference: number
  betweenMarkers: number
  mainMax: number
  toolTip: boolean
  altDrag: boolean
  marker: boolean
  styles: IStyles
}

interface ICoords {
  marginTop: number
  mainAxis: string
  main: number
  mainMin: number
  mainMax: number
  stepSize: number
  value: number
  caller: string
  valuePerPx: number
  pxPerValue: number
  maxValue: number
  minValue: number
  marginLeft: number
  valueWidth: number
  clicked: boolean

  altDrag: boolean
}

class Model extends EventMixin {
  private _slider: Element

  private _sliderRange: Element

  private _sliderHandle: Element

  private _item: Element

  private modifiable_options: Array<string> = [
    'width',
    'height',
    'color',
    'background-color',
  ]

  public coords: ICoords = {
    mainAxis: 'x',
    main: 0,

    mainMin: 0,
    mainMax: 0,
    altDrag: false,
    stepSize: 0,
    value: 0,
    caller: '',
    maxValue: 0,
    minValue: 0,
    valuePerPx: 1,
    valueWidth: 0,
    marginLeft: 0,
    marginTop: 0,
    clicked: false,
    pxPerValue: 0,
  }

  public _settings: settings = {
    className: 'slider',
    position: 'horizontal',
    type: 'single',
    stepSize: 90,
    toolTip: true,
    maxValue: 1300,
    minValue: 0,
    maxMinDifference: 0,
    marker: true,
    betweenMarkers: 40,
    mainMax: 0,
    altDrag: false,
    pxPerValue: 0,
    styles: {
      progressBarColor: 'green',
      sliderColor: 'red',
      handleColor: 'black',
      sliderWidth: 5,
      sliderHeight: 200,
    },
  }

  public initOptions(options) {
    for (const option in options) {
      if (this.modifiable_options.includes(option)) {
        this._settings.styles[option] = options[option]
      } else {
        this._settings[option] = options[option]
      }
    }
    this.coords.altDrag = this._settings.altDrag
    this._settings.maxMinDifference =
      this._settings.maxValue - this._settings.minValue
    const diff = this._settings.maxMinDifference
    this.coords.stepSize = this._settings.stepSize
    this.coords.maxValue = this._settings.maxValue
    this.coords.minValue = this._settings.minValue
    if (this._settings.position == 'horizontal') {
      this.coords.mainMax = this._settings.mainMax
      this.coords.mainAxis = 'x'
      if (this._settings.altDrag) {
        this.coords.valuePerPx = diff / this._settings.styles.sliderWidth
        this.coords.pxPerValue = this._settings.styles.sliderWidth / diff
      }
    } else {
      this.coords.mainAxis = 'y'
      this.coords.valuePerPx = diff / this._settings.styles.sliderHeight
      this.coords.mainMax = this._settings.styles.sliderHeight
    }
    this.validateOptions()
  }

  private validateOptions() {
    if (
      this._settings.styles.sliderWidth < this._settings.styles.sliderHeight
    ) {
      ;[this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
        [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth]
    }
  }

  private validate(data) {
    if (data.main > data.mainMax) {
      data.main = data.mainMax
    } else if (data.main < data.mainMin) {
      data.main = data.mainMin
    }
    if (data.value > data.maxValue) {
      data.value = data.maxValue
    } else if (data.value < data.minValue) {
      data.value = data.minValue
    }
  }

  renew(data) {
    if (this._settings.position == 'vertical') {
      this.coords.caller = 'model' // TODO this shouldnt be here,have to think of a better way
      for (const i in data) {
        this.coords[i] = data[i]
      }
      this.coords.main = data.y

      if (data.clicked) {
        this.validate(this.coords)
        this.trigger('coords changed', this.coords)
      } else {
        this.coords.value =
          (this.coords.main - this.coords.marginTop) * this.coords.valuePerPx
        this.validate(this.coords)
        this.trigger('coords changed', this.coords)
      }
    } else if (this._settings.position == 'horizontal') {
      this.coords.caller = 'model' // TODO this shouldnt be here,have to think of a better way
      if (data.clicked) {
        for (const i in data) {
          this.coords[i] = data[i]
        }

        this.validate(this.coords)
        this.trigger('coords changed', this.coords)
      } else {
        for (const i in data) {
          this.coords[i] = data[i]
        }
        // this.coords.main = data.x

        if (this._settings.altDrag) {
          this.coords.main = data.x - this.coords.marginLeft
          if (this.coords.main % this.coords.valuePerPx == 0) {
            this.coords.value += this.coords.stepSize
            console.log(this.coords.value, ':value from model')
          }
          // this.coords.value = this.coords.main * this.coords.valuePerPx

          // if (this.coords.main % this.coords.stepSize == 0) {
          //   this.coords.value += this.coords.stepSize
          // }

          // console.log(this.coords.pxPerValue, this.coords.valuePerPx)

          this.validate(this.coords)
          this.trigger('coords changed', this.coords)
          return this.coords
        }

        this.coords.main = data.x - this.coords.marginLeft
        this.coords.value = this.coords.main * this.coords.valuePerPx
        this.validate(this.coords)
        this.trigger('coords changed', this.coords)
      }
    }
    return this.coords
  }

  constructor(options, item) {
    super()
    this._item = item
    this.initOptions(options)
  }

  public getOption(option: string) {
    return this._settings.styles[option]
  }
  public setOptions(options: object) {
    this.initOptions(options)
  }

  public getOptions() {
    return this._settings.styles
  }

  public getSettings() {
    return this._settings
  }

  public getItem() {
    return this._item
  }
}
export { ICoords, settings }
export default Model
