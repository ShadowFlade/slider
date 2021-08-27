/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./ts-src/style.scss":
/*!***************************!*\
  !*** ./ts-src/style.scss ***!
  \***************************/
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./ts-src/app.ts":
/*!***********************!*\
  !*** ./ts-src/app.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model */ "./ts-src/model.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view */ "./ts-src/view.ts");
/* harmony import */ var _pres__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pres */ "./ts-src/pres.ts");
// import * as $ from 'jquery'



class App {
    constructor(item, options) {
        this._item = item;
        this._model = new _model__WEBPACK_IMPORTED_MODULE_0__.default(options, item);
        this._pres = new _pres__WEBPACK_IMPORTED_MODULE_2__.default(this._model, this._model.getItem());
        this._view = new _view__WEBPACK_IMPORTED_MODULE_1__.default(this._pres, options, item);
        this._pres.getView(this._view);
        this._pres.init();
        this._pres.onMouseDown();
    }
    tilt() {
        if (this._model.getSettings().orientation == 'vertical') {
            this._model._settings.orientation = 'horizontal';
        }
        else if (this._model.getSettings().orientation == 'horizontal') {
            this._model._settings.orientation = 'vertical';
        }
        this._pres.init();
        this._pres.onMouseDown();
    }
    scale(option) {
        if (!option) {
            this._view._elements._sliderScale.style.display = 'none';
        }
        else {
            this._view._elements._sliderScale.style.display = '';
        }
    }
    bar(option) {
        if (!option) {
            this._view._elements._sliderRange.style.display = 'none';
        }
        else {
            this._view._elements._sliderRange.style.display = '';
        }
    }
    tip(option) {
        if (!option) {
            this._view._elements._sliderTooltipContainers.forEach((item) => {
                item.style.display = 'none';
            });
        }
        else {
            this._view._elements._sliderTooltipContainers.forEach((item) => {
                item.style.display = '';
            });
        }
    }
    range(option) {
        if (option) {
            if (this._model._settings.type != 'double') {
                this._model._settings.type = 'double';
                this._pres.addHandle();
                this._pres.onMouseDown();
            }
        }
        else {
            this._model._settings.type = 'single';
            this._pres.removeHandle();
        }
    }
    setValue(value, target) {
        this._pres.setValue(value, target);
    }
    setLimits(min, max) {
        this._model._settings.maxValue = max;
        this._model._settings.minValue = min;
        this._pres.init();
        this._pres.onMouseDown();
    }
    isRange() {
        if (this._model._settings.type == 'double') {
            return true;
        }
        else {
            return false;
        }
    }
    setStep(step) {
        this._model._settings.stepSize = Number(step);
        this._pres.init();
        this._pres.onMouseDown();
    }
    noStick(option) {
        if (!option) {
        }
    }
    changeStyles(item) {
        const classes = item.className;
        let substr = 'vertical';
        let length = substr.length;
        let start = classes.indexOf(substr);
        if (classes.includes(substr)) {
            const newClasses = classes
                .slice(0, start)
                .concat('horizontal')
                .concat(classes.slice(start + length));
            item.className = newClasses;
        }
    }
    getValue(numbOfHandle) {
        let direction;
        let margin;
        console.log(numbOfHandle);
        const handle = this._view._elements._sliderHandles[numbOfHandle - 1];
        if (this._model._settings.orientation == 'horizontal') {
            direction = 'left';
            margin = 'marginLeft';
        }
        else {
            direction = 'top';
            margin = 'marginTop';
        }
        const value = handle.dataset.value;
        return value;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);


/***/ }),

/***/ "./ts-src/eventemitter.ts":
/*!********************************!*\
  !*** ./ts-src/eventemitter.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class EventMixin {
    on(eventName, handler) {
        if (!this._eventHandlers)
            this._eventHandlers = {};
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(handler);
    }
    off(eventName, handler) {
        const handlers = this._eventHandlers && this._eventHandlers[eventName];
        if (!handlers)
            return;
        for (let i = 0; i < handlers.length; i++) {
            if (handlers[i] === handler) {
                handlers.splice(i--, 1);
            }
        }
    }
    // unsubscribe(eventName, callback) {
    //   this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
    // }
    trigger(eventName, ...args) {
        let x;
        if (!this._eventHandlers || !this._eventHandlers[eventName]) {
            return;
        }
        this._eventHandlers[eventName].forEach((handler) => {
            const result = handler.call(this, ...args);
            x = result;
            return result;
        });
        return x;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventMixin);


/***/ }),

/***/ "./ts-src/model.ts":
/*!*************************!*\
  !*** ./ts-src/model.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eventemitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventemitter */ "./ts-src/eventemitter.ts");

