import EventMixin from './eventemitter';
import Model, { Settings } from './model';
import View from './view';
import { Ori } from './view';
function elemsDiff(arr: number[]) {
  let res = [];
  for (let i = 0; i < arr.length - 1; i += 1) {
    const value1 = +arr[i + 1];
    const value2 = +arr[i];
    const result = value1 - value2;
    res.push(result);
  }

  return res;
}
type HandleNum = 1 | 2;

class Pres extends EventMixin {
  _item: Element;

  _slider: HTMLElement;

  _sliderContainer: HTMLElement;

  _sliderRange: HTMLElement;

  _sliderMain: HTMLElement;

  _sliderHandles: HTMLElement[];

  _model: Model;

  _view: View;

  pxOptions: Array<string> = ['height', 'width'];

  orientation: string;

  built: boolean;

  constructor(model: Model, item: Element) {
    super();
    this._model = model;
    this._item = item;
    this._model.on('settings changed', this.init.bind(this));
  }

  public getView(view: View): void {
    this._view = view;

    view.on('settingsRequired', this.getSettings.bind(this));
  }

  public init(): void {
    this.orientation = this._model._settings.orientation;
    let widthOrHeight;
    if (this.orientation == 'horizontal') {
      widthOrHeight = this._model.getOptions().sliderWidth;
    } else if (this.orientation == 'vertical') {
      widthOrHeight = this._model.getOptions().sliderHeight;
    }
    this._model.validateOptions();
    const options = this.convertOptions(this._model.getOptions());
    const behavior = this._model.getSettings();

    const { main: sliderMain, container } = this.makeSlider(behavior);
    this._slider = sliderMain;
    const { marginLeft, marginTop, handles, offsetWidth, offsetHeight } =
      this._view.showSlider(sliderMain, this.orientation as Ori);
    this._sliderHandles = handles as HTMLElement[];
    let mainMax: number;
    let mainMin: number;
    mainMax = offsetWidth - this._sliderHandles[0].offsetWidth / 2;
    mainMin = this._sliderHandles[0].offsetWidth / 2;

    this._model.setOptions({
      mainMax,
      marginLeft,
      marginTop,
      mainMin,
    });
    if (behavior.marker) {
      const marker = this.makeMarker(behavior, widthOrHeight);
      container.append(marker);
    }

    this._view.show(options, this._model._settings.orientation);

    this.built = true;
    this._model._settings.built = true;
  }

  public makeSlider(behavior: Settings): {
    main: HTMLElement;
    container: HTMLElement;
  } {
    let direction: string;
    let orientation: string;
    let widthOrHeight: number;
    if (behavior.orientation === 'horizontal') {
      widthOrHeight = this._model.getOptions().sliderWidth;
      orientation = 'horizontal';
      direction = 'left';
    } else {
      orientation = 'vertical';
      widthOrHeight = this._model.getOptions().sliderHeight;
      direction = 'top';
    }
    let marker: HTMLDivElement;
    const main = document.createElement('div');
    main.classList.add('slider-main');
    const container = document.createElement('div');
    this._sliderContainer = container;
    const slider = document.createElement('div');
    slider.classList.add('slider');
    const range = document.createElement('div');
    range.classList.add('slider-range');

    const handle = document.createElement('div');
    if (this.orientation === 'horizontal') {
      range.style.width = '0px';
      handle.style[direction] = '0px';
    } else if (this.orientation === 'vertical') {
      range.style.height = '0px';
      handle.style[direction] = '0px';
    }
    const tool = document.createElement('div');
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = `tooltipContainer tooltipContainer--${orientation}`;
    const tooltipStick = document.createElement('div');
    tooltipStick.className = `tooltipStick tooltipStick--${orientation}`;
    tooltipContainer.append(tooltipStick);
    tooltipContainer.append(tool);

    handle.append(tooltipContainer);
    const min = document.createElement('span');
    min.className = 'values jsSlider-clickable';
    const max = document.createElement('span');
    max.className = ' values jsSlider-clickable';
    main.append(min);
    container.append(slider);
    main.append(container);
    main.append(max);
    slider.appendChild(range);
    slider.appendChild(handle);
    handle.className = `slider-handle slider-handle--${orientation}`;

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

    return { main, container };
  }

