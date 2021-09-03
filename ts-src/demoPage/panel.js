var orient = document.getElementById('orientation');
orient.onchange = function () {
  $('qwe').slider.tilt();
};
var range = document.getElementById('range');
var rangeState = false;
range.onchange = function () {
  $('qwe').slider.range(rangeState);
  rangeState = !rangeState;
};
var scaleState = false;
var scale = document.getElementById('scale');
scale.onchange = function () {
  $('qwe').slider.scale(scaleState);
  scaleState = !scaleState;
};
var barState = false;
var bar = document.getElementById('bar');
bar.onchange = function () {
  $('qwe').slider.bar(barState);
  barState = !barState;
};
var tipState = false;
var tip = document.getElementById('tip');
tip.onchange = function () {
  $('qwe').slider.tip(tipState);
  tipState = !tipState;
};
var minItem = document.getElementById('min');
var maxItem = document.getElementById('max');
var min = Number(minItem.value);
var max = Number(maxItem.value);
function handleChangeLimits(e) {
  if (e.keyCode == 13) {
    // keycode for enter is 13
    $('qwe').slider.setLimits(minItem.value, maxItem.value);
    return false;
  }
}
maxItem.onkeydown = handleChangeLimits;
minItem.onkeydown = handleChangeLimits;
var from = document.getElementById('from');
var to = document.getElementById('to');
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
var step = document.getElementById('step');
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
