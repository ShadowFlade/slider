import EventMixin from './eventemitter';
import { Model, has, Settings } from './model';
import View from './view';
import PresBuilder from './presBuilder';
import { Ori, Type } from './model';

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
  type?: Type;
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
    const orientation = this._model.getSetting('orientation') as Ori;
    this.temp = this.determineMetrics(orientation);
    this.temp.ori = this._model._settings.orientation;
    this.temp.type = this._model._settings.type;
    this._model.temp = this.temp;
    this._view.temp = this.temp;
    let widthOrHeight: number;
    if (orientation === 'horizontal') {
      widthOrHeight = Number(this._model.getStyle('sliderWidth'));
    } else if (orientation === 'vertical') {
      widthOrHeight = Number(this._model.getStyle('sliderHeight'));
    }
    const options = this.convertOptions(this._model.getStyles());
    const behavior = this._model.getSettings();
    const { main, container } = this.builder.makeSlider(behavior);
    this._view.renderElement(main);
    if (behavior.marker) {
      const marker = this.builder.makeMarker(behavior, widthOrHeight);
      container.appendChild(marker);
    }
    this.fetchDivs();
    this._view.implementStyles(options);
    this._model.setOptions(this._view.getOffsetsAndLimits());
    this._model.setOption('built', true);
    this._view.rangeInterval();
  }

  public firstRefresh(): void {
    const { direction, ori, type } = this.temp;
    let start1 = this._model._settings.startPosLeftHandle;
    const start2 = this._model._settings.startPosRightHandle;
    const startValue1 = this._model._settings.startValueLeftHandle;
    const startValue2 = this._model._settings.startValueRightHandle;
    if (startValue1 !== 0 || startValue2 !== 0) {
      this.setValue(startValue1, 1);
      if (type === 'double') {
        this.setValue(startValue2, 2);
      }
      return;
    }
    const start = start1 || start2;
    const coords = this._model.coords;
    coords.caller = 'model';
    this._view._elements._handles.forEach((item) => {
      coords.target = item;
      coords.main = start;
      coords.value = this._model.calcValue(
        item,
        item.getBoundingClientRect()[direction]
      ).value;
      this.transferData(coords, ori, type);
      start1 = undefined;
    });
  }

  public showValue(handle: HTMLElement): void {
    const { direction } = this.temp;
    const offset = handle.getBoundingClientRect()[direction];
    const { value, target } = this._model.calcValue(handle, offset);
    this._view.showValue(target, value);
  }

  public fetchDivs(): void {
    const className = this._model._settings.className;
    const ori: Ori = this._model._settings.orientation;
    this._view.fetchDivs(ori, className);
  }

  private convertOptions(options: Record<string, unknown>) {
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
    Object.keys(options).forEach((i) => {
      if (i.toString().includes('slider')) {
        let option = i.slice(6).toLowerCase();
        if (option === 'color') {
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
        if (option === 'color') {
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
        if (option === 'color') {
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
        if (option === 'color') {
          option = 'background-color';
        } else if (option === 'textcolor') {
          option = 'color';
        }
        newOptions.tool[option] = options[i];
        if (this.pxOptions.includes(option)) {
          newOptions.tool[option] = `${options[i]}px`;
        } else {
          newOptions.tool[option] = options[i];
        }
      }
    });
    return newOptions;
  }

  public onMouseDown(): void {
    const handles = this._view._elements._handles;
    const container = this._view._elements._sliderContainer;
    this._model.on('coords changed', this.transferData.bind(this));
    this._model.on('settings changed', this.renewTemp.bind(this));
    handles.forEach((handle) => {
      handle.ondragstart = () => {
        return false;
      };
      handle.addEventListener('pointerdown', this.onPointerDown.bind(this));
    });
    container.addEventListener('click', this.handleContainerClick.bind(this));
  }

  private onPointerDown(event) {
    if (
      event.target === this._view._elements._handles[0] ||
      event.target === this._view._elements._handles[1]
    ) {
      const slider = this._view._elements._slider;
      const marginLeft = slider.getBoundingClientRect().left;
      const marginTop = slider.getBoundingClientRect().top;
      const ori = this._model._settings.orientation;
      const type = this._model._settings.type;
      event.preventDefault();
      const target = event.target;
      const { direction, client } = this.temp;
      const shift = event[client] - target.getBoundingClientRect()[direction];

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
      const onMouseUp = () => {
        document.removeEventListener('pointermove', mouseMove);
        document.removeEventListener('pointerup', onMouseUp);
      };
      document.addEventListener('pointermove', mouseMove);
      document.addEventListener('pointerup', onMouseUp);
    }
  }

  private handleContainerClick(event) {
    const slider = this._view._elements._slider;
    const marginLeft = slider.getBoundingClientRect().left;
    const marginTop = slider.getBoundingClientRect().top;
    const ori = this._model._settings.orientation;
    const type = this._model._settings.type;
    const target = event.target;
    if (target.className.includes('js-slider-clickable')) {
      const value =
        target.getElementsByClassName('js-marker__value')[0] || target;
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
  }

  private transferData(data, ori?: Ori, type?: Type): void {
    const dataForTransfer = { ...data };
    if (dataForTransfer.caller === 'model') {
      this._view.refreshCoords(dataForTransfer, ori, type);
      return;
    }
    this._model.renew(dataForTransfer, ori, type);
  }

  public setValue(value: number, target: HandleNum): void {
    const viewEls = this._view._elements;
    let handle: HTMLElement;
    if (Number(target) === 1) {
      handle = viewEls._handles[0];
    } else if (Number(target) === 2) {
      if (this.temp.type === 'double') {
        handle = viewEls._handles[1];
      } else {
        throw new ReferenceError('Can not reference absent handle');
      }
    }
    const coords = this._model.calcMain(value, handle);
    this.transferData(coords, this.temp.ori, this.temp.type);
  }

  private determineMetrics(orientation: Ori) {
    let offset: string;
    let widthOrHeight: string;
    let direction: string;
    let margin: string;
    let client: string;
    let offsetLength: string;
    if (orientation === 'horizontal') {
      offset = 'offsetLeft';
      widthOrHeight = 'width';
      direction = 'left';
      margin = 'marginLeft';
      client = 'clientX';
      offsetLength = 'offsetWidth';
    } else if (orientation === 'vertical') {
      offset = 'offsetTop';
      widthOrHeight = 'height';
      direction = 'top';
      margin = 'marginTop';
      client = 'clientY';
      offsetLength = 'offsetHeight';
    }
    return { offset, offsetLength, widthOrHeight, direction, margin, client };
  }

  public getSettings(): Settings {
    return this._model.getSettings();
  }

  private renewTemp(): void {
    Object.keys(this.temp).forEach((key) => {
      if (has.call(this._model._settings, key)) {
        this.temp[key] = this._model._settings[key];
      }
    });
  }
}

export { Temp, Pres };
