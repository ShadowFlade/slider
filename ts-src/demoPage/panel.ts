interface ExamplePluginOptions {
  outputColor?: string;
}

/**
 * Global options of the example plugin available as properties on $.fn object.
 */
interface ExamplePluginGlobalOptions {
  options: ExamplePluginOptions;
}

interface ExamplePluginFunction {
  (options: ExamplePluginOptions): JQuery;
}

interface Slider extends ExamplePluginGlobalOptions, ExamplePluginFunction {}

interface JQuery {
  slider: Slider;
}

// $(function () {
//   $('#qwe').slider({});
// });
