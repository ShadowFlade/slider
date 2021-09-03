import EventMixin from './eventemitter';
import { Temp } from './pres';

const has = Object.prototype.hasOwnProperty;

function divisionFloor(x: number, y: number): number {
  const result = Math.trunc(x / y);
  return result;
}
type Ori = 'horizontal' | 'vertical';
type Type = 'double' | 'single';

type IStyles = {
  progressBarColor: string;
  sliderColor: string;
  handleColor: string;
  sliderWidth: number;
  sliderHeight: number;
  toolTextColor: string;
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
  _minPins: number;
  mainMax: number;
  mainMin: number;
  startPos1: number;
  startPos2: number;
  startValue1: number;
  startValue2: number;
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
  mainMax: number;
  value: number;
  prevValue: number;
  caller: string;
  clicked: boolean;
  altDrag: boolean;
  target: HTMLDivElement;
};

class Model extends EventMixin {
  private _slider: Element;

  private _range: Element;

  private _sliderHandle: Element;

  private _item: Element;

  public interval: Map<HTMLDivElement, number> = new Map();

  public coords: ICoords = {
    main: 0,
    prevMain: 0,
    value: 1,
    prevValue: 0,
    caller: '',
    clicked: false,
    altDrag: true,
    target: null,
    mainMax: 0,
  };

  public temp: Partial<Temp> = {};

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
    _minPins: 5, // optimal maximum number of pins
    mainMax: 200,
    mainMin: 0,
    startPos1: 0,
    startPos2: 100,
    startValue1: 810,
    startValue2: 0,
    valueWidth: 0,
    toolTip: true,
    marker: true,
    altDrag: false,
    built: false,
    styles: {
      progressBarColor: 'green',
      sliderColor: 'red',
      handleColor: '',
      sliderWidth: 200,
      sliderHeight: 5,
      toolTextColor: 'green',
    },
  };

  constructor(options: Record<string, unknown>, item: HTMLElement) {
    super();
    this._item = item;
    this.initOptions(options);
  }

  public initOptions(options: Record<string, unknown> = {}): void {
    Object.keys(options).forEach((key: string): void => {
      if (this._settings.styles.hasOwnProperty(key)) {
        this._settings.styles[key] = options[key];
      } else if (this.temp.hasOwnProperty(key)) {
        this.temp[key] = options[key];
      } else {
        this._settings[key] = options[key];
      }
    });

    this.correctOptions();
  }

  private correctOptions() {
    this.coords.altDrag = this._settings.altDrag;
    this.coords.mainMax = this._settings.mainMax;
    this._settings.maxMinDifference =
      this._settings.maxValue - this._settings.minValue;
    const diff = this._settings.maxMinDifference;

    if (this._settings.orientation === 'horizontal') {
      this._settings.valuePerPx = diff / this._settings.mainMax;
    } else if (this._settings.orientation === 'vertical') {
      this._settings.valuePerPx = diff / this._settings.styles.sliderHeight;
    }
    this._settings.pxPerValue =
      this._settings.mainMax / (diff / this._settings.stepSize);

    this.validateOptions();
  }

  public validateOptions(): void {
    // fixing user's mistake in input/contradictions in input
    if (
      this._settings.orientation === 'vertical' &&
      this._settings.styles.sliderWidth > this._settings.styles.sliderHeight
    ) {
      [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
        [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
    } else if (
      this._settings.orientation === 'horizontal' &&
      this._settings.styles.sliderWidth < this._settings.styles.sliderHeight
    ) {
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

  private validate(data: ICoords) {
    const dataFroValidation = { ...data };
    const max = this._settings.mainMax;
    const min = this._settings.mainMin;
    const maxValue = this._settings.maxValue;
    const minValue = this._settings.minValue;
    if (dataFroValidation.main >= max) {
      dataFroValidation.main = max;
      dataFroValidation.value = maxValue; // TODO figure out why we need this workaround,main mean does not work
    } else if (dataFroValidation.main <= min) {
      dataFroValidation.main = min;
      dataFroValidation.value = minValue;
    }

    return dataFroValidation;
  }

  public renew(
    data: { [key: string]: number },
    ori: Ori,
    type: Type
  ): ICoords | false {
    const pxPerValue = this._settings.pxPerValue;

    let axis = 0;
    let margin = 0;

    if (this._settings.orientation === 'vertical') {
      axis = data.y;
      margin = data.marginTop; // if it was mode.settings.marginTop it would be wrong
    } else if (this._settings.orientation === 'horizontal') {
      axis = data.x;
      margin = this._settings.marginLeft;
    }
    this.coords.caller = 'model'; // TODO this shouldnt be here,have to think of a better way
    Object.keys(data).forEach((i) => {
      this.coords[i] = data[i];
    });

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
    return false;
  }

  public calcValue(
    target: HTMLDivElement,
    offset: number
  ): { value: number; target: HTMLDivElement } {
    let margin;
    if (this._settings.orientation === 'horizontal') {
      margin = 'marginLeft';
    } else if (this._settings.orientation === 'vertical') {
      margin = 'marginTop';
    }
    const value =
      divisionFloor(
        offset - this._settings[margin],
        this._settings.pxPerValue
      ) * this._settings.stepSize;
    return {
      value: value,
      target: target,
    };
  }

  public calcMain(value: number, target: HTMLDivElement): void {
    let nValue;
    if (value % this._settings.stepSize === 0) {
      nValue = value;
    } else {
      nValue =
        this._settings.stepSize * Math.trunc(value / this._settings.stepSize);
    }
    const main = (value * this._settings.pxPerValue) / this._settings.stepSize;
    this.coords.main = main;
    this.coords.value = nValue;
    this.coords.target = target;
    this.coords.caller = 'model';
    if (this.validate(this.coords)) {
      // it should not do that(single responsability principle)
      this.trigger(
        'coords changed',
        this.coords,
        this._settings.orientation,
        this._settings.type
      );
    }
  }

  public setOption(key: string, value: string | number | boolean): void {
    if (has.call(this._settings, key)) {
      this._settings[key] = value;
      this.trigger('settings changed');
    }
  }

  public setOptions(options: {
    [key: string]: string | number | boolean;
  }): void {
    this.initOptions(options);
    this.correctOptions();
    this.trigger('settings changed');
  }

  public getStyles(): IStyles {
    return this._settings.styles;
  }

  public getStyle(option: string): string | number | boolean {
    return this._settings.styles[option];
  }

  public getSetting(option: string): string | number | boolean {
    return this._settings[option];
  }

  public getSettings(): Settings {
    return this._settings;
  }

  public getItem(): Element {
    return this._item;
  }
  // public calcInterval(data): object {
  //   const interval = this.interval;

  //   interval.set(data.target, data.value);

  //   const value = Number(Array.from(interval.values())[0]);
  //   const value2 = Number(Array.from(interval.values())[1]);

  //   const floor = Math.min(value, value2);
  //   const ceil = Math.max(value, value2);

  //   return {
  //     floor,
  //     ceil,
  //   };
  // }
}
export { Model, ICoords, Settings, Type, Ori, has };
