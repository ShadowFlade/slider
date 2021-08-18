/**
 * @jest-environment jsdom
 */
import EventMixin from '../eventemitter';
import Model, { Settings, Ori, Type } from '../model';
import View from '../view';
import { test, describe, jest } from '@jest/globals';
import Pres from '../pres';
import App from '../app';
import dom from './setup';
import { FileWatcherEventKind } from 'typescript';

describe('View', () => {
  let item;
  let model;
  let view;
  let pres;
  let document;
  beforeEach(() => {
    document = dom.window.document;
    item = document.createElement('div');
    model = new Model({}, item);
    pres = new Pres(model, item);
    view = new View(pres, {}, item);
  });

  test('should render the element', () => {
    const el = document.createElement('div');
    const el2 = document.createElement('div');
    el2.classList.add('slider-handle');
    document.body.appendChild(el2);
    const handle = document.getElementsByClassName('slider-handle');
    view.showSlider(el2, 'horizontal');
    expect(item.children.length).toBeGreaterThan(0);
    expect(handle).toBeDefined();
  });

  test('should create instances of classes ', () => {
    expect(model).toBeDefined();
    expect(pres).toBeDefined();
    expect(view).toBeDefined();
  });
});

describe('pres implement styles:', () => {
  let item;
  let model;
  let view;
  let pres;
  let document;
  beforeEach(() => {
    document = dom.window.document;
    item = document.createElement('div');
    document.body.appendChild(item);
    model = new Model({}, item);
    pres = new Pres(model, item);
    view = new View(pres, {}, item);
    pres.getView(view);
    const classes = [
      'slider',
      'slider-main',
      'slider-range',

      'slider-container',
      'slider-marker',
      'tooltipContainer',
    ];
    for (let i of classes) {
      const div = document.createElement('div');
      div.className = String(i);
      item.appendChild(div);
    }
    const handle1 = document.createElement('div');
    handle1.className = 'slider-handle--horizontal';
    item.appendChild(handle1);
    const tool1 = document.createElement('div');
    tool1.classList.add('tooltip');
    handle1.appendChild(tool1);

    const handle2 = document.createElement('div');
    handle2.className = 'slider-handle--horizontal';
    item.appendChild(handle2);
    const tool2 = document.createElement('div');
    tool2.classList.add('tooltip');
    handle2.appendChild(tool2);

    const js1 = document.createElement('div');
    const js2 = document.createElement('div');
    js1.classList.add('jsSlider-clickable');
    js2.classList.add('jsSlider-clickable');
    js1.textContent = '19';
    js2.textContent = '20';
    const position = 'horizontal';
    const options = {
      slider: {
        color: 'black',
        'background-color': 'black',
      },
      progressBar: {
        color: 'green',
        'background-color': 'green',
      },
    };

    view.implementStyles(options, position);
  });
  test('should implement the styles and get HTMLElements', () => {
    for (let i of Array.from(view._elements)) {
      const item = i as HTMLElement;
      expect(item.cssText).toBeDefined();
    }
    for (let i of Array.from(view._elements)) {
      expect(i).toBeDefined();
    }
  });

  test('should refresh coordinates,horizontal single', () => {
    const xs = [200, 15, 10, 100, 199];
    const values = [100, 1000, 1361];
    const handles = [
      Array.from(view._elements._sliderHandles)[0],
      Array.from(view._elements._sliderHandles)[1],
    ];
    const data = {
      main: 0,
      prevMain: 0,
      value: 1,
      prevValue: 0,
      caller: '',
      clicked: false,
      altDrag: true,
      target: null,
      shiftX: 0,
    };
    view._elements._sliderRange.style.width = '0px';
    const rangeWidth = view._elements._sliderRange.style.width;

    const handleLeft1 = view._elements._sliderHandles[0].style.left;
    const handleLeft2 = view._elements._sliderHandles[1].style.left;
    const toolTipiValue = view._elements._sliderTooltip.textContent;

    function deepCheck(handle) {
      data.target = handle;
      for (let i of xs) {
        for (let j of values) {
          data.main = i;
          data.value = j;

          view.refreshCoords(data, 'horizontal', 'single');
          expect(rangeWidth).not.toEqual(
            view._elements._sliderRange.style.width
          );

          let handleReceiver;
          let numOfHandle;
          if (handle == view._elements._sliderHandles[0]) {
            handleReceiver = handleLeft1;
            numOfHandle = 0;
          } else {
            handleReceiver = handleLeft2;
            numOfHandle = 1;
          }
          expect(handleReceiver).not.toEqual(handle.style.left);
          expect(toolTipiValue).not.toEqual(
            view._elements._sliderTooltip[numOfHandle].textContent
          );
        }
      }
    }

    deepCheck(view._elements._sliderHandles[0]);
  });
});