  private makeMarker(behavior, widthOrHeight) {
    const orientation = this.orientation;
    let marginCss: string;
    if (orientation === 'horizontal') {
      marginCss = 'marginLeft';
    } else if (orientation === 'vertical') {
      marginCss = 'marginTop';
    }
    const markerDiv = document.createElement('div');

    const { valueArr, majorMarkers, altDrag, margin } = this.calcPins(
      behavior,
      widthOrHeight
    );
    const listOfValues = valueArr;
    let j = 0;
    for (let i = 0; i < majorMarkers; i += 1) {
      const majorMarker = document.createElement('div');
      markerDiv.append(majorMarker);
      //  margin = (widthOrHeight / majorMarkers) * 0.0027 * widthOrHeight; // maybe will need to make new margin for altdrag m=math.trunc((v*ppv)/ss)
      const markerValue = document.createElement('label');
      markerValue.className = 'jsSlider-clickable marker-value';
      markerDiv.classList.add(`slider-marker--${orientation}`);
      majorMarker.classList.add(`marker--major--${orientation}`);

      if (i === 0) {
        majorMarker.style[marginCss] = '0';
      } else {
        majorMarker.style[marginCss] = margin + 'px';
      }

      if (!altDrag) {
        const value = behavior.stepSize * (i + 1);
        majorMarker.dataset.value = value.toString();
        markerValue.dataset.value = value.toString();
        markerValue.textContent = value.toString();
        majorMarker.append(markerValue);
      } else {
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

  public addHandle(handl?, rang?, directio?) {
    let handle;
    let range;
    let direction;
    if (!handl) {
      handle = this._sliderHandles[0];
      range = this._sliderRange;
    } else {
      handle = handl;
      range = rang;
      direction = directio;
    }

    const behavior = this._model.getSettings();
    if (behavior.orientation === 'horizontal') {
      direction = 'left';
    } else {
      direction = 'top';
    }
    const handleCLone: HTMLElement = handle.cloneNode(true) as HTMLElement;
    handleCLone.style[direction] = '20%';
    handle.after(range);
    range.after(handleCLone);
    if (this._sliderHandles) {
      this._sliderHandles[1] = handleCLone;
    }
  }
  public removeHandle() {
    this._model._settings.type = 'single';
    const orient = this._model._settings.orientation;
    if (orient === 'horizontal') {
      this._sliderRange.style.left = '0px';
    } else if (orient === 'vertical') {
      this._sliderRange.style.top = '0px';
    }

    this._slider.insertAdjacentElement('afterbegin', this._sliderRange);
    this._sliderHandles[1].remove();
  }

  private calcPins(behavior, widthOrHeight) {
    let altDrag;
    let majorMarkers = Math.trunc(
      (behavior.maxValue - behavior.minValue) / behavior.stepSize
    );
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
    const n = Math.trunc(diff / (ss * maxPins)); //каждый n-ый элемент valueArr будет помещен на scale
    const valueArr = [];
    for (let i = 1; i < diff / ss; i += n) {
      const value = ss * i;
      valueArr.push(value);
    }
    const valueObj = {};
    valueArr.forEach((value) => {
      let x = Math.trunc(
        (value * this._model.coords.pxPerValue) / this._model.coords.stepSize
      );
      valueObj[String(valueArr.indexOf(value))] = {
        value: value,
        assumputedMain: x,
      };
    });
    const mains = [];
    Object.keys(valueObj).forEach((key) => {
      mains.push(valueObj[key].assumputedMain);
    });
    let mainsDiff = elemsDiff(mains);
    const sumOfDiff = mainsDiff.reduce((acc, value) => {
      return acc + value;
    });
    const avg = Number(sumOfDiff) / mainsDiff.length;
    const margin = avg;

    return { valueArr, majorMarkers, altDrag, margin };
  }

  private convertOptions(options: object) {
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
        } else {
          newOptions.slider[option] = options[i];
        }
      } else if (i.toString().includes('progressBar')) {
        let option = i.slice(11).toLowerCase();
        if (option == 'color') {
          option = 'background-color';
        }
        newOptions.progressBar[option] = options[i];
        if (this.pxOptions.includes(option)) {
          newOptions.progressBar[option] = `${options[i]}px`;
        } else {
          newOptions.progressBar[option] = options[i];
        }
      } else if (i.toString().includes('handle')) {
        let option = i.slice(6).toLowerCase();
        if (option == 'color') {
          option = 'background-color';
        }
        newOptions.handle[option] = options[i];
        if (this.pxOptions.includes(option)) {
          newOptions.handle[option] = `${options[i]}px`;
        } else {
          newOptions.handle[option] = options[i];
        }
      }
    }
    return newOptions;
  }

  public onMouseDown(): void {
    const handles = this._sliderHandles;

    const container = this._sliderContainer;
    const slider = this._slider;
    const model = this._model;
    const marginLeft = slider.getBoundingClientRect().left;
    const marginTop = slider.getBoundingClientRect().top;
    model.on('coords changed', this.transferData.bind(this));
    for (const handle of handles) {
      handle.ondragstart = function () {
        return false;
      };
      handle.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        const target = event.target as HTMLDivElement;
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
            });
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
      const target = event.target as HTMLElement;
      if (target.className.includes('jsSlider-clickable')) {
        const value =
          (target.getElementsByClassName('marker-value')[0] as HTMLElement) ||
          target;
        this.transferData({
          y: event.clientY,
          x: target.getBoundingClientRect().left,

          value: value.dataset.value,
          clicked: true,
          target: target,
          marginLeft: marginLeft,
          marginTop: marginTop,
        });
      }
    });
  }

  private transferData(data) {
    if (data.caller == 'model') {
      this._view.refreshCoords(data);
      return;
    }
    this._model.renew(data);
  }

  public setValue(value: number, target: HandleNum) {
    let handle: HTMLElement;
    if (target == 1) {
      handle = this._sliderHandles[0];
    } else if (target == 2) {
      if (this._model._settings.type == 'double') {
        handle = this._sliderHandles[1];
      } else {
        throw new ReferenceError('Can not reference absent handle');
      }
    }

    this._model.calcMain(value, handle);
  }

  getSettings() {
    return this._model.getSettings();
  }
}

export default Pres;
