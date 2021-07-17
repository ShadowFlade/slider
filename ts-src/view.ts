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

  show(node, options) {
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
      this._item.getElementsByClassName('marker-value')
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

  initiateOptions(options) {
    for (const option of Object.keys(options)) {
      this._slider.style[option] = options[option]
    }
    this._model.coords.xMax += this._slider.getBoundingClientRect().left
    this._model.coords.xMin += this._slider.getBoundingClientRect().left
  }

  refreshCoords(data) {
    const shiftX = data.shiftX
    let newLeft = data.x - shiftX - this._slider.getBoundingClientRect().left
    const newProgressRight = data.x
    const newProgressLeft = 0
    // if (data.value % data.stepSize == 0 || data.value == data.maxValue) {
    //   this._sliderHandle.style.left = newLeft + 'px'
    //   if (data.value == 0) {
    //     //TODO is there a better way?
    //     this._sliderRange.style.width = '0'
    //   }
    //   this._sliderRange.style.width = newLeft + 'px'
    //   this._sliderTooltip.textContent = data.value
    // }
    // else {
    if (data.value == 0) {
      this._sliderRange.style.width = '0'
    }
    const arr = this.valueDivsArray
    let minDiff = Infinity
    let value: number
    for (let i of arr) {
      let xCoord = data.value
      if (Math.abs(xCoord - +i) < minDiff) {
        minDiff = Math.abs(xCoord - Number(i))
        value = Number(i)
      }
    }
    let neededItem
    for (let i of this.valueDivs) {
      const item = i as { div: HTMLElement; value: number }
      if (value == item.value) {
        neededItem = item.div
      }
    }
    let neededCoords = neededItem.getBoundingClientRect().left
    newLeft = neededCoords - data.leftMargin
    this._sliderHandle.style.left = newLeft + 'px'
    this._sliderRange.style.width = newLeft + 'px'
    this._sliderTooltip.textContent = neededItem.dataset.value
    // }

    //click on marker
    if (data.clicked) {
      console.log(data.x, ':data x')
      const newLeft =
        data.x -
        this._slider.getBoundingClientRect().left -
        this._sliderHandle.offsetWidth / 2 +
        data.valueWidth / 2
      this._sliderHandle.style.left = newLeft + 'px'
      this._sliderRange.style.width = newLeft + 'px'
      this._sliderTooltip.textContent = data.value
      if (this.valueDivsArray.includes(data.value)) {
        for (let i of this.valueDivs) {
          const item = i as { div: HTMLElement; value: number }
          if (item.value == data.value) {
            for (let i of this.valueDivs) {
              //TODO is there a better way to do this?
              const item = i as { div: HTMLElement; value: number }
              item.div.style.color = ''
            }
            item.div.style.color = 'purple'
          }
        }

        // console.log(this.valueDivs)
        // const neededObject: Object = this.valueDivs.filter(
        //   (item: { div: HTMLElement; value: number }) => {
        //     // console.log(
        //     //   item.value,
        //     //   '      ',
        //     //   data.value,
        //     //   item.value == data.value
        //     // )
        //     console.log(item)
        //     item.value.toString() == data.value.toString()
        //   }
        // )[0]
      }
    }
  }
  // showValue() {}
}
export default View
