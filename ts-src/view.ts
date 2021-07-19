import App from './app'
import * as slider from './jquery.slider'
import Model from './model'
import EventMixin from './eventemitter'
import Pres from './pres'
import { map } from 'jquery'

class View extends EventMixin {
  _slider: HTMLElement
  _sliderMain: HTMLElement
  _sliderRange: HTMLElement

  _sliderHandle: HTMLElement
  _sliderTooltip
  valueDivs: Object[]
  valueDivsArray: Number[]
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

  public show(node, options, pos) {
    const position = pos
    console.log(`${this._model._settings.className}-handle--${position}`)
    this._item.appendChild(node)
    this._sliderMain = Array.from(
      this._item.getElementsByClassName(
        `${this._model._settings.className}-main`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._slider = Array.from(
      this._item.getElementsByClassName(
        this._model._settings.className
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderRange = Array.from(
      this._item.getElementsByClassName(
        `${this._model._settings.className}-range`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderHandle = Array.from(
      this._item.getElementsByClassName(
        `${this._model._settings.className}-handle--${position}`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    console.log(this._sliderHandle, ':handle from show')

    this._sliderTooltip = Array.from(
      this._item.getElementsByClassName(
        `tooltip--${position}`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]

    const valueDivs: { div: HTMLElement; value: number }[] = Array.from(
      this._item.getElementsByClassName('jsSlider-clickable')
    ).map((item: HTMLElement) => {
      return Object.create({ div: item, value: item.textContent })
    })

    this.valueDivs = valueDivs
    this.valueDivsArray = valueDivs.map((item) => {
      return item.value
    })
    this.initiateOptions(options)
    return {
      slider: this._slider,
      range: this._sliderRange,
      handle: this._sliderHandle,
      wrapper: this._sliderMain,
    }
  }

  initiateOptions(options) {
    for (const option of Object.keys(options)) {
      this._slider.style[option] = options[option]
    }
  }

  public refreshCoords(data) {
    const shiftX = data.shiftX
    let newLeft = data.x - shiftX - this._slider.getBoundingClientRect().left
    const pinPoints = this.valueDivsArray
    const handle = this._sliderHandle
    const range = this._sliderRange
    const toolTip = this._sliderTooltip
    const newCoords = Object.assign(data, {
      shiftX: shiftX,
      newLeft: newLeft,
      pinPoints: pinPoints,
    })
    let pin

    if (data.clicked) {
      const dataObject = this.reactOnClick(newCoords)
      newLeft = dataObject.newLeft
      pin = dataObject.pin
    } else {
      const dataObject = this.reactOnDrag(newCoords)
      newLeft = dataObject.newLeft
      pin = dataObject.pin
    }

    if (data.mainAxis == 'x') {
      handle.style.left = newLeft + 'px'
      range.style.width = newLeft + 'px'
    } else {
      handle.style.top = newLeft + 'px'
      range.style.height = newLeft + 'px'
    }

    toolTip.textContent = pin.dataset.value
  }

  private reactOnDrag(data) {
    let direction = '0'
    let widthOrHeight = ''

    if (data.mainAxis == 'x') {
      direction = 'left'
      widthOrHeight = data.width
    } else {
      direction = 'top'
      widthOrHeight = data.height
    }
    let newLeft = data.newLeft
    const handle = this._sliderHandle
    const handleWidth = handle.offsetWidth
    const handleHeight = handle.offsetHeight
    const range = this._sliderRange
    const toolTip = this._sliderTooltip

    if (data.value == 0) {
      range.style[widthOrHeight] = '0' //TODO dont like it
    }
    const pin = this.matchHandleAndPin(data.value)
    let neededCoords = pin.getBoundingClientRect()[direction]
    newLeft = neededCoords - data.marginTop - handleHeight / 2

    if (pin.className.includes('values')) {
      if (pin.className.includes('slider-min')) {
        newLeft = 0
      } else if (pin.className.includes('slider-max')) {
        newLeft = data.mainMax - handleWidth / 2
      }
    }

    return {
      newLeft,
      pin,
    }
  }

  private reactOnClick(data) {
    const handle = this._sliderHandle
    const handleWidth = handle.offsetWidth
    const pin = data.target
    const pinPointsValues = this.valueDivsArray
    let newLeft = pin.getBoundingClientRect().top - data.marginTop
    this._sliderHandle.style.left = newLeft + 'px'
    this._sliderRange.style.width = newLeft + 'px'
    this._sliderTooltip.textContent = data.value

    if (pinPointsValues.includes(data.value)) {
      for (let i of this.valueDivs) {
        const item = i as { div: HTMLElement; value: number }
        if (item.value == data.value) {
          for (let i of this.valueDivs) {
            //TODO is there a better way to do this?
            const item = i as { div: HTMLElement; value: number }
            item.div.classList.remove('jsSlider-clicked')
          }
          item.div.classList.add('jsSlider-clicked')
        }
      }
    }
    return { newLeft, pin }
  }

  private showValue(newLeft) {}
  private matchHandleAndPin(value) {
    const pinPoints = this.valueDivsArray
    let minDiff = Infinity
    let pinValue: number
    for (let i of pinPoints) {
      let leastDiff = Math.abs(value - Number(i))
      if (leastDiff < minDiff) {
        minDiff = leastDiff
        pinValue = Number(i)
      }
    }
    let pin

    for (let i of this.valueDivs) {
      const item = i as { div: HTMLElement; value: number }
      if (pinValue == item.value) {
        pin = item.div
        return pin
      }
    }
  }
}
export default View
