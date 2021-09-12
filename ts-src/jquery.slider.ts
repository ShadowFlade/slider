/* eslint-disable no-irregular-whitespace */
import App from './app';

import './style.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const plugins = new Map();

class Plugin extends $ {
  item: HTMLElement;

  states: Record<string, any>;

  app: App;

  $item: JQuery;

  constructor(HTMLElement: HTMLElement, app: App) {
    super();

    this.item = HTMLElement;

    this.states = {
      progressBar: app._view._elements._range.style.display !== 'none',

      range: app.isRange(),

      orientation: app._model.getSetting('orientation'),

      scale: app._model.getSetting('marker'),

      tip: app._model.getSetting('toolTip'),

      stick: app._view._elements._tooltipsSticks[0].style.display !== 'none',
    };

    this.app = app;

    this.$item = $(HTMLElement);
  }

  tilt = (): this => {
    this.destroy();

    this.app.tilt();

    this.restore();

    return this;
  };

  scale = (option: boolean | undefined): this => {
    if (typeof option !== 'boolean') {
      this.states.scale = !this.states.scale;

      this.app.scale(this.states.scale);

      return this;
    }

    this.states.scale = !this.states.scale;

    this.app.scale(option);

    return this;
  };

  bar = (option: boolean | undefined): this => {
    if (typeof option !== 'boolean') {
      this.states.progressBar = !this.states.progressBar;

      this.app.bar(this.states.progressBar);

      return this;
    }

    this.states.progressBar = !this.states.progressBar;

    this.app.bar(option);

    return this;
  };

  tip = (option: boolean | undefined): this => {
    if (typeof option !== 'boolean') {
      this.states.tip = !this.states.tip;

      this.app.tip(this.states.tip);

      return this;
    }

    this.states.tip = !this.states.tip;

    this.app.tip(option);

    return this;
  };

  range = (option: boolean | undefined): this => {
    if (typeof option !== 'boolean') {
      this.states.range = !this.states.range;

      this.app.range(this.states.range);

      return this;
    }

    this.states.range = !this.states.range;

    this.app.range(option);

    return this;
  };

  setValue = (value: number, number: 1 | 2): this => {
    this.app.setValue(value, number);

    return this;
  };

  setLimits = (min: number, max: number): this => {
    this.destroy();

    this.app.setLimits(min, max);

    this.restore();

    return this;
  };

  isRange = (): boolean => {
    return this.app.isRange();
  };

  setStep = (value: number): this => {
    this.destroy();

    this.app.setStep(value);

    this.restore();

    return this;
  };

  stick = (option: boolean): this => {
    this.app.stick(option);

    return this;
  };

  destroy = (): void => {
    this.$item.data('handle1', this.app.getValue(1));

    if (this.isRange()) {
      this.$item.data('handle2', this.app.getValue(2));
    }

    this.$item.html('');
  };

  restore = (): void | JQuery | boolean => {
    if (Object.keys(this.$item.data()).length === 0) {
      return this.$item;
    }

    this.setValue(this.$item.data('handle1'), 1);

    if (this.isRange()) {
      this.setValue(this.$item.data('handle2'), 2);
    }

    return false;
  };
}

$.fn.slider = function slider(
  this: JQuery,
  options?: Record<string, unknown>
): Plugin {
  const app = new App(this[0], options);
  plugins.set(this[0], { plugin: $(this), app: app });
  return new Plugin(this[0], app);
};

export default Plugin;
