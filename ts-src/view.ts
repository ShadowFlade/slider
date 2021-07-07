import App from './app'
import * as slider from './jquery.slider'
import Model from './model'
import EventMixin from './eventemitter'
//TODO do we subscribe with view?
class View extends EventMixin {
  _slider: HTMLElement
  _slider_range: HTMLElement
  _slider_handle: HTMLElement
  pxOptions: Array<string> = ['height', 'width']
  _model: Model
  handle_state: object = {
    x: 0,
    y: 0,
  }
  constructor(controller, options, item, model: Model) {
    super()
    // super()
    item.innerHTML = model.template
    this._model = model
    this._slider = Array.from(
      item.getElementsByClassName(
        model._innerOptions.className
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._slider_range = Array.from(
      item.getElementsByClassName(
        `${model._innerOptions.className}-range`
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this._slider_handle = Array.from(
      item.getElementsByClassName(
        `${this._model._innerOptions.className}-handle`.trim()
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    this.initiateOptions(this.convertOptions(options))
    let clone: Node = this._slider_handle.cloneNode(true)
    if (model._innerOptions.type == 'single') {
      // console.log('signle', this._slider_handle)
      return
    } else {
      // this._slider.insertAdjacentHTML('beforeend', clone)
      this._slider_handle.after(clone)
    }
    console.log('test')

    console.log(model._eventHandlers, ' hahaahahahahaaahahahahhahahahaha')
  }

  convertOptions(options: object) {
    let newOptions = {}
    Object.assign(newOptions, this._model.getOptins(), options)
    for (let i in newOptions) {
      if (this.pxOptions.includes(i)) {
        newOptions[i] = `${newOptions[i]}px`
      } else {
        newOptions[i] = newOptions[i]
      }
    }
    return newOptions
  }

  initiateOptions(options) {
    for (let option of Object.keys(options)) {
      this._slider.style[option] = options[option]
    }
  }

  refresh(data) {
    // console.log('refreshing data from view', data)
    // console.log(this, ' view this')
    console.log('refreshing', this, ' this from view')
    console.log(this._slider_handle, ' slider handle')
    // let shiftX = data.x - this._slider_handle.offsetLeft
    // let newLeft = data.x - shiftX - this._slider.offsetLeft
    let newLeft = data.x
    let rightEdge = this._slider.offsetWidth - this._slider_handle.offsetWidth
    // console.log('refreshing data from view', newLeft)
    this._slider_handle.style.left = newLeft + 'px'
  }
  onMouseDown() {
    this._slider_handle.addEventListener('mousedown', (event) => {
      // console.log('mousedowned')
      event.preventDefault()
      this._model.on('handleMoved', this.refresh.bind(this))
      if (event.target == this._slider_handle) {
        // console.log('event target is handle')
        let handle = this._slider_handle
        let slider = this._slider
        let target = event.target as HTMLDivElement

        let mouseMove = (e) => {
          // console.log('handle should be moving')
          // console.log({ y: e.clientY, x: e.clientX })
          this.trigger('handleMovement', { y: e.clientY, x: e.clientX })
        }
        document.addEventListener('mousemove', mouseMove)
      }
    })
  }
}
export default View
