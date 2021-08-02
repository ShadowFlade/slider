import App from './app';
declare let $: any;
$.fn.slider = function (this: JQuery, options: object): JQuery {
  return this.each(function () {
    const app = new App(this, options);
  });
};
$('#slider').slider({
  color: 'green',
});
