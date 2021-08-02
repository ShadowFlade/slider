import EventMixin from './eventemitter';
import Model, { Settings } from './model';
import View from './view';
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

  position: string;

  built: boolean;

  constructor(model: Model, item: Element) {
    super();
    this._model = model;
    this._item = item;
    this.position = this._model._settings.position;
    this._model.on('settings changed', this.init);
  }

  public getView(view: View): void {
    this._view = view;

    view.on('settingsRequired', this.getSettings.bind(this));
  }

  public init(): void {
    const options = this.convertOptions(this._model.getOptions());
    const behavior = this._model.getSettings();
    const sliderObject = this._view.show(
      this.makeSlider(behavior),
      options,
      this._model._settings.position
    );
    const { slider, range, handles, wrapper } = sliderObject;
    this._slider = slider;
    this._sliderRange = range;
    this._sliderHandles = handles;
    this._sliderMain = wrapper;
    let mainMax: number;
    if (this._model.getSettings().position === 'horizontal') {
      mainMax =
        this._slider.offsetWidth - this._sliderHandles[0].offsetWidth / 2;
    } else {
      mainMax = this._slider.offsetHeight;
    }
    const marginLeft = this._slider.getBoundingClientRect().left;
    const marginTop = this._slider.getBoundingClientRect().top;
    this._model.setOptions({
      mainMax,
      marginLeft,
      marginTop,
    });

    this.built = true;
    this._model._settings.built = true;
  }

  public makeSlider(behavior: Settings): HTMLElement {
    let direction: string;
    let position: string;
    let widthOrHeight: number;
    if (behavior.position === 'horizontal') {
      widthOrHeight = this._model.getOptions().sliderWidth;
      position = 'horizontal';
      direction = 'left';
    } else {
      position = 'vertical';
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
    if (this.position === 'horizontal') {
      range.style.width = '0px';
      handle.style[direction] = '0px';
    } else if (this.position === 'vertical') {
      range.style.height = '0px';
      handle.style[direction] = '0px';
    }
    const tool = document.createElement('div');
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = `tooltipContainer tooltipContainer--${position}`;
    const tooltipStick = document.createElement('div');
    tooltipStick.className = `tooltipStick tooltipStick--${position}`;
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
    handle.classList.add(`slider-handle--${position}`);

    container.className = `slider-container slider-container--${position}`;
    tool.className = `tooltip tooltip--${position}`;

    if (behavior.type !== 'single') {
      const handleCLone: HTMLElement = handle.cloneNode(true) as HTMLElement;
      handleCLone.style[direction] = '20%';
      handle.after(range);
      range.after(handleCLone);
    }
    min.textContent = String(behavior.minValue);
    min.dataset.value = min.textContent;
    max.textContent = String(behavior.maxValue);
    max.dataset.value = max.textContent;

    if (behavior.marker) {
      marker = this.makeMarker(behavior, widthOrHeight);

      container.append(marker);

      min.classList.add(`slider-min--${position}`);
      max.classList.add(`slider-max--${position}`);
      main.classList.add(`slider-main--${position}`);
      marker.classList.add(`slider-marker--${position}`);
    }

    return main;
  }

  private makeMarker(behavior, widthOrHeight) {
    const position = this.position;
    let marginCss: string;
    if (position === 'horizontal') {
      marginCss = 'marginLeft';
    } else if (position === 'vertical') {
      marginCss = 'marginTop';
    }
    const markerDiv = document.createElement('div');
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
    const listOfValues = this.calcPins();
    let j = 0;
    for (let i = 0; i < majorMarkers; i += 1) {
      const majorMarker = document.createElement('div');
      markerDiv.append(majorMarker);
      const margin = (widthOrHeight / majorMarkers) * 0.0027 * widthOrHeight; // maybe will need to make new margin for altdrag m=math.trunc((v*ppv)/ss)
      const markerValue = document.createElement('label');
      markerValue.className = 'jsSlider-clickable marker-value';
      markerDiv.classList.add(`slider-marker--${position}`);
      majorMarker.classList.add(`marker--major--${position}`);

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
    return markerDiv;
  }

  private calcPins() {
    const diff = this._model._settings.maxMinDifference;
    const ss = this._model._settings.stepSize;
    const maxPins = this._model._settings._maxPins;
    const n = Math.trunc(diff / (ss * maxPins));

    const valueArr = [];
    for (let i = 1; i < diff / ss; i += n) {
      const value = ss * i;

      valueArr.push(value);
    }

    return valueArr;
  }

  convertOptions(options: object) {
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

  getSettings() {
    return this._model.getSettings();
  }
}

export default Pres;
