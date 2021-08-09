import EventMixin from './eventemitter';

function divisionFloor(x: number, y: number): number {
  const result = Math.trunc(x / y);
  return result;
}
type Ori = 'horizontal' | 'vertical';
type Type = 'double' | 'single';
type Renew = {
  (data: ICoords): void | ICoords;
};
type IStyles = {
  progressBarColor: string;
  sliderColor: string;

  handleColor: string;
  sliderWidth: number;
  sliderHeight: number;
};
type Settings = {
  className: string;
  orientation: Ori;
  type: Type;
  stepSize: number;
  pxPerValue: number;
  valuePerPx: number;
  marginLeft: number;
  marginTop: number;
  maxValue: number;
  minValue: number;
  maxMinDifference: number;
  betweenMarkers: number;
  _maxPins: number;
  mainMax: number;
  mainMin: number;
  valueWidth: number;
  toolTip: boolean;
  altDrag: boolean;
  marker: boolean;
  built: boolean;
  styles: IStyles;
};

type ICoords = {
  main: number;
  prevMain: number;
  value: number;
  prevValue: number;
  caller: string;
  clicked: boolean;
  altDrag: boolean;
  target: object;
};

class Model extends EventMixin {
  private _slider: Element;

  private _sliderRange: Element;

  private _sliderHandle: Element;

  private _item: Element;

  private modifiable_options: Array<string> = [
    'width',
    'height',
    'color',
    'background-color',
  ];
  public interval: Map<HTMLDivElement, number> = new Map();
  public coords: ICoords = {
    main: 0,
    prevMain: 0,
    value: 1,
    prevValue: 0,
    caller: '',
    clicked: false,
    altDrag: false,
    target: null,
  };

  public _settings: Settings = {
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
    _maxPins: 5, // optimal maximum number of pins
    mainMax: 0,
    mainMin: 0,
    valueWidth: 0,
    toolTip: true,

    marker: true,

    altDrag: false,

    built: false,

    styles: {
      progressBarColor: 'green',
      sliderColor: 'red',
      handleColor: 'black',
      sliderWidth: 5,
      sliderHeight: 200,
    },
  };
  constructor(options, item) {
    super();
    this._item = item;
    this.initOptions(options);
  }

  public initOptions(options: { [key: string]: string | number }) {
    if (options) {
      Object.keys(options).forEach((key: string): void => {
        if (this.modifiable_options.includes(key)) {
          this._settings.styles[key] = options[key];
        } else {
          this._settings[key] = options[key];
        }
      });
    }

    this.coords.altDrag = this._settings.altDrag;
    this._settings.maxMinDifference =
      this._settings.maxValue - this._settings.minValue;
    const diff = this._settings.maxMinDifference;

    if (this._settings.orientation == 'horizontal') {
      if (this._settings.altDrag) {
        this._settings.valuePerPx = diff / this._settings.mainMax;
      }
    } else if (this._settings.orientation == 'vertical') {
      this._settings.valuePerPx = diff / this._settings.styles.sliderHeight;
    }
    this._settings.pxPerValue =
      this._settings.mainMax / (diff / this._settings.stepSize);

    this.validateOptions();
  }

  public validateOptions() {
    // fixing user's mistake in input/contradictions in input
    if (
      this._settings.orientation === 'vertical' &&
      this._settings.styles.sliderWidth > this._settings.styles.sliderHeight
    ) {
      [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
        [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
    } else if (
      this._settings.orientation == 'horizontal' &&
      this._settings.styles.sliderWidth < this._settings.styles.sliderHeight
    ) {
      [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
        [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
    }
  }

  private validate(data: ICoords) {
    //TODO dont mutate data
    const max = this._settings.mainMax;
    const min = this._settings.mainMin;
    const maxValue = this._settings.maxValue;
    const minValue = this._settings.minValue;
    if (data.main != max) {
      if (data.main >= max) {
        data.main = max;
        data.value = maxValue; // TODO figure out why we need this workaround,main mean does not work
      } else if (data.main <= min) {
        data.main = min;
        data.value = minValue;
      }
      return data;
    } else {
      return false;
    }
  }

  public renew(data: { [key: string]: number }, ori, type): ICoords {
    const valuePerPx = this._settings.valuePerPx;
    const pxPerValue = this._settings.pxPerValue;
    const stepSize = this._settings.stepSize;
    let axis = 0;
    let margin = 0;

    if (this._settings.orientation == 'vertical') {
      axis = data.y;
      margin = this._settings.marginTop;
    } else if (this._settings.orientation == 'horizontal') {
      axis = data.x;
      margin = this._settings.marginLeft;
    }
    this.coords.caller = 'model'; // TODO this shouldnt be here,have to think of a better way
    for (const i in data) {
      this.coords[i] = data[i];
    }

    if (data.clicked) {
      this.validate(this.coords);
      this.trigger('coords changed', this.coords);
    }
    if (this._settings.altDrag) {
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
  }

  public calcValue(target, offset) {
    let margin;
    if (this._settings.orientation == 'horizontal') {
      margin = 'marginLeft';
    } else if (this._settings.orientation == 'vertical') {
      margin = 'marginTop';
    }
    const value =
      divisionFloor(offset - this.coords[margin], this._settings.pxPerValue) *
      this._settings.stepSize;
    return {
      value: value,
      target: target,
    };
  }

  public calcMain(value, target: HTMLElement) {
    let nValue;
    if (value % this._settings.stepSize == 0) {
      nValue = value;
    } else {
      nValue =
        this._settings.stepSize * Math.trunc(value / this._settings.stepSize);
    }

    const main = (value * this._settings.pxPerValue) / this._settings.stepSize;
    this.coords.main = main;
    this.coords.value = nValue;
    this.coords.target = target;
    if (this.validate(this.coords)) {
      this.trigger('coords changed', this.coords);
      return;
    }
    return;
  }

  public setOptions(options: { [key: string]: string | number }) {
    this.initOptions(options);
  }

  public getStyles() {
    return this._settings.styles;
  }
  public getStyle(option: string) {
    return this._settings.styles[option];
  }

  public getSetting(option: string) {
    return this._settings[option];
  }

  public getSettings() {
    return this._settings;
  }

  public getItem() {
    return this._item;
  }
  public calcInterval(data): object {
    const interval = this.interval;

    interval.set(data.target, data.value);

    const value = Number(Array.from(interval.values())[0]);
    const value2 = Number(Array.from(interval.values())[1]);

    const floor = Math.min(value, value2);
    const ceil = Math.max(value, value2);

    return {
      floor,
      ceil,
    };
  }
}

export { ICoords, Settings, Type, Ori };
export default Model;
