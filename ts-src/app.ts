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
    this._view = new View(this._pres, options, item, this._model);

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

  _model: Model;

  _view: View;

  _pres: Pres;
}

export default App;
