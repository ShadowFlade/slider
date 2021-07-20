import App from './app'
import EventMixin from './eventemitter'
import Model from './model'
import View from './view'
import Controller from './pres'
declare let jQuery: any
declare let $: any

interface MyPlugin {
  settings: MyPluginSettings

  (behavior: 'enable'): JQuery
  (settings?: MyPluginSettings): JQuery
}

interface MyPluginSettings {
  title?: string
}
interface jquery {
  slider: MyPlugin
}

interface JQuery {
  slider: HTMLElement
}

;(function ($) {
  $.fn.slider = function (options: object): JQuery {
    return this.each(function () {
      const app = new App(this, options)
    })
  }
})(jQuery)

$(function () {
  $('#slider').slider({
    color: 'green',
  })
})
