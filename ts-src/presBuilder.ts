import View from './view';
import { Settings, Model } from './model';
import { Pres } from './pres';
import { Temp } from './pres';
import { checkForZero } from './utils';

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
    main.classList.add('slider-main');
    const container = document.createElement('div');
    const slider = document.createElement('div');
    slider.classList.add('slider');
    const range = document.createElement('div');
    range.classList.add('slider-range');

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
    tooltipContainer.className = `tooltipContainer tooltipContainer--${ori}`;
    const tooltipStick = document.createElement('div');
    tooltipStick.className = `tooltipStick tooltipStick--${ori}`;
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
    slider.appendChild(handle);
    handle.className = `slider-handle slider-handle--${ori}`;
    viewEls._handles.push(handle);
    container.className = `slider-container slider-container--${ori}`;
    tool.className = `tooltip tooltip--${ori}`;

    if (behavior.type !== 'single') {
      this.addHandle(handle, range, direction);
    }
    min.textContent = String(behavior.minValue);
    min.dataset.value = min.textContent;
    max.textContent = String(behavior.maxValue);
    max.dataset.value = max.textContent;
    min.classList.add(`slider-min--${ori}`);
    max.classList.add(`slider-max--${ori}`);
    main.classList.add(`slider-main--${ori}`);

    return { main: main as Node, container, slider };
  }

  public makeMarker(behavior: Settings, widthOrHeight: number): HTMLElement {
    const orientation = this._pres.temp.ori;
    const handle1 = this._view._elements._handles[0];
    const { margin: marginCss } = this._pres.temp;
    const markerDiv = document.createElement('div');
    const { valuesForMarkers, altDrag, margin } = this.calcPins(
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
      if (i === 0) {
        majorMarker.style[marginCss] = margin - handle1.offsetWidth / 2 + 'px';
      } else {
        majorMarker.style[marginCss] = margin - handle1.offsetWidth / 2 + 'px';
      }

      const value = listOfValues[i];
      majorMarker.dataset.value = value.toString();
      markerValue.dataset.value = value.toString();
      markerValue.textContent = value.toString();
      majorMarker.append(markerValue);
    }
    markerDiv.className = `slider-marker slider-marker--${orientation}`;
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
      'tooltipContainer'
    )[0] as HTMLElement;
    this._view._elements._tooltipContainers.push(tooltipContainer);
    handle.after(range);
    range.after(handleCLone);
    const stick = this._view.fetchHTMLEl('tooltipStick', true) as HTMLElement;
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
    console.log('🚀 ~ PresBuilder ~ calcPins ~ majorMarkers', majorMarkers);

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
    console.log('🚀 ~ PresBuilder ~ calcPins ~ n', n);

    const valuesForMarkers = [];
    for (let i = n; i < diff / ss; i += n) {
      const value = ss * i + behavior.minValue;
      valuesForMarkers.push(value);
    }
    console.log(
      '🚀 ~ PresBuilder ~ calcPins ~ valuesForMarkers',
      valuesForMarkers
    );

    const margin = widthOrHeight / valuesForMarkers.length;
    return { valuesForMarkers, majorMarkers, altDrag, margin };
  }
}

export default PresBuilder;
