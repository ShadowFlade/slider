// import * as $ from 'jquery'
import Model from './model';
import View from './view';
import Pres from './pres';

class App {
  _item: HTMLElement;
  constructor(item: HTMLElement, options: object) {
    this._item = item;
    this._model = new Model(options, item);

    this._pres = new Pres(this._model, this._model.getItem());
    this._view = new View(this._pres, options, item);

    this._pres.getView(this._view);
    this._pres.init();

    this._pres.onMouseDown();
  }
  public tilt() {
    if (this._model.getSettings().orientation == 'vertical') {
      this._model._settings.orientation = 'horizontal';
    } else if (this._model.getSettings().orientation == 'horizontal') {
      this._model._settings.orientation = 'vertical';
    }
    this._pres.init();
    this._pres.onMouseDown();
  }
  public scale(option: boolean) {
    if (!option) {
      this._view._elements._scale.style.display = 'none';
    } else {
      this._view._elements._scale.style.display = '';
    }
  }
  public bar(option: boolean) {
    if (!option) {
      this._view._elements._range.style.display = 'none';
    } else {
      this._view._elements._range.style.display = '';
    }
  }
  public tip(option: boolean) {
    if (!option) {
      this._view._elements._tooltipContainers.forEach((item) => {
        item.style.display = 'none';
      });
    } else {
      this._view._elements._tooltipContainers.forEach((item) => {
        item.style.display = '';
      });
    }
  }
  public range(option: boolean) {
    if (option) {
      if (this._model._settings.type != 'double') {
        this._model._settings.type = 'double';
        this._pres.addHandle();
        this._pres.onMouseDown();
      }
    } else {
      this._model._settings.type = 'single';
      this._pres.removeHandle();
    }
  }
  public setValue(value: number, target: 1 | 2) {
    this._pres.setValue(value, target);
  }
  public setLimits(min: number, max: number) {
    this._model._settings.maxValue = max;
    this._model._settings.minValue = min;
    this._pres.init();
    this._pres.onMouseDown();
  }
  public isRange() {
    if (this._model._settings.type == 'double') {
      return true;
    } else {
      return false;
    }
  }
  public setStep(step) {
    this._model._settings.stepSize = Number(step);
    this._pres.init();
    this._pres.onMouseDown();
  }
  public noStick(option: boolean) {
    if (!option) {
    }
  }
  private changeStyles(item) {
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
  public getValue(numbOfHandle: 1 | 2) {
    let direction;
    let margin;

    const handle = this._view._elements._handles[numbOfHandle - 1];
    if (this._model._settings.orientation == 'horizontal') {
      direction = 'left';
      margin = 'marginLeft';
    } else {
      direction = 'top';
      margin = 'marginTop';
    }
    const value = handle.dataset.value;
    return value;
  }

  _model: Model;

  _view: View;

  _pres: Pres;
}

export default App;
