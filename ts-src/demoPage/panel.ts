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
const min = Number(minItem.value);
const max = Number(maxItem.value);
function handleChangeLimits(this: HTMLFormElement, e) {
  if (e.keyCode == 13) {
    // keycode for enter is 13
    $('qwe').slider.setLimits(minItem.value, maxItem.value);
    return false;
  }
}
maxItem.onkeydown = handleChangeLimits;
minItem.onkeydown = handleChangeLimits;

const from = document.getElementById('from') as HTMLInputElement;
const to = document.getElementById('to') as HTMLInputElement;

from.onkeydown = handleChangeFrom;
to.onkeydown = handleChangeTo;
function handleChangeFrom(e) {
  if (e.keyCode == 13) {
    // keycode for enter is 13

    $('qwe').slider.setValue(from.value, 1);
    return false;
  }
}
function handleChangeTo(e) {
  if (e.keyCode == 13) {
    // keycode for enter is 13

    $('qwe').slider.setValue(to.value, 2);
    return false;
  }
}
const step = document.getElementById('step') as HTMLInputElement;
step.onkeydown = handleStep;
function handleStep(e) {
  if (e.keyCode == 13) {
    // keycode for enter is 13

    $('qwe').slider.setStep(step.value);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if ($('#qwe').slider.isRange()) {
    to.disabled = false;
  } else {
    to.disabled = true;
  }
});
