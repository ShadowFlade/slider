import App from './app';
declare let $: any;
$.fn.slider = function (this: JQuery, options?: object): JQuery {
  return this.each(function () {
    const app = new App(this, options);

    $.fn.slider.tilt = () => {
      $(this).html('');
      app.tilt();
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
      $(this).html('');
      app.setLimits(min, max);
      return this;
    };
    $.fn.slider.isRange = () => {
      app.isRange();
      return this;
    };
    $.fn.slider.setStep = (value) => {
      $(this).html('');
      app.setStep(value);
      return this;
    };
    $.fn.slider.noStick = (option: boolean) => {
      app.noStick(option);
      return this;
    };
  });
};
const data = {
  className: 'slider',
  orientation: 'horizontal',
  type: 'single',
  stepSize: 90,
  pxPerValue: 0,
  valuePerPx: 1,
  marginLeft: 0,
  marginTop: 0,
  maxValue: 400,
  minValue: 0,
  mainMin: 0,
  toolTip: true,
  marker: true,
  progressBarColor: 'brown',
  sliderColor: 'red',
  handleColor: 'black',
  sliderWidth: 5,
  sliderHeight: 200,
  pinTextColor: 'green',
  toolTextColor: 'red',
};
$('#slider').slider(data);
