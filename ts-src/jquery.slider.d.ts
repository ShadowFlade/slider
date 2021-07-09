/// <reference types="jquery" />
export class Controller {}
export class App {
  model: object

  view: object

  controller: object

  init(): void

  destroy(): void
}
export class View {}
export class Model extends EventMixin {
  options: Options

  _slider: object

  init()
}
declare class EventMixin {
  _eventHandlers: {}

  on(eventName: string, handler: Function): void

  off(eventName: string, handler: Function): void

  trigger(eventName: string): void
}
interface Options {
  type: string
  width: number
  readonly height: number
  template: string
}
//= ======================================================================
interface slider {
  settings: MyPluginSettings

  (behavior: 'enable'): JQuery
  (settings?: MyPluginSettings): JQuery
}

interface MyPluginSettings {
  title?: string
}
// interface JQuery {
//   slider: slider
// }

interface JQuery {
  slider(options: Options): JQuery
}
