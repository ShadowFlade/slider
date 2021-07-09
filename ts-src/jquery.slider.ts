import App from './app';
import EventMixin from './eventemitter';
import Model from './model';
import View from './view';
import Controller from './pres';
declare let jQuery: any;
declare let $: any;

interface MyPlugin {
  settings: MyPluginSettings

  (behavior: 'enable'): JQuery
  (settings?: MyPluginSettings): JQuery
}

interface MyPluginSettings {
  title?: string
}
interface jquery {
  slider: MyPlugin
}

interface JQuery {
  slider: HTMLElement
}

(function ($) {
  $.fn.slider = function (options: object): JQuery {
    const settings = $.extend(
      {
        'background-color': 'blue',
        color: 'red'
      },
      options
    );

    return this.each(function () {
      const app = new App(this, settings);
    });
  };
}(jQuery));

$(function () {
  $('#slider').slider({
    color: 'green'
  });
});

// $.fn.slider =Object.assign<MyPlugin, MyPluginSettings>(
//   function (this: JQuery, options: MyPluginSettings): JQuery {

//     // Merge the global options with the options given as argument.
//     // options = $.extend({}, $.fn.examplePlugin.options, options);

//     // this.click(function (event: JQuery.Event<HTMLElement>) {
//     //   let messageText = exampleService.getExampleMessage(event.currentTarget.textContent);
//     //   let messageElement = $('<p>' + messageText + '</p>');
//     //   if (options.outputColor) {
//     //     messageElement.css('color', options.outputColor);
//     //   }
//     //   $(options.outputSelector).append(messageElement);
//     // });

//     // Return the jQuery object for chaining.
//     return this;

//   },
//   // Define the global default options.
//   {
//     options: {
//       outputSelector: null
//     }
//   }
// );
// $('#slider').slider()
