// import * as $ from 'jquery'
import { Model } from './model';
import View from './view';
import { Pres } from './pres';
import PresBuilder from './presBuilder';
class App {
  _item: HTMLElement;
  states: {
    range: boolean;
    orientation: string;
    scale: boolean;
    tip: boolean;
    stick: boolean;
  };
  constructor(item: HTMLElement, options: Record<string, unknown>) {
    this._item = item;
    this._model = new Model(options, item);
    this._pres = new Pres(this._model, this._model.getItem());
    this._view = new View(this._pres, options, item);
    this._pres.builder = new PresBuilder({
      view: this._view,
      settings: this._model.getSettings(),
      model: this._model,
      pres: this._pres,
    });
    this._pres.getView(this._view);
    this._pres.init();
    this._pres.onMouseDown();
    this._pres.firstRefresh();
  }

  public tilt(): void {
    if (this._model.getSettings().orientation === 'vertical') {
      this._model.setOption('orientation', 'horizontal');
      // this.states.ori
    } else if (this._model.getSettings().orientation === 'horizontal') {
      this._model.setOption('orientation', 'vertical');
    }
    this._pres.init();
    this._pres.onMouseDown();
  }

  public scale(option: boolean): void {
    if (!option) {
      this._view._elements._scale.style.display = 'none';
    } else {
      this._view._elements._scale.style.display = '';
    }
  }

  public bar(option: boolean): void {
    if (!option) {
      this._view._elements._range.style.display = 'none';
    } else {
      this._view._elements._range.style.display = '';
    }
  }

  public tip(option: boolean): void {
    if (!option) {
      this._view._elements._tooltipContainers.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.style.display = 'none';
      });
    } else {
      this._view._elements._tooltipContainers.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.style.display = '';
      });
    }
  }

  public range(option: boolean): void {
    if (option) {
      if (this._model._settings.type !== 'double') {
        this._model.setOption('type', 'double');
        this._pres.builder.addHandle();
        this._pres.onMouseDown();
      }
    } else {
      this._model.setOption('type', 'single');
      this._pres.builder.removeHandle();
    }
  }

  public setValue(value: number, target: 1 | 2): void {
    this._pres.setValue(value, target);
  }

  public setLimits(min: number, max: number): void {
    if (min) {
      this._model.setOptions({
        minValue: min,
      });
    }
    if (max) {
      this._model.setOptions({
        maxValue: max,
      });
    }
    this._pres.init();
    this._pres.onMouseDown();
  }

  public isRange(): boolean {
    if (this._model._settings.type === 'double') {
      return true;
    }
    return false;
  }

  public setStep(step: number): void {
    this._model.setOption('stepSize', Number(step));
    this._pres.init();
    this._pres.onMouseDown();
  }

  public stick(option: boolean): void {
    if (!option) {
      this._view._elements._tooltipsSticks.forEach((stick) => {
        stick.classList.add('hide');
      });
    } else {
      this._view._elements._tooltipsSticks.forEach((stick) => {
        stick.classList.remove('hide');
      });
    }
  }

  public getValue(numbOfHandle: 1 | 2): number {
    const handle = this._view._elements._handles[numbOfHandle - 1];
    const value = Number(handle.dataset.value);
    return value;
  }

  _model: Model;

  _view: View;

  _pres: Pres;
}

export default App;
