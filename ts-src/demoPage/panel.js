var Panel = /** @class */ (function () {
    function Panel(nameOfSliderDiv) {
        this.item = document.getElementById(nameOfSliderDiv);
        this.name = nameOfSliderDiv;
    }
    Panel.prototype.bindToDiv = function (nameOfElement, func, nameOfElement2) {
        var _this = this;
        var element = document.querySelector(nameOfElement);
        var element2 = document.querySelector(nameOfElement2);
        if (element.type === 'checkbox') {
            element.onchange = func;
            return true;
        }
        [element, element2].forEach(function (item) {
            item.onkeydown = function (e) {
                var f = func;
                if (e.keyCode === 13) {
                    // console.log(element.value, 'element value', element);
                    // console.log(element2.value, 'element2 value', element2);
                    // console.log(this.item);
                    $(_this.name).slider[f](Number(element.value), Number(element2.value));
                }
            };
        });
    };
    return Panel;
}());
var qwe = new Panel('qwe');
qwe.bindToDiv('#min', 'setLimits', '#max');
qwe.bindToDiv('#orientation', function () {
    $('qwe').slider.tilt();
});
qwe.bindToDiv('#range', function () {
    $('qwe').slider.range();
});
qwe.bindToDiv('#scale', function () {
    $('qwe').slider.scale();
});
qwe.bindToDiv('#bar', function () {
    $('qwe').slider.bar();
});
qwe.bindToDiv('#tip', function () {
    $('qwe').slider.tip();
});
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
