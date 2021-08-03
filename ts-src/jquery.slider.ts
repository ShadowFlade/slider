import App from './app';
declare let $: any;
$.fn.slider = function (this: JQuery, options: object): JQuery {
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
  });
};
$('#slider').slider({});
