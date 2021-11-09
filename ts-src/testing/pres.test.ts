/**
 * @jest-environment jsdom
 */
import { Model } from '../slider/layers/model';
import View from '../slider/layers/view';
import { Pres } from '../slider/layers/pres';
import PresBuilder from '../slider/layers/presBuilder';

import { test, describe, jest } from '@jest/globals';
import dom from './setup';

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
    pres.temp = pres.determineMetrics('horizontal');
    view.temp = pres.temp;
    model.temp = pres.temp;
    pres.getView(view);
    pres.builder = new PresBuilder({
      view: view,
      model: model,
      settings: model.getSettings(),
      pres,
    });
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
      _minPins: 5,
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
  test('should return a div element with children and class slider__main', () => {
    oriVars.forEach((ori) => {
      typeVars.forEach((type) => {
        markerVars.forEach((marker) => {
          settings.orientation = ori;
          settings.type = type;
          settings.marker = marker;
          const { main } = pres.builder.makeSlider(settings);

          expect(main.tagName).toBe('DIV');
          expect(main.children.length).toBeGreaterThan(0);
          expect(String(main.className)).toMatch(/slider__main/);
        });
      });
    });
  });

  test('should return a div element with children and class slider__marker', () => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    view._elements._handles.push(div1);
    view._elements._handles.push(div2);
    oriVars.forEach((ori) => {
      typeVars.forEach((type) => {
        markerVars.forEach((marker) => {
          settings.orientation = ori;
          settings.type = type;
          settings.marker = marker;
          const markerDiv = pres.builder.makeMarker(
            settings,
            model.getStyle('sliderWidth')
          );
          expect(markerDiv.tagName).toBe('DIV');
          expect(markerDiv.children.length).toBeGreaterThan(0);
          expect(String(markerDiv.className)).toMatch(/slider__marker/);
        });
      });
    });
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
    oriVars.forEach((ori) => {
      typeVars.forEach((type) => {
        markerVars.forEach((marker) => {
          model._settings.orientation = ori;
          model._settings.type = type;
          model._settings.marker = marker;
          mockSettings.orientation = ori;
          mockSettings.type = type;
          mockSettings.marker = marker;
          expect(mockSettings).toEqual(pres.getSettings());
        });
      });
    });
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
    pres.temp = pres.determineMetrics('horizontal');
    view.temp = pres.temp;
    model.temp = pres.temp;
    pres.builder = new PresBuilder({
      view: view,
      model: model,
      settings: model.getSettings(),
      pres,
    });
    pres.getView(view);

    const classes = [
      'js-slider',
      'js-slider__main',
      'js-slider__range',
      'js-slider__container',
      'js-slider__marker',
      'js-tooltip__container',
    ];
    classes.forEach((i) => {
      const div = document.createElement('div');
      div.className = String(i);
      item.appendChild(div);
    });
    const handleLeft = document.createElement('div');
    handleLeft.className = 'js-slider__handle--horizontal';
    item.appendChild(handleLeft);
    const tool1 = document.createElement('div');
    tool1.classList.add('js-tooltip');
    handleLeft.appendChild(tool1);

    const handleRight = document.createElement('div');
    handleRight.className = 'js-slider__handle--horizontal';
    item.append(handleRight);
    const tool2 = document.createElement('div');
    tool2.classList.add('js-tooltip');
    handleRight.appendChild(tool2);
    const js1 = document.createElement('div');
    const js2 = document.createElement('div');
    js1.classList.add('js-slider-clickable', 'js-offset');
    js2.classList.add('js-slider-clickable', 'js-offset');
    js1.textContent = '19';
    js2.textContent = '20';
    item.append(js1);
    item.append(js2);
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
    pres.temp.ori = model._settings.orientation;
    pres.temp.type = model._settings.type;
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
    pres.builder.removeHandle();
    expect(view._elements._handles.length).toBeLessThan(2);
  });
  test('pres.showValue should trigger view.showValue and model.calcValue', () => {
    const mockCalcValue = jest.spyOn(model, 'calcValue');
    const mockShowValue = jest.spyOn(view, 'showValue');
    pres.showValue(view._elements._handles[0]);
    expect(mockCalcValue).toBeCalled();
    expect(mockShowValue).toBeCalled();
  });

  test('callback are called when listeners are attached', () => {
    const handle = view._elements._handles[0];
    pres.firstRefresh = jest.fn(() => {
      return true;
    });
    pres.onMouseDown();
    const evt = document.createEvent('MouseEvents');
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
      return true;
    });

    const event = document.createEvent('MouseEvent');
    event.initEvent('pointerdown', true, true);
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
    const onMouseMove = () => {
      model.renew(data, 'horizontal', 'double');
    };
    document.addEventListener('mousemove', onMouseMove);
    handle.dispatchEvent(event);
    handle.dispatchEvent(event2);
    expect(transferData).toBeCalled();
  });
  test('inits properly', () => {
    pres.init();
    expect(pres.temp).toBeDefined();
  });
  test('inits properly with vertical orientation', () => {
    const tempForVertical = {
      offset: 'offsetTop',
      widthOrHeight: 'height',
      direction: 'top',
      margin: 'marginTop',
      client: 'clientY',
      offsetLength: 'offsetHeight',
    };
    const Iitem = document.createElement('div');
    document.body.appendChild(Iitem);
    const Imodel = new Model({}, item);
    const Ipres = new Pres(model, item);
    const Iview = new View(pres, {}, item);
    Ipres.temp = pres.determineMetrics('vertical');
    Iview.temp = pres.temp;
    Imodel.temp = pres.temp;
    Ipres.builder = new PresBuilder({
      view: view,
      model: model,
      settings: model.getSettings(),
      pres,
    });
    Ipres.getView(view);
    expect(Ipres.temp).toEqual(tempForVertical);
  });

  test('first refresh', () => {
    const setValue = jest.spyOn(pres, 'setValue').mockImplementation(() => {
      return true;
    });
    pres.firstRefresh();
    expect(setValue).toBeCalled();
  });

  test('first refresh if startValues==0', () => {
    const Idocument = dom.window.document;
    const Iitem = Idocument.createElement('div');
    Idocument.body.appendChild(Iitem);
    const Imodel = new Model(
      { startValueLeftHandle: 0, startValueRightHandle: 0 },
      Iitem
    );
    const Ipres = new Pres(Imodel, Iitem);
    const Iview = new View(
      Ipres,
      { startValueLeftHandle: 0, startValueRightHandle: 0 },
      Iitem
    );
    Ipres.temp = Ipres.determineMetrics('horizontal');
    Iview.temp = Ipres.temp;
    Imodel.temp = Ipres.temp;
    Ipres.builder = new PresBuilder({
      view: Iview,
      model: Imodel,
      settings: Imodel.getSettings(),
      pres: Ipres,
    });
    Ipres.getView(Iview);
    const transferData = jest
      .spyOn(Ipres, 'transferData')
      .mockImplementation(() => {
        return true;
      });

    const handleLeft = document.createElement('div');
    handleLeft.className = 'js-slider__handle--horizontal';
    Iitem.appendChild(handleLeft);
    const tool1 = document.createElement('div');
    tool1.classList.add('js-tooltip');
    handleLeft.appendChild(tool1);

    const handleRight = document.createElement('div');
    handleRight.className = 'js-slider__handle--horizontal';
    Iitem.appendChild(handleRight);
    Ipres.fetchDivs();

    Ipres.firstRefresh();
    expect(transferData).toBeCalled();
  });
});
