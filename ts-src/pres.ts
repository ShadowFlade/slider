import EventMixin from './eventemitter';
import Model, { Settings } from './model';
import View from './view';
import { Ori, Type } from './model';
import { checkForZero } from './utils';

type HandleNum = 1 | 2;

type Temp = {
  offset: string;
  offsetLength: string;
  widthOrHeight: string;
  direction: string;
  margin: string;
  client: string;
  pinTextColor?: string;
};
class Pres extends EventMixin {
  _item: Element;

  _model: Model;

  _view: View;

  temp: Temp;

  pxOptions: Array<string> = ['height', 'width'];

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
    this._model.validateOptions();

    const orientation = this._model.getSetting('orientation');
    this.temp = this.convertValues(orientation);

    this._model.temp = this.temp;
    this._view.temp = this.temp;
    const type = this._model.getSetting('type');
    let widthOrHeight;
    let direction;
    if (orientation == 'horizontal') {
      direction = 'left';
      widthOrHeight = this._model.getStyle('sliderWidth');
    } else if (orientation == 'vertical') {
      direction = 'top';
      widthOrHeight = this._model.getStyle('sliderHeight');
    }
    const options = this.convertOptions(this._model.getStyles());
    const behavior = this._model.getSettings();
    const { main: sliderMain, container, slider } = this.makeSlider(behavior);
    this._view.showSlider(sliderMain as Node, orientation as Ori);
    if (behavior.marker) {
      const marker = this.makeMarker(behavior, widthOrHeight);
      container.appendChild(marker);
    }
    this.fetchDivs();
    this._view.implementStyles(options, this._model._settings.orientation);
    this._model.setOptions(this._view.getVisuals(orientation));
    this._model._settings.built = true;
    this._view.rangeInterval(orientation);
  }

  public firstRefresh(ori: Ori, type: Type) {
    const { direction } = this.temp;
    let start1 = this._model._settings.startPos1;
    let start2 = this._model._settings.startPos2;
    let startValue1 = this._model._settings.startValue1;
    let startValue2 = this._model._settings.startValue2;
    const handle1 = this._view._elements._handles[0];
    const handle2 = this._view._elements._handles[1];
    if (startValue1 != 0 || startValue2 != 0) {
      this.setValue(startValue1, 1);
      this.setValue(startValue2, 2);

      return;
    }
    let start = start1 | start2;
    const coords = this._model.coords;
    coords.caller = 'model';
    this._view._elements._handles.forEach((item) => {
      coords.target = item;
      coords.main = start;
      coords.value = this._model.calcValue(
        item,
        item.getBoundingClientRect()[direction]
      ).value;
      this.transferData(coords, ori, type); //почему если здесь поставить this._view.refreshCoord, то будет ошибка maximum call stack exceeded
      start1 = undefined;
    });
  }

  public makeSlider(behavior: Settings): {
    main: Node;
    container: Node;
    slider: Node;
  } {
    const viewEls = this._view._elements;
    let direction: string;
    let orientation: string;
    let widthOrHeight: number;
    if (behavior.orientation === 'horizontal') {
      widthOrHeight = this._model.getStyle('sliderWidth');
      orientation = 'horizontal';
      direction = 'left';
    } else {
      orientation = 'vertical';
      widthOrHeight = this._model.getStyle('sliderHeight');
      direction = 'top';
    }
    let marker: HTMLDivElement;
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
    } else if (orientation === 'vertical') {
      range.style.height = '0px';
      handle.style[direction] = '0px';
    }
    const tool = document.createElement('div');
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = `tooltipContainer tooltipContainer--${orientation}`;
    const tooltipStick = document.createElement('div');
    tooltipStick.className = `tooltipStick tooltipStick--${orientation}`;
    tooltipContainer.append(tooltipStick);
    this._view._elements._tooltipsSticks.push(tooltipStick);
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
    // this._range = range;
    slider.appendChild(handle);
    handle.className = `slider-handle slider-handle--${orientation}`;
    // this._view._elements._handles = [];
    viewEls._handles.push(handle);
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

    return { main: main as Node, container, slider };
  }

  private makeMarker(behavior: Settings, widthOrHeight: number): HTMLElement {
    const orientation = this._model.getSetting('orientation');
    let marginCss: string;
    if (orientation === 'horizontal') {
      marginCss = 'marginLeft';
    } else if (orientation === 'vertical') {
      marginCss = 'marginTop';
    }
    const markerDiv = document.createElement('div');
    const { valuesForMarkers, majorMarkers, altDrag, margin } = this.calcPins(
      behavior,
      widthOrHeight
    );
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
          margin - this._view._elements._handles[0].offsetWidth / 2 + 'px';
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
    const viewEls = this._view._elements;
    this._model._settings.type = 'double';

    if (!handl) {
      handle = viewEls._handles[0];
      range = viewEls._range;
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
    handleCLone.style[direction] = '20px';
    const tooltipContainer = handleCLone.getElementsByClassName(
      'tooltipContainer'
    )[0] as HTMLElement;
    this._view._elements._tooltipContainers.push(tooltipContainer);
    handle.after(range);
    range.after(handleCLone);
    const stick = this._view.fetchHTMLEl(
      'tooltipStick',
      true,
      handleCLone
    ) as HTMLElement;
    viewEls._tooltipsSticks.push(stick);
    viewEls._handles.push(handleCLone);
    if (this._model._settings.built) {
      this._view.rangeInterval(this._model._settings.orientation);
      this.showValue(handleCLone);
    }
  }
  private showValue(handle) {
    let direction;
    if (this._model._settings.orientation == 'horizontal') {
      direction = 'left';
    } else if (this._model._settings.orientation == 'vertical') {
      direction = 'top';
    }
    const offset = handle.getBoundingClientRect()[direction];

    const { value, target } = this._model.calcValue(handle, offset);
    this._view.showValue(target, value);
  }
  public removeHandle() {
    const viewEls = this._view._elements;
    this._model._settings.type = 'single';
    const orient = this._model._settings.orientation;
    if (orient === 'horizontal') {
      viewEls._range.style.left = '0px';
    } else if (orient === 'vertical') {
      viewEls._range.style.top = '0px';
    }

    viewEls._handles[0].before(viewEls._range);
    viewEls._handles[1].remove();
    viewEls._handles = viewEls._handles.slice(0, 1);
    if (this._model._settings.built) {
      this._view.rangeInterval(this._model._settings.orientation);
    }
  }
  public fetchDivs() {
    const className = this._model._settings.className;
    const ori: Ori = this._model._settings.orientation;
    this._view.fetchDivs(ori, className);
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
    const n = checkForZero(Math.trunc(diff / (ss * majorMarkers))); //каждый n-ый элемент из возможныъ value будет помещен на scale

    const valuesForMarkers = [];
    for (let i = n; i < diff / ss; i += n) {
      const value = ss * i;
      valuesForMarkers.push(value);
    }
    const margin = (valuesForMarkers[0] / diff) * widthOrHeight;
    return { valuesForMarkers, majorMarkers, altDrag, margin };
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
      } else if (i.toString().includes('tool')) {
        let option = i.slice(4).toLowerCase();
        if (option == 'color') {
          option = 'background-color';
        } else if (option == 'textcolor') {
          option = 'color';
        }
        newOptions.tool[option] = options[i];
        if (this.pxOptions.includes(option)) {
          newOptions.tool[option] = `${options[i]}px`;
        } else {
          newOptions.tool[option] = options[i];
        }
      }
    }
    return newOptions;
  }

  public onMouseDown(): void {
    const handles = this._view._elements._handles;
    const container = this._view._elements._sliderContainer;
    const slider = this._view._elements._slider;
    const model = this._model;
    const marginLeft = slider.getBoundingClientRect().left; //TODO should take from model?
    const marginTop = slider.getBoundingClientRect().top;
    const ori = this._model._settings.orientation;
    const type = this._model._settings.type;
    let shiftX: number;
    this._model.on('coords changed', this.transferData.bind(this));
    for (const handle of handles) {
      handle.ondragstart = function () {
        return false;
      };
      handle.addEventListener('pointerdown', (event) => {
        event.preventDefault();

        const target = event.target as HTMLDivElement;
        const { direction, client } = this.temp;
        shiftX = event[client] - target.getBoundingClientRect()[direction];

        const mouseMove = (e) => {
          this.transferData(
            {
              y: e.clientY,
              x: e.clientX,
              shiftX: shiftX,
              marginLeft: marginLeft,
              clicked: false,
              marginTop: marginTop,
              target: event.target,
            },
            ori,
            type
          );
        };
        const onMouseUp = (e) => {
          document.removeEventListener('pointermove', mouseMove);
          document.removeEventListener('pointerup', onMouseUp);
        };
        document.addEventListener('pointermove', mouseMove);
        document.addEventListener('pointerup', onMouseUp);
      });
    }

    container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.className.includes('jsSlider-clickable')) {
        const value =
          (target.getElementsByClassName('marker-value')[0] as HTMLElement) ||
          target;
        this.transferData(
          {
            y: event.clientY,
            x: target.getBoundingClientRect().left,
            value: value.dataset.value,
            clicked: true,
            target: target,
            marginLeft: marginLeft,
            marginTop: marginTop,
          },
          ori,
          type
        );
      }
    });
    this.firstRefresh(ori, type);
  }

  private transferData(data, ori?: Ori, type?: Type) {
    const dataForTransfer = Object.assign({}, data);
    if (dataForTransfer.caller == 'model') {
      this._view.refreshCoords(dataForTransfer, ori, type);
      return;
    }
    this._model.renew(dataForTransfer, ori, type);
  }

  public setValue(value: number, target: HandleNum) {
    const viewEls = this._view._elements;
    let handle: HTMLElement;
    if (target == 1) {
      handle = viewEls._handles[0];
    } else if (target == 2) {
      if (this._model._settings.type == 'double') {
        handle = viewEls._handles[1];
      } else {
        throw new ReferenceError('Can not reference absent handle');
      }
    }
    this._model.calcMain(value, handle);
  }

  private convertValues(orientation: string) {
    let offset: string;
    let widthOrHeight: string;
    let direction: string;
    let margin: string;
    let client: string;
    let offsetLength: string;
    if (orientation == 'horizontal') {
      offset = 'offsetLeft';
      widthOrHeight = 'width';
      direction = 'left';
      margin = 'marginLeft';
      client = 'clientX';
      offsetLength = 'offsetWidth';
    } else if (orientation == 'vertical') {
      offset = 'offsetTop';
      widthOrHeight = 'height';
      direction = 'top';
      margin = 'marginTop';
      client = 'clientY';
      offsetLength = 'offsetHeight';
    }
    return { offset, offsetLength, widthOrHeight, direction, margin, client };
  }

  public getSettings() {
    return this._model.getSettings();
  }
}
export { Temp };
export default Pres;
