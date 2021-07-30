import { map } from 'jquery';
import EventMixin from './eventemitter';
function divisionFloor(x, y) {
  const result = Math.trunc(x / y);

  return result;
}

const map1 = new Map();
map1.set(1, 'true');

// interface Map<T> {
//   add(value: T): Set<T>;
//   clear(): void;
//   delete(value: T): boolean;
//   entries(): IterableIterator<[T, T]>;
//   forEach(
//     callbackfn: (value: T, index: T, set: Set<T>) => void,
//     thisArg?: any
//   ): void;
//   has(value: T): boolean;
//   keys(): IterableIterator<T>;
//   size: number;
//   values(): IterableIterator<T>;
//   [Symbol.iterator](): IterableIterator<T>;
//   [Symbol.toStringTag]: string;
// }

// interface SetConstructor {
//   new <T>(): Set<T>;
//   new <T>(iterable: Iterable<T>): Set<T>;
//   prototype: Set<any>;
// }
// interface Interval extends Set<> {
//   target1: HTMLDivElement;
//   target2: HTMLDivElement;
//   value1: number;
//   value2: number;
// }
// declare var Set: SetConstructor;
interface IStyles {
  progressBarColor: string;
  sliderColor: string;

  handleColor: string;
  sliderWidth: number;
  sliderHeight: number;
}
interface Settings {
  className: string;
  type: string;
  position: string;
  stepSize: number;
  pxPerValue: number;
  marginLeft: number;
  marginTop: number;
  maxValue: number;
  minValue: number;
  maxMinDifference: number;
  betweenMarkers: number;
  _maxPins: number;
  mainMax: number;
  toolTip: boolean;
  altDrag: boolean;
  marker: boolean;
  built: boolean;
  styles: IStyles;
}

interface ICoords {
  marginTop: number;
  mainAxis: string;
  main: number;
  prevMain: number;
  mainMin: number;
  mainMax: number;
  stepSize: number;
  value: number;
  prevValue: number;
  caller: string;
  valuePerPx: number;
  pxPerValue: number;
  maxValue: number;
  minValue: number;
  marginLeft: number;
  valueWidth: number;
  clicked: boolean;

  altDrag: boolean;
  target: object;
}

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
    mainAxis: 'x',
    main: 0,
    prevMain: 0,
    mainMin: 0,
    mainMax: 0,
    altDrag: false,
    stepSize: 0,
    value: 1,
    prevValue: 0,
    caller: '',
    maxValue: 0,
    minValue: 0,
    valuePerPx: 1,
    valueWidth: 0,
    marginLeft: 0,
    marginTop: 0,
    clicked: false,
    pxPerValue: 0,
    target: null,
  };

  public _settings: Settings = {
    className: 'slider',
    position: 'horizontal',
    type: 'double',
    stepSize: 90,
    toolTip: true,
    maxValue: 1360,
    minValue: 0,
    maxMinDifference: 0,
    _maxPins: 5, // optimal minimal number of pins
    marker: true,
    betweenMarkers: 40,
    mainMax: 0,
    altDrag: false,
    pxPerValue: 0,
    marginLeft: 0,
    marginTop: 0,
    built: false,
    styles: {
      progressBarColor: 'green',
      sliderColor: 'red',
      handleColor: 'black',
      sliderWidth: 5,
      sliderHeight: 200,
    },
  };

  public initOptions(options: { [key: string]: string | number }) {
    Object.keys(options).forEach((key: string): void => {
      if (this.modifiable_options.includes(key)) {
        this._settings.styles[key] = options[key];
      } else {
        this._settings[key] = options[key];
      }
    });
    this.coords.altDrag = this._settings.altDrag;
    this._settings.maxMinDifference =
      this._settings.maxValue - this._settings.minValue;
    const diff = this._settings.maxMinDifference;
    this.coords.stepSize = this._settings.stepSize;
    this.coords.maxValue = this._settings.maxValue;
    this.coords.minValue = this._settings.minValue;
    this.coords.marginLeft = this._settings.marginLeft;
    this.coords.marginTop = this._settings.marginTop;

    if (this._settings.position == 'horizontal') {
      this.coords.mainMax = this._settings.mainMax;
      this.coords.mainAxis = 'x';
      if (this._settings.altDrag) {
        this.coords.valuePerPx = diff / this._settings.mainMax;
      }
    } else if (this._settings.position == 'vertical') {
      this.coords.mainAxis = 'y';
      this.coords.valuePerPx = diff / this._settings.styles.sliderHeight;
      this.coords.mainMax = this._settings.styles.sliderHeight;
    }
    this.coords.pxPerValue =
      this._settings.mainMax / (diff / this.coords.stepSize);
    this.validateOptions();
  }

  private validateOptions() {
    // fixing user's mistake in input/contradictions in input
    if (
      this._settings.position === 'vertical' &&
      this._settings.styles.sliderWidth > this._settings.styles.sliderHeight
    ) {
      [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
        [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
    } else if (
      this._settings.position == 'horizontal' &&
      this._settings.styles.sliderWidth < this._settings.styles.sliderHeight
    ) {
      [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
        [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
    }
  }

  private validate(data) {
    if (data.main >= data.mainMax) {
      data.main = data.mainMax;
      data.value = data.maxValue; // TODO figure out why we need this workaround,main mean does not work
    } else if (data.main <= data.mainMin) {
      data.main = data.mainMin;
      data.value = data.minValue;
    }
    if (data.main != data.prevMain) {
      return data;
    }
    return false;
  }

  public renew(data) {
    const valuePerPx = this.coords.valuePerPx;
    const pxPerValue = this.coords.pxPerValue;
    const stepSize = this.coords.stepSize;
    let axis = 0;
    let margin = 0;

    if (this._settings.position == 'vertical') {
      axis = data.y;
      margin = this.coords.marginTop;
    } else if (this._settings.position == 'horizontal') {
      axis = data.x;
      margin = this.coords.marginLeft;
    }
    this.coords.caller = 'model'; // TODO this shouldnt be here,have to think of a better way
    for (const i in data) {
      this.coords[i] = data[i];
    }

    if (data.clicked) {
      this.validate(this.coords);
      this.trigger('coords changed', this.coords);
      return this.coords;
    }
    if (this._settings.altDrag) {
      this.coords.main = axis - margin;
      this.coords.value =
        divisionFloor(this.coords.main, pxPerValue) * this.coords.stepSize;

      const validatedCoords = this.validate(this.coords);
      this.coords.prevMain = this.coords.main;
      if (this._settings.type == 'double') {
        setTimeout(this.calcInterval.bind(this), 0, validatedCoords);
      }
      if (validatedCoords) {
        this.trigger('coords changed', validatedCoords);
        return validatedCoords;
      }
    }
  }

  constructor(options, item) {
    super();
    this._item = item;
    this.initOptions(options);
  }

  public getOption(option: string) {
    return this._settings.styles[option];
  }

  public setOptions(options: { [key: string]: string | number }) {
    this.initOptions(options);
    if (this._settings.built) {
      this.trigger('settings changed');
    }
  }

  public getOptions() {
    return this._settings.styles;
  }

  public getSettings() {
    return this._settings;
  }

  public getItem() {
    return this._item;
  }
  public calcInterval(data): object {
    const target = data.target;
    const value = data.value;
    const interval = this.interval;

    interval.set(data.target, data.value);
    return this.interval;
  }
}

export { ICoords, Settings };
export default Model;
