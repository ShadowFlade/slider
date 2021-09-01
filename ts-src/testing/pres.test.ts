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
import { createLanguageService, FileWatcherEventKind } from 'typescript';

describe('Pres: independent methods', () => {
  let item;
  let model;
  let view;
  let pres;
  let document;
  let oriVars;
  let typeVars;
  let markerVars;
  let settings;
  beforeEach(() => {
    document = dom.window.document;
    item = document.createElement('div');
    model = new Model({}, item);
    pres = new Pres(model, item);
    view = new View(pres, {}, item);
    pres.temp = pres.convertValues('horizontal');
    view.temp = pres.temp;
    model.temp = pres.temp;
    pres.getView(view);
    pres.fetchDivs();
    oriVars = ['horizontal', 'vertical'];
    typeVars = ['double', 'single'];
    markerVars = [true, false];
    settings = {
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
      mainMax: 200,
      mainMin: 0,
      valueWidth: 0,
      toolTip: true,
      marker: true,
      altDrag: false,
      built: false,
      styles: {
        progressBarColor: 'green',
        sliderColor: 'red',
        handleColor: '',
        sliderWidth: 5,
        sliderHeight: 200,
      },
    };
  });

  test('pres should get the view', () => {
    expect(pres._view).toEqual(view);
  });
  test('should return a div element with children and class slider-main', () => {
    for (let ori of oriVars) {
      for (let type of typeVars) {
        for (let marker of markerVars) {
          settings.orientation = ori;
          settings.type = type;
          settings.marker = marker;
          const { main } = pres.makeSlider(settings);

          expect(main.tagName).toBe('DIV');
          expect(main.children.length).toBeGreaterThan(0);
          expect(String(main.className)).toMatch(/slider-main/);
        }
      }
    }
  });

  test('should return a div element with children and class slider-marker', () => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    view._elements._handles.push(div1);
    view._elements._handles.push(div2);
    for (let ori of oriVars) {
      for (let type of typeVars) {
        for (let marker of markerVars) {
          settings.orientation = ori;
          settings.type = type;
          settings.marker = marker;
          const markerDiv = pres.makeMarker(
            settings,
            model.getStyle('sliderWidth')
          );
          expect(markerDiv.tagName).toBe('DIV');
          expect(markerDiv.children.length).toBeGreaterThan(0);
          expect(String(markerDiv.className)).toMatch(/slider-marker/);
        }
      }
    }
  });

  test('should return valid options', () => {
    const options = model.getStyles();
    const validOptions = {
      slider: {
        width: '200px',
        height: '5px',
        'background-color': 'red',
      },
      progressBar: {
        'background-color': 'green',
      },
      handle: {
        'background-color': '',
      },
      tool: {
        color: 'green',
      },
    };
    expect(pres.convertOptions(options)).toEqual(validOptions);
  });
  test('should return valid settings', () => {
    const mockSettings = model.getSettings();
    for (let ori of oriVars) {
      for (let type of typeVars) {
        for (let marker of markerVars) {
          model._settings.orientation = ori;
          model._settings.type = type;
          model._settings.marker = marker;
          mockSettings.orientation = ori;
          mockSettings.type = type;
          mockSettings.marker = marker;
          expect(mockSettings).toEqual(pres.getSettings());
        }
      }
    }
  });
});

describe('Pres:changing the elements', () => {
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
    pres.temp = pres.convertValues('horizontal');
    view.temp = pres.temp;
    model.temp = pres.temp;
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
    pres.fetchDivs();

    view.implementStyles(options, position);
  });
  test('transfer data should call mode.renew', () => {
    const data = {
      y: 10,
      x: 5,
      shift: 2,
      marginLeft: 2,
      clicked: false,
      marginTop: 2,
      target: 'handle',
    };
    const mock = jest.spyOn(model, 'renew');
    pres.transferData(data, 'horizontal', 'double');
    expect(mock).toBeCalled();
  });
  test('set value should  trigger model.calcMain', () => {
    const mock = jest.spyOn(model, 'calcMain');
    pres.setValue(180, '1');
    expect(mock).toBeCalled();
  });
  test('set value(handle=2) should  trigger model.calcMain', () => {
    const mock = jest.spyOn(model, 'calcMain');
    pres.setValue(180, '2');
    expect(mock).toBeCalled();
  });
  test('pres.fetchDivs should trigger view.fetchDivs', () => {
    const mock = jest.spyOn(view, 'fetchDivs');
    pres.fetchDivs();
    expect(mock).toBeCalled();
  });
  test('should remove one handle=>1 remains', () => {
    pres.removeHandle();
    expect(view._elements._handles.length).toBeLessThan(2);
  });
  test('pres.showValue should trigger view.showValue and model.calcValue', () => {
    const mockCalcValue = jest.spyOn(model, 'calcValue');
    const mockShowValue = jest.spyOn(view, 'showValue');
    pres.showValue(view._elements._handles[0]);
    expect(mockCalcValue).toBeCalled();
    expect(mockShowValue).toBeCalled();
  });
});

describe('Pres:interacting with dom', () => {
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
    pres.temp = pres.convertValues('horizontal');
    view.temp = pres.temp;
    model.temp = pres.temp;
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
    pres.fetchDivs('horizontal', 'slider');
    view.implementStyles(options, position);
  });
  test('callback are called when listeners are attached', () => {
    const handle = view._elements._handles[0];
    // model.renew = jest.fn(() => {
    //   return;
    // });
    pres.firstRefresh = jest.fn(() => {
      return;
    });
    pres.onMouseDown();
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'mousedown',
      true,
      true,
      dom.window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null
    );
    const transferData = jest.spyOn(model, 'renew').mockImplementation(() => {
      return;
    });

    const event = document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    const event2 = document.createEvent('MouseEvent');

    event2.initEvent('mousemove', true, true, dom.window, 0, 0, 0, 80, 20);
    const data = {
      y: 50,
      x: 50,
      shift: 0,
      marginLeft: 0,
      clicked: false,
      atlDrag: true,
      marginTop: 0,
      target: view._elements._handles[0],
    };

    document.addEventListener('mousemove', () => {
      model.renew(data, 'horizontal', 'double');
    });
    handle.dispatchEvent(event);
    handle.dispatchEvent(event2);
    expect(transferData).toBeCalled();
  });
});