function divisionFloor(x, y) {
    const result = Math.trunc(x / y);
    return result;
}
class Model extends _eventemitter__WEBPACK_IMPORTED_MODULE_0__.default {
    constructor(options, item) {
        super();
        this.modifiable_options = [
            'width',
            'height',
            'color',
            'background-color',
            'progressBarColor',
            'sliderColor',
            'handleColor',
            'sliderWidth',
            'sliderHeight',
        ];
        this.interval = new Map();
        this.coords = {
            main: 0,
            prevMain: 0,
            value: 1,
            prevValue: 0,
            caller: '',
            clicked: false,
            altDrag: false,
            target: null,
            mainMax: 0,
        };
        this.temp = {
            pinTextColor: '',
        };
        this._settings = {
            className: 'slider',
            orientation: 'horizontal',
            type: 'double',
            stepSize: 90,
            pxPerValue: 0,
            valuePerPx: 1,
            marginLeft: 0,
            marginTop: 0,
            maxValue: 1360,
            minValue: 0,
            maxMinDifference: 0,
            betweenMarkers: 40,
            _maxPins: 5,
            mainMax: 200,
            mainMin: 0,
            valueWidth: 0,
            toolTip: true,
            marker: true,
            altDrag: false,
            built: false,
            styles: {
                progressBarColor: 'green',
                sliderColor: 'red',
                handleColor: '',
                sliderWidth: 5,
                sliderHeight: 200,
                toolTextColor: 'green',
            },
        };
        this._item = item;
        this.initOptions(options);
    }
    initOptions(options) {
        if (options) {
            Object.keys(options).forEach((key) => {
                if (this._settings.styles.hasOwnProperty(key)) {
                    this._settings.styles[key] = options[key];
                }
                else if (this.temp.hasOwnProperty(key)) {
                    this.temp[key] = options[key];
                }
                else {
                    this._settings[key] = options[key];
                }
            });
        }
        this.correctOptions();
    }
    correctOptions() {
        this.coords.altDrag = this._settings.altDrag;
        this.coords.mainMax = this._settings.mainMax;
        this._settings.maxMinDifference =
            this._settings.maxValue - this._settings.minValue;
        const diff = this._settings.maxMinDifference;
        if (this._settings.orientation == 'horizontal') {
            this._settings.valuePerPx = diff / this._settings.mainMax;
        }
        else if (this._settings.orientation == 'vertical') {
            this._settings.valuePerPx = diff / this._settings.styles.sliderHeight;
        }
        this._settings.pxPerValue =
            this._settings.mainMax / (diff / this._settings.stepSize);
        this.validateOptions();
    }
    validateOptions() {
        // fixing user's mistake in input/contradictions in input
        if (this._settings.orientation === 'vertical' &&
            this._settings.styles.sliderWidth > this._settings.styles.sliderHeight) {
            [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
                [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
        }
        else if (this._settings.orientation == 'horizontal' &&
            this._settings.styles.sliderWidth < this._settings.styles.sliderHeight) {
            [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
                [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
        }
        if (this._settings.maxValue < this._settings.minValue) {
            [this._settings.maxValue, this._settings.minValue] = [
                this._settings.minValue,
                this._settings.maxValue,
            ];
        }
    }
    validate(data) {
        const validatedData = Object.assign({}, data);
        const max = this._settings.mainMax;
        const min = this._settings.mainMin;
        const maxValue = this._settings.maxValue;
        const minValue = this._settings.minValue;
        if (validatedData.main >= max) {
            validatedData.main = max;
            validatedData.value = maxValue; // TODO figure out why we need this workaround,main mean does not work
        }
        else if (validatedData.main <= min) {
            validatedData.main = min;
            validatedData.value = minValue;
        }
        return validatedData;
    }
    renew(data, ori, type) {
        const valuePerPx = this._settings.valuePerPx;
        const pxPerValue = this._settings.pxPerValue;
        const stepSize = this._settings.stepSize;
        let axis = 0;
        let margin = 0;
        if (this._settings.orientation == 'vertical') {
            axis = data.y;
            margin = this._settings.marginTop;
        }
        else if (this._settings.orientation == 'horizontal') {
            axis = data.x;
            margin = this._settings.marginLeft;
        }
        this.coords.caller = 'model'; // TODO this shouldnt be here,have to think of a better way
        for (const i in data) {
            this.coords[i] = data[i];
        }
        if (data.clicked) {
            this.coords.main = axis - margin;
            const validatedCoords = this.validate(this.coords);
            if (validatedCoords) {
                this.trigger('coords changed', validatedCoords, ori, type);
                return validatedCoords;
            }
        }
        this.coords.main = axis - margin;
        this.coords.value =
            divisionFloor(this.coords.main, pxPerValue) * this._settings.stepSize;
        const validatedCoords = this.validate(this.coords);
        this.coords.prevMain = this.coords.main;
        if (validatedCoords) {
            this.trigger('coords changed', validatedCoords, ori, type);
            return validatedCoords;
        }
    }
    calcValue(target, offset) {
        let margin;
        if (this._settings.orientation == 'horizontal') {
            margin = 'marginLeft';
        }
        else if (this._settings.orientation == 'vertical') {
            margin = 'marginTop';
        }
        const value = divisionFloor(offset - this._settings[margin], this._settings.pxPerValue) * this._settings.stepSize;
        return {
            value: value,
            target: target,
        };
    }
    calcMain(value, target) {
        let nValue;
        if (value % this._settings.stepSize == 0) {
            nValue = value;
        }
        else {
            nValue =
                this._settings.stepSize * Math.trunc(value / this._settings.stepSize);
        }
        const main = (value * this._settings.pxPerValue) / this._settings.stepSize;
        this.coords.main = main;
        this.coords.value = nValue;
        this.coords.target = target;
        // console.log(this.coords, 'COORDS');
        if (this.validate(this.coords)) {
            this.trigger('coords changed', this.coords, this._settings.orientation, this._settings.type);
            return;
        }
        return;
    }
    setOptions(options) {
        this.initOptions(options);
        this.correctOptions();
    }
    getStyles() {
        return this._settings.styles;
    }
    getStyle(option) {
        return this._settings.styles[option];
    }
    getSetting(option) {
        return this._settings[option];
    }
    getSettings() {
        return this._settings;
    }
    getItem() {
        return this._item;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Model);


/***/ }),

/***/ "./ts-src/pres.ts":
/*!************************!*\
  !*** ./ts-src/pres.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eventemitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventemitter */ "./ts-src/eventemitter.ts");

function elemsDiff(arr) {
    let res = [];
    for (let i = 0; i < arr.length - 1; i += 1) {
        const result = +arr[i + 1] - +arr[i];
        res.push(result);
    }
    return res;
}
function checkForZero(number) {
    if (number > 0) {
        return number;
    }
    else {
        throw new Error('can not operate with non-positive numbers');
    }
}
class Pres extends _eventemitter__WEBPACK_IMPORTED_MODULE_0__.default {
    constructor(model, item) {
        super();
        this.pxOptions = ['height', 'width'];
        this._model = model;
        this._item = item;
        this._model.on('settings changed', this.init.bind(this));
    }
    getView(view) {
        this._view = view;
        this._view._temp = this._model.temp;
        view.on('settingsRequired', this.getSettings.bind(this));
    }
    init() {
        this._model.validateOptions();
        const orientation = this._model.getSetting('orientation');
        let widthOrHeight;
        if (orientation == 'horizontal') {
            widthOrHeight = this._model.getStyle('sliderWidth');
        }
        else if (orientation == 'vertical') {
            widthOrHeight = this._model.getStyle('sliderHeight');
        }
        const options = this.convertOptions(this._model.getStyles());
        const behavior = this._model.getSettings();
        const { main: sliderMain, container, slider } = this.makeSlider(behavior);
        const { marginLeft, marginTop, handles, offsetWidth, offsetHeight } = this._view.showSlider(sliderMain, orientation);
        let mainMax;
        let mainMin;
        mainMax = offsetWidth - handles[0].offsetWidth / 2;
        mainMin = handles[0].offsetWidth / 2;
        this._model.setOptions({
            mainMax,
            marginLeft,
            marginTop,
            mainMin,
        });
        if (behavior.marker) {
            const marker = this.makeMarker(behavior, widthOrHeight);
            container.appendChild(marker);
        }
        this.fetchDivs();
        this._view.implementStyles(options, this._model._settings.orientation);
        this._model._settings.built = true;
    }
    makeSlider(behavior) {
        const viewEls = this._view._elements;
        let direction;
        let orientation;
        let widthOrHeight;
        if (behavior.orientation === 'horizontal') {
            widthOrHeight = this._model.getStyle('sliderWidth');
            orientation = 'horizontal';
            direction = 'left';
        }
        else {
            orientation = 'vertical';
            widthOrHeight = this._model.getStyle('sliderHeight');
            direction = 'top';
        }
        let marker;
        const main = document.createElement('div');
        main.classList.add('slider-main');
        const container = document.createElement('div');
        // this._sliderContainer = container;
        const slider = document.createElement('div');
        slider.classList.add('slider');
        const range = document.createElement('div');
        range.classList.add('slider-range');
        const handle = document.createElement('div');
        if (orientation === 'horizontal') {
            range.style.width = '0px';
            handle.style[direction] = '0px';
        }
        else if (orientation === 'vertical') {
            range.style.height = '0px';
            handle.style[direction] = '0px';
        }
        const tool = document.createElement('div');
        const tooltipContainer = document.createElement('div');
        tooltipContainer.className = `tooltipContainer tooltipContainer--${orientation}`;
        const tooltipStick = document.createElement('div');
        tooltipStick.className = `tooltipStick tooltipStick--${orientation}`;
        tooltipContainer.append(tooltipStick);
        this._view._elements._sliderTooltipSticks.push(tooltipStick);
        tooltipContainer.append(tool);
        handle.append(tooltipContainer);
        const min = document.createElement('span');
        min.className = 'jsOffset values jsSlider-clickable';
        const max = document.createElement('span');
        max.className = 'jsOffset values jsSlider-clickable';
        main.append(min);
        container.append(slider);
        main.append(container);
        main.append(max);
        slider.appendChild(range);
        // this._sliderRange = range;
        slider.appendChild(handle);
        handle.className = `slider-handle slider-handle--${orientation}`;
        // this._view._elements._sliderHandles = [];
        viewEls._sliderHandles.push(handle);
        container.className = `slider-container slider-container--${orientation}`;
        tool.className = `tooltip tooltip--${orientation}`;
        if (behavior.type !== 'single') {
            this.addHandle(handle, range, direction);
        }
        min.textContent = String(behavior.minValue);
        min.dataset.value = min.textContent;
        max.textContent = String(behavior.maxValue);
        max.dataset.value = max.textContent;
        min.classList.add(`slider-min--${orientation}`);
        max.classList.add(`slider-max--${orientation}`);
        main.classList.add(`slider-main--${orientation}`);
        return { main: main, container, slider };
    }
    makeMarker(behavior, widthOrHeight) {
        const orientation = this._model.getSetting('orientation');
        let marginCss;
        if (orientation === 'horizontal') {
            marginCss = 'marginLeft';
        }
        else if (orientation === 'vertical') {
            marginCss = 'marginTop';
        }
        const markerDiv = document.createElement('div');
        const { valuesForMarkers, majorMarkers, altDrag, margin } = this.calcPins(behavior, widthOrHeight);
        const listOfValues = valuesForMarkers;
        let j = 0;
        for (let i = 0; i < valuesForMarkers.length - 1; i += 1) {
            const majorMarker = document.createElement('div');
            markerDiv.append(majorMarker);
            const markerValue = document.createElement('label');
            markerValue.className = `jsSlider-clickable marker-value marker-value--${orientation}`;
            markerDiv.classList.add(`slider-marker--${orientation}`);
            majorMarker.className = `jsOffset marker--major marker--major--${orientation}`;
            if (i == 0) {
                majorMarker.style[marginCss] =
                    margin -
                        this._view._elements._sliderHandles[0].offsetWidth / 2 +
                        'px';
            }
            else {
                majorMarker.style[marginCss] = margin + 'px';
            }
            if (!altDrag) {
                const value = behavior.stepSize * (i + 1);
                majorMarker.dataset.value = value.toString();
                markerValue.dataset.value = value.toString();
                markerValue.textContent = value.toString();
                majorMarker.append(markerValue);
            }
            else {
                const value = listOfValues[j];
                majorMarker.dataset.value = value.toString();
                markerValue.dataset.value = value.toString();
                markerValue.textContent = value.toString();
                majorMarker.append(markerValue);
                j += 1;
            }
        }
        markerDiv.className = `slider-marker slider-marker--${orientation}`;
        return markerDiv;
    }
    addHandle(handl, rang, directio) {
        let handle;
        let range;
        let direction;
        const viewEls = this._view._elements;
        this._model._settings.type = 'double';
        if (!handl) {
            handle = viewEls._sliderHandles[0];
            range = viewEls._sliderRange;
        }
        else {
            handle = handl;
            range = rang;
            direction = directio;
        }
        const behavior = this._model.getSettings();
        if (behavior.orientation === 'horizontal') {
            direction = 'left';
        }
        else {
            direction = 'top';
        }
        const handleCLone = handle.cloneNode(true);
        handleCLone.style[direction] = '20px';
        const tooltipContainer = handleCLone.getElementsByClassName('tooltipContainer')[0];
        this._view._elements._sliderTooltipContainers.push(tooltipContainer);
        handle.after(range);
        range.after(handleCLone);
        const stick = this._view.fetchHTMLEl('tooltipStick', true, handleCLone);
        viewEls._sliderTooltipSticks.push(stick);
        viewEls._sliderHandles.push(handleCLone);
        if (this._model._settings.built) {
            this._view.rangeInterval(this._model._settings.orientation);
            this.showValue(handleCLone);
        }
    }
    showValue(handle) {
        let direction;
        if (this._model._settings.orientation == 'horizontal') {
            direction = 'left';
        }
        else if (this._model._settings.orientation == 'vertical') {
            direction = 'top';
        }
        const offset = handle.getBoundingClientRect()[direction];
        const { value, target } = this._model.calcValue(handle, offset);
        this._view.showValue(target, value);
    }
    removeHandle() {
        const viewEls = this._view._elements;
        this._model._settings.type = 'single';
        const orient = this._model._settings.orientation;
        if (orient === 'horizontal') {
            viewEls._sliderRange.style.left = '0px';
        }
        else if (orient === 'vertical') {
            viewEls._sliderRange.style.top = '0px';
        }
        viewEls._sliderHandles[0].before(viewEls._sliderRange);
        viewEls._sliderHandles[1].remove();
        viewEls._sliderHandles = viewEls._sliderHandles.slice(0, 1);
        if (this._model._settings.built) {
            this._view.rangeInterval(this._model._settings.orientation);
        }
    }
    fetchDivs() {
        const className = this._model._settings.className;
        const ori = this._model._settings.orientation;
        this._view.fetchDivs(ori, className);
    }
    calcPins(behavior, widthOrHeight) {
        let altDrag;
        let majorMarkers = Math.trunc((behavior.maxValue - behavior.minValue) / behavior.stepSize);
        // 40px between pins is the optimal number,if it is smaller,we make it 40
        if (widthOrHeight / majorMarkers < 40) {
            altDrag = true;
            this._model.setOptions({
                altDrag,
            });
            majorMarkers = this._model._settings._maxPins;
        }
        const diff = this._model._settings.maxMinDifference;
        const ss = this._model._settings.stepSize;
        const maxPins = this._model._settings._maxPins;
        const n = checkForZero(Math.trunc(diff / (ss * majorMarkers))); //каждый n-ый элемент из возможныъ value будет помещен на scale
        const valuesForMarkers = [];
        for (let i = n; i < diff / ss; i += n) {
            const value = ss * i;
            valuesForMarkers.push(value);
        }
        const margin = (valuesForMarkers[0] / diff) * widthOrHeight;
        // console.log(
        //   '🚀 ~ Pres ~ calcPins ~ margin',
        //   margin,
        //   valuesForMarkers[0],
        //   diff,
        //   widthOrHeight
        // );
        return { valuesForMarkers, majorMarkers, altDrag, margin };
    }
    convertOptions(options) {
        const newOptions = {
            slider: {
                width: 0,
                height: 0,
            },
            progressBar: {
                'background-color': '',
            },
            handle: {
                'background-color': '',
            },
            tool: {
                color: '',
            },
        };
        for (const i in options) {
            if (i.toString().includes('slider')) {
                let option = i.slice(6).toLowerCase();
                if (option == 'color') {
                    option = 'background-color';
                }
                newOptions.slider[option] = options[i];
                if (this.pxOptions.includes(option)) {
                    newOptions.slider[option] = `${options[i]}px`;
                }
                else {
                    newOptions.slider[option] = options[i];
                }
            }
            else if (i.toString().includes('progressBar')) {
                let option = i.slice(11).toLowerCase();
                if (option == 'color') {
                    option = 'background-color';
                }
                newOptions.progressBar[option] = options[i];
                if (this.pxOptions.includes(option)) {
                    newOptions.progressBar[option] = `${options[i]}px`;
                }
                else {
                    newOptions.progressBar[option] = options[i];
                }
            }
            else if (i.toString().includes('handle')) {
                let option = i.slice(6).toLowerCase();
                if (option == 'color') {
                    option = 'background-color';
                }
                newOptions.handle[option] = options[i];
                if (this.pxOptions.includes(option)) {
                    newOptions.handle[option] = `${options[i]}px`;
                }
                else {
                    newOptions.handle[option] = options[i];
                }
            }
            else if (i.toString().includes('tool')) {
                let option = i.slice(4).toLowerCase();
                if (option == 'color') {
                    option = 'background-color';
                }
                else if (option == 'textcolor') {
                    option = 'color';
                }
                newOptions.tool[option] = options[i];
                if (this.pxOptions.includes(option)) {
                    newOptions.tool[option] = `${options[i]}px`;
                }
                else {
                    newOptions.tool[option] = options[i];
                }
            }
        }
        return newOptions;
    }
    onMouseDown() {
        const handles = this._view._elements._sliderHandles;
        const container = this._view._elements._sliderContainer;
        const slider = this._view._elements._slider;
        const model = this._model;
        const marginLeft = slider.getBoundingClientRect().left; //TODO should take from model?
        const marginTop = slider.getBoundingClientRect().top;
        model.on('coords changed', this.transferData.bind(this));
        for (const handle of handles) {
            handle.ondragstart = function () {
                return false;
            };
            handle.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                const ori = this._model._settings.orientation;
                const type = this._model._settings.type;
                const target = event.target;
                if (target == handle) {
                    const shiftX = event.clientX - handle.getBoundingClientRect().left;
                    const mouseMove = (e) => {
                        this.transferData({
                            y: e.clientY,
                            x: e.clientX,
                            shiftX: shiftX,
                            marginLeft: marginLeft,
                            clicked: false,
                            marginTop: marginTop,
                            target: event.target,
                        }, ori, type);
                    };
                    const onMouseUp = (e) => {
                        document.removeEventListener('pointermove', mouseMove);
                        document.removeEventListener('pointerup', onMouseUp);
                    };
                    document.addEventListener('pointermove', mouseMove);
                    document.addEventListener('pointerup', onMouseUp);
                }
            });
        }
        container.addEventListener('click', (event) => {
            const target = event.target;
            const ori = this._model._settings.orientation;
            const type = this._model._settings.type;
            if (target.className.includes('jsSlider-clickable')) {
                const value = target.getElementsByClassName('marker-value')[0] ||
                    target;
                this.transferData({
                    y: event.clientY,
                    x: target.getBoundingClientRect().left,
                    value: value.dataset.value,
                    clicked: true,
                    target: target,
                    marginLeft: marginLeft,
                    marginTop: marginTop,
                }, ori, type);
            }
        });
    }
    transferData(data, ori, type) {
        const dataForTransfer = Object.assign({}, data);
        if (dataForTransfer.caller == 'model') {
            dataForTransfer.marginLeft = this._model._settings.marginLeft;
            dataForTransfer.marginTop = this._model._settings.marginTop;
            this._view.refreshCoords(dataForTransfer, ori, type);
            return;
        }
        this._model.renew(dataForTransfer, ori, type);
    }
    setValue(value, target) {
        const viewEls = this._view._elements;
        let handle;
        if (target == 1) {
            handle = viewEls._sliderHandles[0];
        }
        else if (target == 2) {
            if (this._model._settings.type == 'double') {
                handle = viewEls._sliderHandles[1];
            }
            else {
                throw new ReferenceError('Can not reference absent handle');
            }
        }
        this._model.calcMain(value, handle);
    }
    getSettings() {
        return this._model.getSettings();
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pres);


/***/ }),

