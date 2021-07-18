import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
// import {ICoords} from './model'
class Pres extends EventMixin {
  _item: HTMLElement
  _slider: HTMLElement
  _sliderContainer: HTMLElement
  _sliderRange: HTMLElement

  _sliderHandle: HTMLElement

  _model: Model

  _view: View

  pxOptions: Array<string> = ['height', 'width']

  constructor(model, item) {
    super()
    this._model = model
    this._item = item
  }

  getView(view): void {
    this._view = view
    view.on('optionsRequired', this.getOptions.bind(this))
  }

  makeSlider(behavior) {
    const main = document.createElement('div')
    main.classList.add('slider-main')
    const container = document.createElement('div')
    container.classList.add('slider-container')
    this._sliderContainer = container
    const slider = document.createElement('div')
    slider.classList.add('slider')
    const range = document.createElement('div')
    range.classList.add('slider-range')
    const handle = document.createElement('div')
    handle.classList.add('slider-handle')
    const tool = document.createElement('div')
    tool.classList.add('tooltip')
    handle.append(tool)
    const min = document.createElement('span')
    // min.classList.add('slider-min values')
    min.className = 'slider-min values jsSlider-clickable'
    const max = document.createElement('span')
    // max.classList.add('slider-max values')
    max.className = 'slider-max values jsSlider-clickable'
    // container.append(min)
    main.append(min)

    container.append(slider)
    main.append(container)
    // container.append(max)
    main.append(max)
    slider.appendChild(range)
    slider.appendChild(handle)

    if (behavior.type !== 'single') {
      const clone: Node = handle.cloneNode(true)
      handle.after(clone)
      slider.appendChild(range)
    }
    min.textContent = behavior.minValue
    min.dataset.value = min.textContent
    max.textContent = behavior.maxValue
    max.dataset.value = max.textContent

    if (behavior.marker) {
      const marker = this.makeMarker(main, behavior, this._model.options.width)
      container.append(marker)
    }
    if (behavior.position !== 'horizontal') {
    }

    return main
  }

  makeMarker(sliderContainer, behavior, width) {
    const markerDiv = document.createElement('div')
    markerDiv.classList.add('slider-marker')
    const majorMarkers = Math.trunc(behavior.maxValue / behavior.stepSize)
    for (let i = 0; i < majorMarkers; i++) {
      const majorMarker = document.createElement('div')
      majorMarker.className = 'marker--major jsSlider-clickable'
      markerDiv.append(majorMarker)
      const marginLeft = (width / majorMarkers) * 0.0027 * width
      majorMarker.style.marginLeft = marginLeft + 'px'
      const markerValue = document.createElement('label')
      markerValue.className = 'marker-value jsSlider-clickable'
      const value = behavior.stepSize * (i + 1)
      majorMarker.dataset.value = value.toString()

      markerValue.dataset.value = value.toString()
      markerValue.textContent = value.toString()
      majorMarker.append(markerValue)
    }

    return markerDiv
  }
  init() {
    const options = this.convertOptions(this._model.getOptions())
    const behavior = this._model.getSettings()
    const sliderObject = this._view.show(this.makeSlider(behavior), options)
    const { slider, range, handle } = sliderObject
    this._slider = slider
    this._sliderRange = range
    this._sliderHandle = handle
    const xMax = this._slider.offsetWidth
    this._model.setOptions({ xMax: xMax })
  }

  convertOptions(options: object) {
    const newOptions = {}
    Object.assign(newOptions, this._model.getOptions(), options)
    for (const i in newOptions) {
      if (this.pxOptions.includes(i)) {
        newOptions[i] = `${newOptions[i]}px`
      } else {
        newOptions[i] = newOptions[i]
      }
    }
    return newOptions
  }

  onMouseDown(): void {
    const handle = this._sliderHandle
    const container = this._sliderContainer
    const slider = this._slider
    const model = this._model
    const leftMargin = slider.getBoundingClientRect().left
    model.on('coords changed', this.transferData.bind(this))

    handle.ondragstart = function () {
      return false
    }

    handle.addEventListener('mousedown', (event) => {
      event.preventDefault()
      const target = event.target as HTMLDivElement
      if (target == handle) {
        const shiftX = event.clientX - handle.getBoundingClientRect().left

        const mouseMove = (e) => {
          this.transferData({
            y: e.clientY,
            x: e.clientX,
            shiftX: shiftX,
            leftMargin: leftMargin,
            clicked: false,
          })
        }
        const onMouseUp = (e) => {
          document.removeEventListener('mousemove', mouseMove)
          document.removeEventListener('mouseUp', onMouseUp)
        }
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }
    })
    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.className.includes('jsSlider-clickable')) {
        const value =
          (target.getElementsByClassName('marker-value')[0] as HTMLElement) ||
          target
        this.transferData({
          y: event.clientY,
          x: target.getBoundingClientRect().left,
          valueWidth: value.offsetWidth,
          value: value.dataset.value,
          clicked: true,
          target: target,
          leftMargin: leftMargin,
        })
      }
    })
  }

  transferData(data) {
    if (data.caller == 'model') {
      this._view.refreshCoords(data)
      return
    }
    this._model.renew(data)
  }

  getOptions() {
    return this._model.getOptions()
  }
}

export default Pres
