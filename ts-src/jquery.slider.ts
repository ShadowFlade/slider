import App from './app';

import './style.scss';

declare let $: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const plugins = new Map();

class Plugin extends $ {
  item: HTMLElement;

  states: Record<string, any>;

  app: App;

  $item: any;

  data: any;

  constructor(HTMLElement, app) {
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

  tilt = () => {
    this.destroy();

    this.app.tilt();

    this.restore();

    return this;
  };

  scale = (option: boolean | undefined) => {
    if (typeof option !== 'boolean') {
      this.states.scale = !this.states.scale;

      this.app.scale(this.states.scale);

      return this;
    }

    this.states.scale = !this.states.scale;

    this.app.scale(option);

    return this;
  };

  bar = (option: boolean | undefined) => {
    if (typeof option !== 'boolean') {
      this.states.progressBar = !this.states.progressBar;

      this.app.bar(this.states.progressBar);

      return this;
    }

    this.states.progressBar = !this.states.progressBar;

    this.app.bar(option);

    return this;
  };

  tip = (option: boolean | undefined) => {
    if (typeof option !== 'boolean') {
      this.states.tip = !this.states.tip;

      this.app.tip(this.states.tip);

      return this;
    }

    this.states.tip = !this.states.tip;

    this.app.tip(option);

    return this;
  };

  range = (option: boolean | undefined) => {
    if (typeof option !== 'boolean') {
      this.states.range = !this.states.range;

      this.app.range(this.states.range);

      return this;
    }

    this.states.range = !this.states.range;

    this.app.range(option);

    return this;
  };

  setValue = (value: number, number: 1 | 2) => {
    this.app.setValue(value, number);

    return this;
  };

  setLimits = (min: number, max: number) => {
    this.destroy();

    this.app.setLimits(min, max);

    this.restore();

    return this;
  };

  isRange = () => {
    return this.app.isRange();
  };

  setStep = (value) => {
    this.destroy();

    this.app.setStep(value);

    this.restore();

    return this;
  };

  stick = (option: boolean) => {
    this.app.stick(option);

    return this;
  };

  destroy = () => {
    this.$item.data('handle1', this.app.getValue(1));

    if (this.isRange()) {
      this.$item.data('handle2', this.app.getValue(2));
    }

    this.$item.html('');
  };

  restore = () => {
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

const data = {
  className: 'slider',

  orientation: 'horizontal',

  type: 'single',

  stepSize: 90,

  maxValue: 400,

  minValue: 0,

  toolTip: true,

  marker: true,

  progressBarColor: 'brown',

  sliderColor: 'red',

  sliderWidth: 5,

  sliderHeight: 200,

  pinTextColor: 'green',

  toolTextColor: 'red',
};

// $('#slider').slider(data);

export default Plugin;