/***/ "./ts-src/view.ts":
/*!************************!*\
  !*** ./ts-src/view.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eventemitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventemitter */ "./ts-src/eventemitter.ts");

class View extends _eventemitter__WEBPACK_IMPORTED_MODULE_0__.default {
    constructor(pres, options, item) {
        super();
        this._elements = {
            _slider: null,
            _sliderMain: null,
            _sliderScale: null,
            _sliderRange: null,
            _sliderTooltipContainers: [],
            _sliderHandles: [],
            _sliderContainer: null,
            _sliderTooltip: [],
            _sliderTooltipSticks: [],
            _sliderPins: [],
        };
        this._pres = pres;
        this._item = item;
    }
    implementStyles(options, pos) {
        this.initiateOptions(options);
        this.orientation = pos;
        if (this._elements._sliderTooltip[0].getBoundingClientRect().left < 0) {
            this._elements._sliderContainer.style.justifyContent = 'space-between';
            this._elements._sliderContainer.style.flexDirection = 'row-reverse';
            const min = this.fetchHTMLEl('slider-min--vertical', true);
            min.style.left = '10px';
            this._elements._sliderTooltipContainers.forEach((item) => {
                item.style.flexDirection = 'row';
                item.style.right = 'auto';
                item.style.left = '100%';
                Array.from(this._item.getElementsByClassName('values')).forEach((item) => {
                    item.style.justifyContent = 'flex-end';
                }); //TODO should be a nicer way
            });
        }
        return {
            slider: this._elements._slider,
            range: this._elements._sliderRange,
            handles: this._elements._sliderHandles,
            wrapper: this._elements._sliderMain,
        };
    }
    showSlider(sliderMain, ori) {
        const main = this._item.appendChild(sliderMain);
        const marginLeft = main.getBoundingClientRect().left;
        const marginTop = main.getBoundingClientRect().top;
        const offsetWidth = main.offsetWidth;
        const offsetHeight = main.offsetHeight;
        const handles = this.fetchHTMLEl('slider-handle', false);
        return { marginLeft, marginTop, handles, offsetWidth, offsetHeight };
    }
    fetchHTMLEl(className, single, elem = this._item) {
        const item = Array.from(elem.getElementsByClassName(className));
        if (single) {
            return item[0];
        }
        else {
            return item;
        }
    }
    fetchDivs(orientation, defClassName) {
        this._elements._sliderMain = this.fetchHTMLEl(`${defClassName}-main`, true);
        this._elements._slider = this.fetchHTMLEl(defClassName, true);
        this._elements._sliderRange = this.fetchHTMLEl(`${defClassName}-range`, true);
        this._elements._sliderHandles = this.fetchHTMLEl(`${defClassName}-handle--${orientation}`, false);
        // console.log(this._elements._sliderHandles, 'fetch divs');
        this._elements._sliderTooltip = this.fetchHTMLEl(`tooltip`, false);
        this._elements._sliderContainer = this.fetchHTMLEl(`${defClassName}-container`, true);
        this._elements._sliderScale = this.fetchHTMLEl(`${defClassName}-marker`, true);
        this._elements._sliderTooltipContainers = this.fetchHTMLEl('tooltipContainer', false);
        this._elements._sliderPins = this.fetchHTMLEl('jsSlider-clickable', false);
        const valueDivs = Array.from(this._item.getElementsByClassName('jsSlider-clickable')).map((item) => {
            return Object.create({
                div: item,
                value: item.textContent,
            });
        });
        this.valueDivs = valueDivs;
        this.valueDivsArray = valueDivs.map((item) => {
            return item.value;
        });
        let offset;
        if (orientation == 'horizontal') {
            offset = 'offsetLeft';
        }
        else {
            offset = 'offsetTop';
        }
        const offsets = Array.from(this._item.getElementsByClassName('jsOffset')).map((item) => {
            return { div: item, offset: item[offset] };
        });
        const offsetsNums = offsets.map((item) => {
            return item.offset;
        });
        this.offsets = offsets;
        this.offsetsNums = offsetsNums;
    }
    initiateOptions(options) {
        for (const option of Object.keys(options)) {
            if (typeof options[option] === 'object') {
                for (const [i, j] of Object.entries(options[option])) {
                    if (option.toString().includes('slider')) {
                        this._elements._slider.style[i] = j;
                    }
                    else if (option.toString().includes('progressBar')) {
                        this._elements._sliderRange.style[i] = j;
                    }
                    else if (option.toString().includes('markUp')) {
                        this._elements._slider.style[i] = j;
                    }
                    else if (option.toString().includes('handle')) {
                        for (const handle of this._elements._sliderHandles) {
                            handle.style[i] = j;
                        }
                    }
                    else if (option.toString().includes('tool')) {
                        for (const tool of this._elements._sliderTooltip) {
                            tool.style[i] = j;
                        }
                    }
                }
            }
        }
    }
    refreshCoords(data, ori, type) {
        const shiftX = data.shiftX;
        const pinPoints = this.valueDivsArray;
        let newLeft;
        let dataObject;
        let handle;
        let direction;
        let widthOrHeight;
        let value = data.value;
        if (ori == 'vertical') {
            direction = 'top';
            widthOrHeight = 'height';
        }
        else if (ori == 'horizontal') {
            direction = 'left';
            widthOrHeight = 'width';
        }
        if (type == 'single') {
            handle = this._elements._sliderHandles[0];
        }
        else if (type == 'double') {
            handle = data.target;
        }
        const range = this._elements._sliderRange;
        const toolTip = this.fetchHTMLEl(`tooltip`, true, handle);
        const newCoords = Object.assign(data, {
            shiftX: shiftX,
            newLeft: newLeft,
            pinPoints: pinPoints,
        });
        let pin;
        if (data.clicked) {
            dataObject = this.reactOnClick(newCoords, ori, type);
            if (dataObject) {
                newLeft = dataObject.newLeft;
                pin = dataObject.pin;
            }
            else {
                return false;
            }
        }
        else {
            if (data.altDrag) {
                dataObject = this.reactOnDrag(newCoords, ori, type);
                newLeft = dataObject.newLeft;
                pin = dataObject.pin;
            }
            else {
                let { newLeft: nl, value: v } = this.pinnedDrag(data, ori, type);
                newLeft = nl;
                value = v;
            }
        }
        handle.style[direction] = newLeft + 'px';
        if (type == 'double') {
            this.rangeInterval(ori);
        }
        else {
            range.style[widthOrHeight] = newLeft + handle.offsetWidth / 2 + 'px';
        }
        handle.dataset.value = value;
        value = numberOfDigits(value);
        toolTip.textContent = value;
        return;
    }
    reactOnDrag(data, ori, type) {
        let direction = '0';
        let widthOrHeight = '';
        let newLeft = data.newLeft;
        let margin;
        let value;
        if (ori == 'horizontal') {
            direction = 'left';
            widthOrHeight = data.width;
            margin = data.marginLeft;
        }
        else {
            direction = 'top';
            widthOrHeight = data.height;
            margin = data.marginTop;
        }
        const handle = data.target;
        const handleWidth = handle.offsetWidth;
        const handleHeight = handle.offsetHeight;
        const range = this._elements._sliderRange;
        const toolTip = this._elements._sliderTooltip;
        if (data.value == 0) {
            range.style[widthOrHeight] = '0';
        }
        if (data.altDrag) {
            newLeft = data.main - data.shiftX;
        }
        else {
            newLeft += handle.offsetWidth / 2;
        }
        // if (handle == this._elements._sliderHandles[1]) {
        //   console.log(newLeft, 'from view MUHAHAHHA');
        // }
        return {
            newLeft,
            value,
        };
    }
    pinnedDrag(data, ori, type) {
        let direction = '0';
        let widthOrHeight = '';
        let newLeft;
        let margin;
        let value;
        const handleHeight = this._elements._sliderHandles[0].offsetWidth;
        if (ori == 'horizontal') {
            direction = 'left';
            widthOrHeight = data.width;
            margin = data.marginLeft;
        }
        else {
            direction = 'top';
            widthOrHeight = data.height;
            margin = data.marginTop;
        }
        const pin = this.matchHandleAndPin(data.main, ori);
        value = pin.dataset.value;
        let neededCoords = pin.getBoundingClientRect()[direction];
        newLeft = neededCoords - margin - handleHeight / 2;
        if (pin.className.includes('values')) {
            if (pin.className.includes('slider-min')) {
                newLeft = 0;
            }
            else if (pin.className.includes('slider-max')) {
                newLeft = data.mainMax - handleHeight / 2;
            }
        }
        return { newLeft, value };
    }
    reactOnClick(data, ori, type) {
        if (type == 'double') {
            return false;
        }
        const handle = this._elements._sliderHandles[0];
        const handleWidth = handle.offsetWidth;
        const pin = data.target.parentElement;
        const pinPointsValues = this.valueDivsArray;
        let newLeft;
        const { offset, widthOrHeight, direction, margin } = this.convertValues({
            mainAxis: 'x',
        });
        newLeft =
            pin.getBoundingClientRect()[direction] - data[margin] - handleWidth / 2;
        handle.style[direction] = newLeft + 'px';
        this._elements._sliderRange.style[widthOrHeight] = newLeft + 'px';
        this._elements._sliderTooltip[0].textContent = data.value;
        if (pinPointsValues.includes(data.value)) {
            for (const i of this.valueDivs) {
                const item = i;
                if (item.value == data.value) {
                    for (const i of this.valueDivs) {
                        const item = i;
                        item.div.style.color = '';
                    }
                    item.div.style.color = String(this._temp.pinTextColor);
                }
            }
        }
        return { newLeft, pin };
    }
    rangeInterval(orientation) {
        let offset;
        let widthOrHeight;
        let direction;
        if (orientation == 'horizontal') {
            offset = 'offsetLeft';
            widthOrHeight = 'width';
            direction = 'left';
        }
        else if (orientation == 'vertical') {
            offset = 'offsetTop';
            widthOrHeight = 'height';
            direction = 'top';
        }
        const minOffset = parseFloat(this._elements._sliderHandles[0].style[direction]);
        let maxOffset;
        if (this._elements._sliderHandles[1]) {
            maxOffset =
                parseFloat(this._elements._sliderHandles[1].style[direction]) || null; //only works if style.left is in pxs
        }
        else {
            maxOffset = null;
        }
        const length = Math.abs(minOffset - maxOffset);
        const handleOffset = Math.min(minOffset, maxOffset);
        this._elements._sliderRange.style[direction] = handleOffset + 'px';
        this._elements._sliderRange.style[widthOrHeight] =
            length + this._elements._sliderHandles[0].offsetWidth / 2 + 'px';
    }
    showValue(target, value) {
        const tool = target.getElementsByClassName('tooltip')[0];
        tool.textContent = Math.abs(value); //Math.abs is a hack and it shouldnt be there
    }
    matchHandleAndPin(main, ori) {
        let offset;
        const offsets = this.offsets;
        const offsetsNums = this.offsetsNums;
        if (ori == 'horizontal') {
            offset = 'offsetLeft';
        }
        else {
            offset = 'offsetTop';
        }
        let minDiff = Infinity;
        let pinOffset;
        for (const offset of offsetsNums) {
            const leastDiff = Math.abs(main - Number(offset));
            if (leastDiff < minDiff) {
                minDiff = leastDiff;
                pinOffset = Number(offset);
            }
        }
        let pin;
        for (const i of offsets) {
            const item = i;
            if (pinOffset == item.offset) {
                pin = item.div;
                return pin;
            }
        }
    }
    convertValues(valueObject) {
        for (const [key, value] of Object.entries(valueObject))
            if (key == 'orientation' || key == 'mainAxis') {
                let offset;
                let widthOrHeight;
                let direction;
                let margin;
                if (value == 'horizontal' || value == 'x') {
                    offset = 'offsetLeft';
                    widthOrHeight = 'width';
                    direction = 'left';
                    margin = 'marginLeft';
                }
                else if (value == 'vertical' || value == 'y') {
                    offset = 'offsetTop';
                    widthOrHeight = 'height';
                    direction = 'top';
                    margin = 'marginTop';
                }
                return { offset, widthOrHeight, direction, margin };
            }
    }
}
//shortens value to format  e.g.'1.3k'
function numberOfDigits(x) {
    let value;
    if (x.toString().length > 3) {
        value = (x / 1000).toFixed(1) + 'k';
    }
    else {
        value = x;
    }
    return value;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (View);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************!*\
  !*** ./ts-src/jquery.slider.ts ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./ts-src/app.ts");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./ts-src/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_1__);


$.fn.slider = function (options) {
    return this.each(function () {
        const app = new _app__WEBPACK_IMPORTED_MODULE_0__.default(this, options);
        $.fn.slider.tilt = () => {
            $(this).slider.destroy();
            app.tilt();
            $(this).slider.restore();
            return this;
        };
        $.fn.slider.scale = (option) => {
            app.scale(option);
            return this;
        };
        $.fn.slider.bar = (option) => {
            app.bar(option);
            return this;
        };
        $.fn.slider.tip = (option) => {
            app.tip(option);
            return this;
        };
        $.fn.slider.range = (option) => {
            app.range(option);
            return this;
        };
        $.fn.slider.setValue = (value, number) => {
            app.setValue(value, number);
            return this;
        };
        $.fn.slider.setLimits = (min, max) => {
            $(this).slider.destroy();
            app.setLimits(min, max);
            $(this).slider.restore();
            return this;
        };
        $.fn.slider.isRange = () => {
            return app.isRange();
        };
        $.fn.slider.setStep = (value) => {
            $(this).slider.destroy();
            app.setStep(value);
            return this;
        };
        $.fn.slider.noStick = (option) => {
            app.noStick(option);
            return this;
        };
        $.fn.slider.destroy = () => {
            $(this).html('');
            $(this).data('handle1', app.getValue(1));
            console.log(app._model._settings.type);
            if ($(this).slider.isRange()) {
                console.log('im range');
                $(this).data('handle2', app.getValue(2));
            }
        };
        $.fn.slider.restore = () => {
            if (Object.keys($(this).data()).length == 0) {
                return $(this);
            }
            else {
                $(this).slider.setValue($(this).data('handle1'), 1);
                if ($(this).slider.isRange()) {
                    console.log(app._model._settings.type);
                    $(this).slider.setValue($(this).data('handle2'), 2);
                }
            }
        };
    });
};
const data = {
    className: 'slider',
    orientation: 'horizontal',
    type: 'single',
    stepSize: 90,
    maxValue: 400,
    minValue: 0,
    toolTip: true,
    marker: true,
    progressBarColor: 'brown',
    sliderColor: 'red',
    sliderWidth: 5,
    sliderHeight: 200,
    pinTextColor: 'green',
    toolTextColor: 'red',
};
$('#slider').slider(data);

})();

/******/ })()
;
//# sourceMappingURL=plugin.js.map