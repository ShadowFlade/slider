import Model from './model'

class Controller {
  _slider: HTMLElement
  _slider_range: HTMLElement
  _slider_handle: HTMLElement
  _model: Model
  constructor(item, options, model) {
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

    this._slider_handle.addEventListener('mousedown', function (event) {
      event.preventDefault()
      console.log('im moveing')
      let target = event.target as HTMLDivElement
      document.addEventListener('mousemove', (e) => {
        this.style.left = e.pageX + 'px'
      })
    })
  }
}

export default Controller
