import App from './app'
import * as slider from './jquery.slider'
import Model from './model'
import EventMixin from './eventemitter'
import Pres from './pres'
import { map } from 'jquery'
import { settings } from './model'

class View extends EventMixin {
  _slider: HTMLElement
  _sliderMain: HTMLElement
  _sliderRange: HTMLElement

  _sliderHandles: HTMLElement[]
  _sliderTooltip
  valueDivs: Object[]
  valueDivsArray: Number[]
  items

  _model: Model

  _pres: Pres

  _item
  position: string
  constructor(pres, options, item, model: Model) {
    super()
    this._model = model
    this._pres = pres
    this._item = item
  }

  public show(slider, options, pos) {
    this._item.appendChild(slider)
    // const className = this.trigger('settingRequired', 'classsName') //TODO why this doesnt work
    this.fetchDivs(pos)
    this.initiateOptions(options)
    this.position = pos
    return {
      slider: this._slider,
      range: this._sliderRange,
      handles: this._sliderHandles,
      wrapper: this._sliderMain,
    }
  }

  private fetchDivs(position) {
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
    this._sliderHandles = Array.from(
      this._item.getElementsByClassName(
        `${this._model._settings.className}-handle--${position}`
      ) as HTMLCollectionOf<HTMLElement>
    )

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
  }
  initiateOptions(options) {
    for (let option of Object.keys(options)) {
      if (typeof options[option] === 'object') {
        for (let [i, j] of Object.entries(options[option])) {
          if (option.toString().includes('slider')) {
            this._slider.style[i] = j
          } else if (option.toString().includes('progressBar')) {
            this._sliderRange.style[i] = j
          } else if (option.toString().includes('markUp')) {
            this._slider.style[i] = j
          } else if (option.toString().includes('handle')) {
            for (let handle of this._sliderHandles) {
              handle.style[i] = j
            }
          }
        }
      }
    }
  }

  public refreshCoords(data) {
    const shiftX = data.shiftX
    let newLeft
    let dataObject
    const pinPoints = this.valueDivsArray
    const handle = data.target
    const range = this._sliderRange
    const toolTip = handle.getElementsByClassName(
      `tooltip--${this.position}`
    )[0]
    const newCoords = Object.assign(data, {
      shiftX: shiftX,
      newLeft: newLeft,
      pinPoints: pinPoints,
    })
    let pin

    if (data.clicked) {
      dataObject = this.reactOnClick(newCoords)

      newLeft = dataObject.newLeft
      pin = dataObject.pin
    } else {
      dataObject = this.reactOnDrag(newCoords)

      newLeft = dataObject.newLeft
      pin = dataObject.pin
    }

    if (data.mainAxis == 'x') {
      handle.style.left = newLeft + 'px'

      if (this._model._settings.type == 'double') {
        this.rangeInterval()
      } else {
        range.style.width = newLeft + 'px'
      }
      toolTip.textContent = data.value

      return
    } else if (data.mainAxis == 'y') {
      handle.style.top = newLeft + 'px'
      if (this._model._settings.type == 'double') {
        this.rangeInterval()
      } else {
        range.style.height = newLeft + 'px'
      }
      // range.style.height = newLeft + 'px'

      toolTip.textContent = data.value
    }
  }

  private reactOnDrag(data) {
    let direction = '0'
    let widthOrHeight = ''
    let newLeft = data.newLeft
    let margin
    let value
    if (data.mainAxis == 'x') {
      direction = 'left'
      widthOrHeight = data.width
      margin = data.marginLeft
    } else {
      direction = 'top'
      widthOrHeight = data.height
      margin = data.marginTop
    }

    const handle = data.target
    const handleWidth = handle.offsetWidth
    const handleHeight = handle.offsetHeight
    const range = this._sliderRange
    const toolTip = this._sliderTooltip

    if (data.value == 0) {
      range.style[widthOrHeight] = '0'
    }
    // const pin = this.matchHandleAndPin(data.value)
    // let neededCoords = pin.getBoundingClientRect()[direction]

    // newLeft = neededCoords - margin - handleHeight / 2
    // if (data.mainAxis == 'x') {
    if (data.altDrag) {
      newLeft = data.main - data.shiftX
    } else {
      newLeft += handle.offsetWidth / 2
      // if (pin.className.includes('values')) {
      //   if (pin.className.includes('slider-min')) {
      //     newLeft = 0
      //   } else if (pin.className.includes('slider-max')) {
      //     newLeft = data.mainMax - handleWidth / 2
      //   }
      // }
    }
    // }

    return {
      newLeft,
      // pin,
      value,
    }
  }

  private reactOnClick(data) {
    const handle = this._sliderHandles[0]
    const handleWidth = handle.offsetWidth
    const pin = data.target.parentNode
    const pinPointsValues = this.valueDivsArray
    let newLeft
    if (data.mainAxis == 'x') {
      let newLeft =
        pin.getBoundingClientRect().left - data.marginLeft - handleWidth / 2
      handle.style.left = newLeft + 'px'
      this._sliderRange.style.width = newLeft + 'px'
      this._sliderTooltip.textContent = data.value
    } else if (data.mainAxis == 'y') {
      let newLeft = pin.getBoundingClientRect().top - data.marginTop
      handle.style.top = newLeft + 'px'
      this._sliderRange.style.height = newLeft + 'px'
      this._sliderTooltip.textContent = data.value
    }

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
  private rangeInterval() {
    let minOffset = this._sliderHandles[0].offsetTop
    let maxOffset = this._sliderHandles[1].offsetTop
    const width = Math.abs(minOffset - maxOffset)
    const top = Math.min(minOffset, maxOffset)

    this._sliderRange.style.top = top + 'px'
    this._sliderRange.style.height = width + 'px'
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
