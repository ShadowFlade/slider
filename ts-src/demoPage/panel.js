var Panel = /** @class */ (function () {
    function Panel(nameOfSliderDiv, slider) {
        this.item = document.querySelector(nameOfSliderDiv);
        this.name = nameOfSliderDiv;
        this.elements = [];
        if (this.to) {
            this.checkForRange();
        }
        this.slider = slider;
    }
    Panel.prototype.bindToDiv = function (nameOfElement, func, nameOfElement2) {
        console.log(this.slider);
        var element = document.querySelector(nameOfElement);
        this.elements.push(element);
        this.bindCheckboxs();
        if (element.type === 'checkbox') {
            element.onchange = $(this.name).slider[func];
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
document.addEventListener('DOMContentLoaded', function () {
    var slider3 = $('#slider3').slider();
    var slider2 = $('#slider2').slider();
    var qwer = $('#qwe').slider({
        minValue: 0,
        maxValue: 1360
    });
    var qwe = new Panel('#qwe', qwer);
    qwe.bindMinMax('#min', '#max');
    qwe.bindFromTo('#from', '#to');
    qwe.bindStep('#step');
    qwe.bindToDiv('#orientation', 'tilt');
    // qwe.bindToDiv('#range', () => {
    //   $('qwe').slider.range();
    // });
    // qwe.bindToDiv('#scale', () => {
    //   $('qwe').slider.scale();
    // });
    // qwe.bindToDiv('#bar', () => {
    //   $('qwe').slider.bar();
    // });
    // qwe.bindToDiv('#tip', () => {
    //   $('qwe').slider.tip();
    // });
    var panel2 = new Panel('#slider2', slider2);
    panel2.bindMinMax('#min2', '#max2');
    panel2.bindFromTo('#from2', '#to2');
    panel2.bindStep('#step2');
    panel2.bindToDiv('#orientation2', 'tilt');
    // panel2.bindToDiv('#range2', () => {
    //   $('#slider2').slider.range();
    // });
    // panel2.bindToDiv('#scale2', () => {
    //   $('#slider2').slider.scale();
    // });
    // panel2.bindToDiv('#bar2', () => {
    //   $('#slider2').slider.bar();
    // });
    // panel2.bindToDiv('#tip2', () => {
    //   $('#slider2').slider.tip();
    // });
    var panel3 = new Panel('#slider3', slider3);
    panel3.bindMinMax('#min3', '#max3');
    panel3.bindFromTo('#from3', '#to3');
    panel3.bindStep('#step3');
    panel3.bindToDiv('#orientation3', 'tilt');
    // panel3.bindToDiv('#range3', () => {
    //   $('#slider3').slider.range();
    // });
    // panel3.bindToDiv('#scale3', () => {
    //   $('#slider3').slider.scale();
    // });
    // panel3.bindToDiv('#bar3', () => {
    //   $('#slider3').slider.bar();
    // });
    // panel3.bindToDiv('#tip3', () => {
    //   $('#slider3').slider.tip();
    // });
    console.log(panel2.slider.data());
    console.log(panel3.slider.data());
    console.log(slider2, 'SLIDRE');
    console.log(slider3, 'SLIDER@');
});
