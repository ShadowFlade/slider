function bindFuncToQwe(elementID, func) {
    var div = document.getElementById(elementID);
    div.onchange = func;
}
bindFuncToQwe('orientation', function () {
    $('qwe').slider.tilt();
});
bindFuncToQwe('range', function () {
    $('qwe').slider.range();
});
bindFuncToQwe('scale', function () {
    $('qwe').slider.scale();
});
bindFuncToQwe('bar', function () {
    $('qwe').slider.bar();
});
bindFuncToQwe('tip', function () {
    $('qwe').slider.tip();
});
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
    }
    else {
        to.disabled = true;
    }
});
