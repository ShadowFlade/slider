var Panel = /** @class */ (function () {
    function Panel(nameOfSliderDiv) {
        this.item = document.getElementById(nameOfSliderDiv);
        this.name = nameOfSliderDiv;
        this.elements = [];
        if (this.to) {
            this.checkForRange();
        }
    }
    Panel.prototype.bindToDiv = function (nameOfElement, func, nameOfElement2) {
        var element = document.querySelector(nameOfElement);
        this.elements.push(element);
        this.bindCheckboxs();
        if (element.type === 'checkbox') {
            element.onchange = func;
            return true;
        }
    };
    Panel.prototype.bindCheckboxs = function () {
        var _this = this;
        console.log(this.elements);
        this.elements.forEach(function (item) {
            item.addEventListener('change', function () {
                _this.checkForRange();
            });
        });
    };
    Panel.prototype.checkForRange = function () {
        if ($(this.name).slider.isRange()) {
            this.to.disabled = false;
        }
        else {
            this.to.disabled = true;
        }
    };
    Panel.prototype.bindMinMax = function (elementID1, elementID2) {
        var _this = this;
        var el1 = document.querySelector(elementID1);
        var el2 = document.querySelector(elementID2);
        [el1, el2].forEach(function (item) {
            item.onkeydown = function (e) {
                if (e.keyCode === 13) {
                    $(_this.name).slider.setLimits(Number(el1.value), Number(el2.value));
                }
            };
        });
    };
    Panel.prototype.bindFromTo = function (elementID1, elementID2) {
        var _this = this;
        var el1 = document.querySelector(elementID1);
        var el2 = document.querySelector(elementID2);
        this.to = el2;
        el1.onkeydown = function (e) {
            if (e.keyCode === 13) {
                $(_this.name).slider.setValue(Number(el1.value), 1);
            }
        };
        el2.onkeydown = function (e) {
            if (e.keyCode === 13) {
                $(_this.name).slider.setValue(Number(el2.value), 2);
            }
        };
    };
    Panel.prototype.bindStep = function (elementID) {
        var _this = this;
        var el = document.querySelector(elementID);
        el.onkeydown = function (e) {
            if (e.keyCode === 13) {
                $(_this.name).slider.setStep(el.value);
            }
        };
    };
    return Panel;
}());
var qwe = new Panel('qwe');
qwe.bindMinMax('#min', '#max');
qwe.bindFromTo('#from', '#to');
qwe.bindStep('#step');
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
