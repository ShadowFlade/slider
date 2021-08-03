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
  });
};
$('#slider').slider({});
