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
let rangeState = false;
range.onchange = function () {
  $('qwe').slider.range(rangeState);
  rangeState = !rangeState;
};

let scaleState = false;
const scale = document.getElementById('scale');
scale.onchange = function () {
  $('qwe').slider.scale(scaleState);
  scaleState = !scaleState;
};

let barState = false;
const bar = document.getElementById('bar');
bar.onchange = function () {
  $('qwe').slider.bar(barState);
  barState = !barState;
};

let tipState = false;
const tip = document.getElementById('tip');
tip.onchange = function () {
  $('qwe').slider.tip(tipState);
  tipState = !tipState;
};

const minItem = document.getElementById('min') as HTMLInputElement;
const maxItem = document.getElementById('max') as HTMLInputElement;
let min: number = Number(minItem.value);
let max: number = Number(maxItem.value);
function handleChange(this: HTMLFormElement, e) {
  if (e.keyCode == 13) {
    //keycode for enter is 13
    $('qwe').slider.setLimits(minItem.value, maxItem.value);
    return false;
  }
}
maxItem.onkeydown = handleChange;
minItem.onkeydown = handleChange;
