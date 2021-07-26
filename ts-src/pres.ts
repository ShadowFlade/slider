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
  position: string

  constructor(model, item) {
    super()
    this._model = model
    this._item = item
    this.position = this._model._settings.position
  }

  getView(view): void {
    this._view = view

    view.on('settingsRequired', this.getSettings.bind(this))
  }

  public init() {
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
      mainMax = this._slider.offsetWidth - this._sliderHandle.offsetWidth / 2
    } else {
      mainMax = this._slider.offsetHeight
    }
    const marginLeft = this._slider.getBoundingClientRect().left
    const marginTop = this._slider.getBoundingClientRect().top
    this._model.setOptions({
      mainMax: mainMax,
      marginLeft: marginLeft,
      marginTop: marginTop,
    })
  }

  public makeSlider(behavior) {
    let position
    let widthOrHeight
    if (behavior.position == 'horizontal') {
      widthOrHeight = this._model.getOptions().sliderWidth
      position = 'horizontal'
    } else {
      position = 'vertical'
      widthOrHeight = this._model.getOptions().sliderHeight
    }
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
    if (behavior.marker) {
      marker = this.makeMarker(main, behavior, widthOrHeight)

      container.append(marker)

      tool.classList.add('tooltip--vertical')
      min.classList.add(`slider-min--${position}`)
      max.classList.add(`slider-max--${position}`)
      main.classList.add(`slider-main--${position}`)
      container.classList.add(`slider-container--${position}`)
      marker.classList.add(`slider-marker--position`)
      handle.classList.add(`slider-handle--${position}`)
      tool.classList.add(`tooltip--${position}`)

      return main
    }
  }

  private makeMarker(sliderContainer, behavior, widthOrHeight) {
    const position = this.position
    let marginCss
    if (position == 'horizontal') {
      marginCss = 'marginLeft'
    } else if (position == 'vertical') {
      marginCss = 'marginTop'
    }
    const markerDiv = document.createElement('div')
    let altDrag
    let majorMarkers = Math.trunc(
      (behavior.maxValue - behavior.minValue) / behavior.stepSize
    )
    // 40px between pins is the optimal number,if it is smaller,we make it 40
    if (widthOrHeight / majorMarkers < 40) {
      altDrag = true
      this._model.setOptions({ altDrag: true })
      majorMarkers = this._model._settings._maxPins
    }
    const listOfValues = this.calcPins()
    let j = 0
    for (let i = 0; i < majorMarkers; i++) {
      const majorMarker = document.createElement('div')
      markerDiv.append(majorMarker)
      const margin = (widthOrHeight / majorMarkers) * 0.0027 * widthOrHeight //maybe will need to make new margin for altdrag m=math.trunc((v*ppv)/ss)
      const markerValue = document.createElement('label')
      markerValue.className = 'jsSlider-clickable marker-value'
      markerDiv.classList.add(`slider-marker--${position}`)
      majorMarker.classList.add(`marker--major--${position}`)

      if (i == 0) {
        majorMarker.style[marginCss] = '0'
      } else {
        majorMarker.style[marginCss] = margin + 'px'
      }

      if (!altDrag) {
        const value = behavior.stepSize * (i + 1)
        majorMarker.dataset.value = value.toString()
        markerValue.dataset.value = value.toString()
        markerValue.textContent = value.toString()
        majorMarker.append(markerValue)
      } else {
        const ppv = this._model._settings.pxPerValue
        const ss = this._model._settings.stepSize

        let value = listOfValues[j]
        console.log(value, ':value')

        const margin = Math.trunc((value * ppv) / ss)
        majorMarker.dataset.value = value.toString()
        markerValue.dataset.value = value.toString()
        markerValue.textContent = value.toString()
        majorMarker.append(markerValue)
        j += 1
      }
    }
    return markerDiv
  }

  private calcPins() {
    const diff = this._model._settings.maxMinDifference
    const ss = this._model._settings.stepSize
    const maxPins = this._model._settings._maxPins
    const n = Math.trunc(diff / (ss * maxPins))

    const valueArr = []
    for (let i = 1; i < diff / ss; i += n) {
      let value = ss * i

      valueArr.push(value)
    }
    console.log(valueArr)

    return valueArr
  }

  convertOptions(options: object) {
    const newOptions = {
      slider: {
        width: 0,
        height: 0,
      },
      progressBar: {
        'background-color': '',
      },
      handle: {
        'background-color': '',
      },
    }
    for (let i in options) {
      if (i.toString().includes('slider')) {
        let option = i.slice(6).toLowerCase()
        if (option == 'color') {
          option = 'background-color'
        }
        newOptions.slider[option] = options[i]
        if (this.pxOptions.includes(option)) {
          newOptions.slider[option] = `${options[i]}px`
        } else {
          newOptions.slider[option] = options[i]
        }
      } else if (i.toString().includes('progressBar')) {
        let option = i.slice(11).toLowerCase()
        if (option == 'color') {
          option = 'background-color'
        }
        newOptions.progressBar[option] = options[i]
        if (this.pxOptions.includes(option)) {
          newOptions.progressBar[option] = `${options[i]}px`
        } else {
          newOptions.progressBar[option] = options[i]
        }
      } else if (i.toString().includes('handle')) {
        let option = i.slice(6).toLowerCase()
        if (option == 'color') {
          option = 'background-color'
        }
        newOptions.handle[option] = options[i]
        if (this.pxOptions.includes(option)) {
          newOptions.handle[option] = `${options[i]}px`
        } else {
          newOptions.handle[option] = options[i]
        }
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

  getSettings() {
    return this._model.getSettings()
  }
}

export default Pres
