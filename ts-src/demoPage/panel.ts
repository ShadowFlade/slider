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
  [x: string]: any;
  slider: JQuery;
}

const orient = document.getElementById('orientation');
orient.onchange = function () {
  $('qwe').slider.tilt();
};

const range = document.getElementById('range');
let rangeState = true;
range.onchange = function () {
  $('qwe').slider.range(rangeState);
  rangeState = !rangeState;
};

let scaleState = true;
const scale = document.getElementById('scale');
scale.onchange = function () {
  $('qwe').slider.scale(scaleState);
  scaleState = !scaleState;
};

let barState = true;
const bar = document.getElementById('bar');
bar.onchange = function () {
  $('qwe').slider.bar(barState);
  barState = !barState;
};

let tipState = true;
const tip = document.getElementById('tip');
tip.onchange = function () {
  $('qwe').slider.tip(tipState);
  tipState = !tipState;
};
