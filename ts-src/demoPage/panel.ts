interface ExamplePluginOptions {
  outputSelector: string;

  outputColor?: string;
}

interface ExamplePluginGlobalOptions {
  options: ExamplePluginOptions;
}

interface ExamplePluginFunction {
  (options: ExamplePluginOptions): JQuery;
}

interface ExamplePlugin
  extends ExamplePluginGlobalOptions,
    ExamplePluginFunction {}

interface JQuery {
  slider: Function;
}

// $(function () {
//   $('#qwe').slider({});
// });
// $(function () {