describe('refresh coords:', () => {
  let item;
  let model;
  let view;
  let pres;
  let document;
  beforeEach(() => {
    document = dom.window.document;
    item = document.createElement('div');
    document.body.appendChild(item);
    model = new Model({}, item);
    pres = new Pres(model, item);
    view = new View(pres, {}, item);
    pres.getView(view);
    const classes = [
      'slider',
      'slider-main',
      'slider-range',

      'slider-container',
      'slider-marker',
      'tooltipContainer',
    ];
    for (let i of classes) {
      const div = document.createElement('div');
      div.className = String(i);
      item.appendChild(div);
    }
    const handle1 = document.createElement('div');
    handle1.className = 'slider-handle--horizontal';
    item.appendChild(handle1);
    const tool1 = document.createElement('div');
    tool1.classList.add('tooltip');
    handle1.appendChild(tool1);

    const handle2 = document.createElement('div');
    handle2.className = 'slider-handle--horizontal';
    item.appendChild(handle2);
    const tool2 = document.createElement('div');
    tool2.classList.add('tooltip');
    handle2.appendChild(tool2);
    const js1 = document.createElement('div');
    const js2 = document.createElement('div');
    js1.classList.add('jsSlider-clickable');
    js2.classList.add('jsSlider-clickable');
    js1.textContent = '19';
    js2.textContent = '20';
    const position = 'horizontal';
    const options = {
      slider: {
        color: 'black',
        'background-color': 'black',
      },
      progressBar: {
        color: 'green',
        'background-color': 'green',
      },
    };

    view.implementStyles(options, position);
  });
  test('should refresh coordinates,horizontal double', () => {
    const xs = [200, 15, 10, 100, 199];
    const values = [100, 1000, 1361];
    const handles = [
      Array.from(view._elements._sliderHandles)[0],
      Array.from(view._elements._sliderHandles)[1],
    ];
    const data = {
      main: 0,
      prevMain: 0,
      value: 1,
      prevValue: 0,
      caller: '',
      clicked: false,
      altDrag: true,
      target: null,
      shiftX: 0,
    };
    view._elements._sliderRange.style.width = '0px';
    const rangeWidth = view._elements._sliderRange.style.width;
    const handleLeft1 = view._elements._sliderHandles[0].style.left;
    const handleLeft2 = view._elements._sliderHandles[1].style.left;
    const toolTipiValue = view._elements._sliderTooltip.textContent;

    function deepCheck(handle) {
      data.target = handle;
      for (let i of xs) {
        for (let j of values) {
          data.main = i;
          data.value = j;

          view.refreshCoords(data, 'horizontal', 'double');
          expect(rangeWidth).not.toEqual(
            view._elements._sliderRange.style.width
          );

          let handleReceiver;
          let numOfHandle;
          if (handle == view._elements._sliderHandles[0]) {
            handleReceiver = handleLeft1;
            numOfHandle = 0;
          } else {
            handleReceiver = handleLeft2;
            numOfHandle = 1;
          }
          expect(handleReceiver).not.toEqual(handle.style.left);
          expect(toolTipiValue).not.toEqual(
            view._elements._sliderTooltip[numOfHandle].textContent
          );
        }
      }
    }
    deepCheck(view._elements._sliderHandles[0]);
    // deepCheck(view._elements._sliderHandles[1]);
  });
});
