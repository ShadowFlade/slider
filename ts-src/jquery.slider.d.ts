/// <reference types="jquery" />
/**
 * Options for the example plugin.
 */
interface ExamplePluginOptions {
  /**
   * CSS selector for the element where generated messages are inserted. (required)
   */
  outputSelector: string;
  /**
   * Color of the message text. (optional)
   */
  outputColor?: string;
}

/**
 * Global options of the example plugin available as properties on $.fn object.
 */
interface ExamplePluginGlobalOptions {
  /**
   * Global options of the example plugin.
   */
  options: ExamplePluginOptions;
}

/**
 * Function to apply the example plugin to the selected elements of a jQuery result.
 */
interface ExamplePluginFunction {
  /**
   * Apply the example plugin to the elements selected in the jQuery result.
   *
   * @param options Options to use for this application of the example plugin.
   * @returns jQuery result.
   */
  (options: ExamplePluginOptions): JQuery;
}

/**
 * Declaration of the example plugin.
 */
interface ExamplePlugin
  extends ExamplePluginGlobalOptions,
    ExamplePluginFunction {}

/**
 * Extend the jQuery result declaration with the example plugin.
 */
interface JQuery {
  /**
   * Extension of the example plugin.
   */
  slider: Function;
}
export class Controller {}
export class App {
  model: object;

  view: object;

  controller: object;

  init(): void;

  destroy(): void;
}
export class View {}
export class Model extends EventMixin {
  options: Options;

  _slider: object;

  init();
}
declare class EventMixin {
  _eventHandlers: {};

  on(eventName: string, handler: Function): void;

  off(eventName: string, handler: Function): void;

  trigger(eventName: string): void;
}
interface Options {
  type: string;
  width: number;
  readonly height: number;
  template: string;
}
//= ======================================================================
