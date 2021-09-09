var Panel = /** @class */ (function () {
    function Panel(nameOfSliderDiv, slider) {
        this.item = document.querySelector(nameOfSliderDiv);
        this.name = nameOfSliderDiv;
        this.elements = [];
        this.slider = slider;
    }
    Panel.prototype.bindToDiv = function (nameOfElement, func, nameOfElement2) {
        var element = document.querySelector(nameOfElement);
        this.bindCheckboxs();
        this.elements.push(element);
        if (element.type === 'checkbox') {
            element.onchange = this.slider[func];
            if (func === 'range') {
            }
            return true;
        }
    };
    Panel.prototype.bindCheckboxs = function () {
        var _this = this;
        this.elements.forEach(function (item) {
            item.addEventListener('change', function () {
                _this.checkForRange();
            });
        });
    };
    Panel.prototype.checkForRange = function () {
        console.log('hello');
        if (this.slider.isRange()) {
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
                    _this.slider.setLimits(Number(el1.value), Number(el2.value));
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
                _this.slider.setValue(Number(el1.value), 1);
            }
        };
        el2.onkeydown = function (e) {
            if (e.keyCode === 13) {
                _this.slider.setValue(Number(el2.value), 2);
            }
        };
        if (this.to) {
            console.log('checking');
            this.checkForRange();
        }
    };
    Panel.prototype.bindStep = function (elementID) {
        var _this = this;
        var el = document.querySelector(elementID);
        el.onkeydown = function (e) {
            if (e.keyCode === 13) {
                _this.slider.setStep(el.value);
            }
        };
    };
    return Panel;
}());
document.addEventListener('DOMContentLoaded', function () {
    var slider3 = $('#slider3').slider();
    var slider2 = $('#slider2').slider();
    var qweSlider = $('#qwe').slider({
        minValue: 0,
        maxValue: 1360
    });
    var qwe = new Panel('#qwe', qweSlider);
    qwe.bindMinMax('#min', '#max');
    qwe.bindFromTo('#from', '#to');
    qwe.bindStep('#step');
    qwe.bindToDiv('#orientation', 'tilt');
    qwe.bindToDiv('#range', 'range');
    qwe.bindToDiv('#scale', 'scale');
    qwe.bindToDiv('#bar', 'bar');
    qwe.bindToDiv('#tip', 'tip');
    var panel2 = new Panel('#slider2', slider2);
    panel2.bindMinMax('#min2', '#max2');
    panel2.bindFromTo('#from2', '#to2');
    panel2.bindStep('#step2');
    panel2.bindToDiv('#orientation2', 'tilt');
    panel2.bindToDiv('#range2', 'range');
    panel2.bindToDiv('#scale2', 'scale');
    panel2.bindToDiv('#bar2', 'bar');
    panel2.bindToDiv('#tip2', 'tip');
    var panel3 = new Panel('#slider3', slider3);
    panel3.bindMinMax('#min3', '#max3');
    panel3.bindFromTo('#from3', '#to3');
    panel3.bindStep('#step3');
    panel3.bindToDiv('#orientation3', 'tilt');
    panel3.bindToDiv('#range3', 'range');
    panel3.bindToDiv('#scale3', 'scale');
    panel3.bindToDiv('#bar3', 'bar');
    panel3.bindToDiv('#tip3', 'tip');
});
