import App from './app'
import * as slider from './jquery.slider'
import Model from './model'
import EventMixin from './eventemitter'
import Pres from './pres'
import { map } from 'jquery'

class View extends EventMixin {
  _slider: HTMLElement

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

  public show(node, options) {
    // const items = this.trigger('built') //TODO this should be working,but its not,trigget should return an object,it does,but the we cant get it in View.show()
    // const { slider, range, handle } = items
    // this._item.innerHTML = node.toString()
    this._item.appendChild(node)
    this._slider = Array.from(
      this._item.getElementsByClassName(
        this._model._innerOptions.className
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderRange = Array.from(
      this._item.getElementsByClassName(
        `${this._model._innerOptions.className}-range`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderHandle = Array.from(
      this._item.getElementsByClassName(
        `${this._model._innerOptions.className}-handle`.trim()
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._sliderTooltip = Array.from(
      this._item.getElementsByClassName(
        'tooltip'
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
    handle.style.left = newLeft + 'px'
    range.style.width = newLeft + 'px'
    toolTip.textContent = pin.dataset.value
  }

  private reactOnDrag(data) {
    let newLeft = data.newLeft
    // const pinPoints = data.pinPoints
    const handle = this._sliderHandle
    const handleWidth = handle.offsetWidth
    const range = this._sliderRange
    const toolTip = this._sliderTooltip

    if (data.value == 0) {
      range.style.width = '0' //TODO dont like it
    }
    const pin = this.matchHandleAndPin(data.value)
    let neededCoords = pin.getBoundingClientRect().left
    newLeft = neededCoords - data.leftMargin - handleWidth / 2

    if (pin.className.includes('values')) {
      if (pin.className.includes('slider-min')) {
        newLeft = 0
      } else if (pin.className.includes('slider-max')) {
        newLeft = data.xMax - handle.offsetWidth
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
    let newLeft = pin.getBoundingClientRect().left - data.leftMargin
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
      let xCoord = value
      if (Math.abs(xCoord - +i) < minDiff) {
        minDiff = Math.abs(xCoord - Number(i))
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

  initiateOptions(options) {
    for (const option of Object.keys(options)) {
      this._slider.style[option] = options[option]
    }
    this._model.coords.xMax += this._slider.getBoundingClientRect().left
    this._model.coords.xMin += this._slider.getBoundingClientRect().left
  }
}
export default View
