import App from './app';
import './style.scss';
declare let $: any;
$.fn.slider = function (this: JQuery, options?: object): JQuery {
  return this.each(function () {
    const app = new App(this, options);

    $.fn.slider.tilt = () => {
      $(this).slider.destroy();
      app.tilt();
      $(this).slider.restore();
      return this;
    };
    $.fn.slider.scale = (option: boolean) => {
      app.scale(option);
      return this;
    };
    $.fn.slider.bar = (option: boolean) => {
      app.bar(option);
      return this;
    };
    $.fn.slider.tip = (option: boolean) => {
      app.tip(option);
      return this;
    };
    $.fn.slider.range = (option: boolean) => {
      app.range(option);
      return this;
    };
    $.fn.slider.setValue = (value: number, number: 1 | 2) => {
      app.setValue(value, number);
      return this;
    };
    $.fn.slider.setLimits = (min: number, max: number) => {
      $(this).slider.destroy();
      app.setLimits(min, max);
      $(this).slider.restore();

      return this;
    };
    $.fn.slider.isRange = () => {
      return app.isRange();
    };
    $.fn.slider.setStep = (value) => {
      $(this).slider.destroy();
      app.setStep(value);
      return this;
    };
    $.fn.slider.noStick = (option: boolean) => {
      app.noStick(option);
      return this;
    };
    $.fn.slider.destroy = () => {
      $(this).html('');
      $(this).data('handle1', app.getValue(1));

      if ($(this).slider.isRange()) {
        $(this).data('handle2', app.getValue(2));
      }
    };
    $.fn.slider.restore = () => {
      if (Object.keys($(this).data()).length == 0) {
        return $(this);
      } else {
        $(this).slider.setValue($(this).data('handle1'), 1);
        if ($(this).slider.isRange()) {
          $(this).slider.setValue($(this).data('handle2'), 2);
        }
      }
    };
  });
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

$('#slider').slider(data);
