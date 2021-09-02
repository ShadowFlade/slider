import EventMixin from './eventemitter';
import { Model, Settings, has } from './model';
import View from './view';
import PresBuilder from './presBuilder';
import { Ori, Type } from './model';
import { checkForZero } from './utils';
import { hasData } from 'jquery';

type HandleNum = 1 | 2;

type Temp = {
  offset: string;
  offsetLength: string;
  widthOrHeight: string;
  direction: string;
  margin: string;
  client: string;
  pinTextColor?: string;
  ori?: Ori;
  type?: Type; //TODO how to tell ts that there will be those paramteters later?
};
class Pres extends EventMixin {
  _item: Element;

  _model: Model;

  _view: View;

  temp: Temp;

  builder: PresBuilder;

  pxOptions: Array<string> = ['height', 'width'];

  constructor(model: Model, item: Element) {
    super();
    this._model = model;
    this._item = item;
  }

  public getView(view: View): void {
    this._view = view;
  }

  public init(): void {
    this._model.validateOptions();

    const orientation = this._model.getSetting('orientation');
    this.temp = this.determineMetrics(orientation);
    this.temp.ori = this._model._settings.orientation;
    this.temp.type = this._model._settings.type;
    this._model.temp = this.temp;
    this._view.temp = this.temp;
    let widthOrHeight: number;
    if (orientation == 'horizontal') {
      widthOrHeight = this._model.getStyle('sliderWidth');
    } else if (orientation == 'vertical') {
      widthOrHeight = this._model.getStyle('sliderHeight');
    }
    const options = this.convertOptions(this._model.getStyles());
    const behavior = this._model.getSettings();
    const { main, container, slider } = this.builder.makeSlider(behavior);
    this._view.renderElement(main);
    if (behavior.marker) {
      const marker = this.builder.makeMarker(behavior, widthOrHeight);
      container.appendChild(marker);
    }
    this.fetchDivs();
    this._view.implementStyles(options, this._model._settings.orientation);
    this._model.setOptions(this._view.getOffsetsAndLimits(orientation));
    this._model.setOption('built', true);
    this._view.rangeInterval(orientation);
  }

  public firstRefresh() {
    const { direction, ori, type } = this.temp;
    let start1 = this._model._settings.startPos1;
    let start2 = this._model._settings.startPos2;
    let startValue1 = this._model._settings.startValue1;
    let startValue2 = this._model._settings.startValue2;
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

  public showValue(handle) {
    const { direction } = this.temp;
    const offset = handle.getBoundingClientRect()[direction];
    const { value, target } = this._model.calcValue(handle, offset);
    this._view.showValue(target, value);
  }

  public fetchDivs() {
    const className = this._model._settings.className;
    const ori: Ori = this._model._settings.orientation;
    this._view.fetchDivs(ori, className);
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
    let ori: Ori;
    let type: Type;
    let shift: number;
    this._model.on('coords changed', this.transferData.bind(this));
    this._model.on('settings changed', this.renewTemp.bind(this));

    for (const handle of handles) {
      handle.ondragstart = function () {
        return false;
      };
      handle.addEventListener('pointerdown', (event) => {
        ori = this._model._settings.orientation;
        type = this._model._settings.type;
        event.preventDefault();

        const target = event.target as HTMLDivElement;
        const { direction, client } = this.temp;
        shift = event[client] - target.getBoundingClientRect()[direction];

        const mouseMove = (e) => {
          this.transferData(
            {
              y: e.clientY,
              x: e.clientX,
              shift: shift,
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
      ori = this._model._settings.orientation;
      type = this._model._settings.type;
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
  }

  private transferData(data, ori?: Ori, type?: Type) {
    const dataForTransfer = { ...data };
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
      if ((this.temp.type = 'double')) {
        handle = viewEls._handles[1];
      } else {
        throw new ReferenceError('Can not reference absent handle');
      }
    }
    this._model.calcMain(value, handle);
  }

  private determineMetrics(orientation: string) {
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

  private renewTemp() {
    Object.keys(this.temp).forEach((key) => {
      if (has.call(this._model._settings, key)) {
        this.temp[key] = this._model._settings[key];
      }
    });
  }
}

export { Temp, Pres };
