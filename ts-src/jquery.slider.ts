import App from './app';
declare let jQuery: any;
declare let $: any;

interface MyPlugin {
  settings: MyPluginSettings;

  (behavior: 'enable'): JQuery;
  (settings?: MyPluginSettings): JQuery;
}

interface MyPluginSettings {
  title?: string;
}
interface jquery {
  slider: MyPlugin;
}

interface JQuery {
  slider: HTMLElement;
}

(function ($) {
  $.fn.slider = function (options: object): JQuery {
    return this.each(function () {
      const app = new App(this, options);
    });
  };
})(jQuery);

$(function () {
  $('#slider').slider({
    color: 'green',
  });
});
