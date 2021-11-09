import View from './view';
import { Settings, Model } from './model';
import { Pres, Temp } from './pres';
import { checkForZero } from '../../utils';

class PresBuilder {
  _view: View;

  _pres: Pres;

  settings: Settings;

  temp: Temp;

  _model: Model;

  constructor(items: {
    view: View;
    model: Model;
    settings: Settings;
    pres: Pres;
  }) {
    this._view = items.view;
    this._model = items.model;
    this.settings = items.settings;
    this._pres = items.pres;
  }

  public makeSlider(behavior: Settings): {
    main: Node;
    container: Node;
    slider: Node;
  } {
    const viewEls = this._view._elements;
    const { ori, direction } = this._pres.temp;
    const main = document.createElement('div');
    main.classList.add('slider__main', 'js-slider__main');
    const container = document.createElement('div');
    const slider = document.createElement('div');
    slider.classList.add('slider', 'js-slider');
    const range = document.createElement('div');
    range.classList.add('slider__range', 'js-slider__range');

    const handle = document.createElement('div');
    if (ori === 'horizontal') {
      range.style.width = '0px';
      handle.style[direction] = '0px';
    } else if (ori === 'vertical') {
      range.style.height = '0px';
      handle.style[direction] = '0px';
    }
    const tool = document.createElement('div');
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = `tooltip__container tooltip__container--${ori} js-tooltip__container`;
    const tooltipStick = document.createElement('div');
    tooltipStick.className = `tooltip__stick tooltip__stick--${ori}`;
    tooltipContainer.append(tooltipStick);
    this._view._elements._tooltipsSticks.push(tooltipStick);
    tooltipContainer.append(tool);
    handle.append(tooltipContainer);
    const min = document.createElement('span');
    min.className = 'js-offset  js-slider-clickable';
    const max = document.createElement('span');
    max.className = 'js-offset  js-slider-clickable';
    main.append(min);
    container.append(slider);
    main.append(container);
    main.append(max);
    slider.appendChild(range);
    slider.appendChild(handle);
    handle.className = `slider__handle slider__handle--${ori} js-slider__handle--${ori}`;
    viewEls._handles.push(handle);
    container.className = `slider__container slider__container--${ori} js-slider__container`;
    tool.className = `tooltip tooltip--${ori} js-tooltip`;

    if (behavior.type !== 'single') {
      this.addHandle(handle, range, direction);
    }
    min.textContent = String(behavior.minValue);
    min.dataset.value = min.textContent;
    max.textContent = String(behavior.maxValue);
    max.dataset.value = max.textContent;
    min.classList.add('slider__min', `slider__min--${ori}`);
    max.classList.add('slider__max', `slider__max--${ori}`);
    main.classList.add('slider__main', `slider__main--${ori}`);

    return { main: main as Node, container, slider };
  }

  public makeMarker(behavior: Settings, widthOrHeight: number): HTMLElement {
    const orientation = this._pres.temp.ori;
    const handleLeft = this._view._elements._handles[0];
    const { margin: marginCss } = this._pres.temp;
    const markerDiv = document.createElement('div');
    const { valuesForMarkers, margin } = this.calcPins(behavior, widthOrHeight);
    const listOfValues = valuesForMarkers;

    for (let i = 0; i < valuesForMarkers.length - 1; i += 1) {
      const majorMarker = document.createElement('div');

      markerDiv.append(majorMarker);
      const markerValue = document.createElement('label');
      markerValue.className = `js-slider-clickable marker__value js-marker__value marker__value--${orientation} `;

      majorMarker.className = `js-offset marker__pin marker__pin--${orientation}`;
      if (i === 0) {
        majorMarker.style[marginCss] =
          margin - handleLeft.offsetWidth / 2 + 'px';
      } else {
        majorMarker.style[marginCss] =
          margin - handleLeft.offsetWidth / 2 + 'px';
      }

      const value = listOfValues[i];
      majorMarker.dataset.value = value.toString();
      markerValue.dataset.value = value.toString();
      markerValue.textContent = value.toString();
      majorMarker.append(markerValue);
    }
    markerDiv.className = `slider__marker js-slider__marker slider__marker--${orientation}`;
    return markerDiv;
  }

  public addHandle(
    handl?: HTMLElement,
    rang?: HTMLElement,
    directio?: string
  ): void {
    let handle: HTMLElement;
    let range: HTMLElement;
    let direction: string;
    const viewEls = this._view._elements;
    this._model.setOption('type', 'double');

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
      'js-tooltip__container'
    )[0] as HTMLElement;
    this._view._elements._tooltipContainers.push(tooltipContainer);
    handle.after(range);
    range.after(handleCLone);
    const stick = this._view.fetchHTMLEl('tooltip__stick', true) as HTMLElement;
    viewEls._tooltipsSticks.push(stick);
    viewEls._handles.push(handleCLone);
    if (this._model._settings.built) {
      this._view.rangeInterval();
      this._pres.showValue(handleCLone);
    }
  }

  public removeHandle(): void {
    const viewEls = this._view._elements;
    this._model.setOption('type', 'single');
    const orient = this._pres.temp.ori;
    if (orient === 'horizontal') {
      viewEls._range.style.left = '0px';
    } else if (orient === 'vertical') {
      viewEls._range.style.top = '0px';
    }
    viewEls._handles[0].before(viewEls._range);
    viewEls._handles[1].remove();
    viewEls._handles = viewEls._handles.slice(0, 1);

    if (this._model._settings.built) {
      this._view.rangeInterval();
    }
  }

  private calcPins(behavior, widthOrHeight) {
    let altDrag: boolean;

    let majorMarkers = Math.trunc(
      (behavior.maxValue - behavior.minValue) / behavior.stepSize
    );

    // 40px between pins is the optimal number,if it is smaller,we make it 40
    if (widthOrHeight / majorMarkers < 40) {
      altDrag = true;
      this._model.setOptions({
        altDrag: altDrag,
      });
      majorMarkers = this._model._settings._minPins;
    }

    const diff = this._model._settings.maxMinDifference;
    const ss = this._model._settings.stepSize;
    const n = checkForZero(Math.round(diff / (ss * majorMarkers))); // каждый n-ый элемент из возможныъ value будет помещен на scale

    const valuesForMarkers = [];
    for (let i = n; i < diff / ss; i += n) {
      const value = ss * i + behavior.minValue;
      valuesForMarkers.push(value);
    }

    const margin = widthOrHeight / valuesForMarkers.length;
    return { valuesForMarkers, majorMarkers, altDrag, margin };
  }
}

export default PresBuilder;
