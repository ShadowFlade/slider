import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
// import {ICoords} from './model'
class Pres extends EventMixin {
  _item: HTMLElement
  _slider: HTMLElement
  _sliderContainer: HTMLElement
  _sliderRange: HTMLElement
  _sliderMain: HTMLElement
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

  init() {
    const options = this.convertOptions(this._model.getOptions())
    const behavior = this._model.getSettings()
    const sliderObject = this._view.show(
      this.makeSlider(behavior),
      options,
      this._model._settings.position
    )
    const { slider, range, handle, wrapper } = sliderObject
    this._slider = slider
    this._sliderRange = range
    this._sliderHandle = handle
    this._sliderMain = wrapper
    let mainMax
    if (this._model.getSettings().position == 'horizontal') {
      mainMax = this._slider.offsetWidth
    } else {
      mainMax = this._slider.offsetHeight
    }

    this._model.setOptions({ mainMax: mainMax })
    // this._model.coords.mainMax += this._slider.getBoundingClientRect().left
    // this._model.coords.mainMin += this._slider.getBoundingClientRect().left
  }

  makeSlider(behavior) {
    let marker
    const main = document.createElement('div')
    main.classList.add('slider-main')
    const container = document.createElement('div')
    this._sliderContainer = container
    const slider = document.createElement('div')
    slider.classList.add('slider')
    const range = document.createElement('div')
    range.classList.add('slider-range')
    const handle = document.createElement('div')
    const tool = document.createElement('div')
    handle.append(tool)
    const min = document.createElement('span')
    min.className = 'values jsSlider-clickable'
    const max = document.createElement('span')
    max.className = ' values jsSlider-clickable'
    main.append(min)
    container.append(slider)
    main.append(container)
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

    if (behavior.position === 'vertical') {
      if (behavior.marker) {
        marker = this.makeMarker(
          main,
          behavior,
          this._model.getOptions().height
        )

        container.append(marker)
      }
      min.classList.add('slider-min--vertical')
      max.classList.add('slider-max--vertical')
      main.classList.add('slider-main--vertical')
      container.classList.add('slider-container--vertical')
      marker.classList.add('slider-marker--vertical')
      handle.classList.add('slider-handle--vertical')

      tool.classList.add('tooltip--vertical')
    } else if (behavior.position == 'horizontal') {
      if (behavior.marker) {
        marker = this.makeMarker(main, behavior, this._model.getOptions().width)
        container.append(marker)
      }
      handle.classList.add('slider-handle--horizontal')

      max.classList.add('slider-max--horizontal')
      main.classList.add('slider-main--horizontal')
      min.classList.add('slider-min--horizontal')
      tool.classList.add('tooltip--horizontal')
      container.classList.add('slider-container--horizontal')
      marker.classList.add('slider-marker--horizontal')
    }

    return main
  }

  makeMarker(sliderContainer, behavior, widthOrHeight) {
    const markerDiv = document.createElement('div')

    const majorMarkers = Math.trunc(behavior.maxValue / behavior.stepSize)
    const position = this._model.getSettings().position
    for (let i = 0; i < majorMarkers; i++) {
      const majorMarker = document.createElement('div')
      majorMarker.className = ' jsSlider-clickable'
      markerDiv.append(majorMarker)
      const margin = (widthOrHeight / majorMarkers) * 0.0027 * widthOrHeight

      const markerValue = document.createElement('label')
      markerValue.className = 'jsSlider-clickable'

      if (position == 'vertical') {
        majorMarker.classList.add('marker--major--vertical')
        markerValue.classList.add('marker-value')
        majorMarker.style.marginTop = margin + 'px'
        markerDiv.classList.add('slider-marker--vertical')
      } else {
        majorMarker.classList.add('marker--major--horizontal')
        markerValue.classList.add('marker-value')
        majorMarker.style.marginLeft = margin + 'px'
        markerDiv.classList.add('slider-marker--horizontal')
      }
      const value = behavior.stepSize * (i + 1)
      majorMarker.dataset.value = value.toString()

      markerValue.dataset.value = value.toString()
      markerValue.textContent = value.toString()
      majorMarker.append(markerValue)
    }
    return markerDiv
  }

  convertOptions(options: object) {
    const newOptions = {}
    Object.assign(newOptions, options)
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
    const marginLeft = slider.getBoundingClientRect().left
    const marginTop = slider.getBoundingClientRect().top
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
            marginLeft: marginLeft,
            clicked: false,
            marginTop: marginTop,
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

          value: value.dataset.value,
          clicked: true,
          target: target,
          marginLeft: marginLeft,
          marginTop: marginTop,
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
