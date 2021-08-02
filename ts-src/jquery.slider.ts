import App from './app';
// declare let jQuery: any;
// declare let $: any;
// const $ = require('jquery');

console.log('im inside');

$.fn.slider = function (this: JQuery, options: object): JQuery {
  console.log('also insede');
  console.log('hello');

  return this.each(function () {
    const app = new App(this, options);
  });
};
$('#slider').slider({
  color: 'green',
});
$('#slider').slider();
