/**
 * @jest-environment jsdom
 */
import { Model } from '../slider/layers/model';
import View from '../slider/layers/view';
import { Pres } from '../slider/layers/pres';
import { test, describe, jest } from '@jest/globals';
import dom from './setup';

describe('View:', () => {
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
    tool1.classList.add('tooltip');
    handleLeft.appendChild(tool1);

    const handleRight = document.createElement('div');
    handleRight.className = 'js-slider__handle--horizontal';
    item.appendChild(handleRight);
    const tool2 = document.createElement('div');
    tool2.classList.add('js-tooltip');
    handleRight.appendChild(tool2);

    const js1 = document.createElement('div');
    const js2 = document.createElement('div');
    js1.classList.add('js-slider-clickable', 'slider__max');
    js2.classList.add('js-slider-clickable', 'slider__min');
    js1.textContent = '19';
    js2.textContent = '20';
    const min = document.createElement('div');
    min.classList.add('slider__min--vertical');
    item.append(min, js1, js2);

    pres.fetchDivs();
  });

  test('should create instances of classes ', () => {
    expect(model).toBeDefined();
    expect(pres).toBeDefined();
    expect(view).toBeDefined();
  });

  test('should render the element', () => {
    const el2 = document.createElement('div');
    el2.classList.add('slider__handle');
    document.body.appendChild(el2);
    const handle = document.getElementsByClassName(
      'js-slider__handle--horizontal'
    );
    view.renderElement(el2);
    expect(item.children.length).toBeGreaterThan(0);
    expect(handle).toBeDefined();
  });
  test('should change styles if the scale does not fit on the left side', () => {
    const min = document.createElement('div');
    min.classList.add('slider__min--vertical');
    item.appendChild(min);
    const styles = view.fetchHTMLEl('slider__min--vertical', true, item).style
      .cssText;

    view._elements._tooltips[0].getBoundingClientRect = jest.fn(() => {
      return {
        top: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        left: -10,
        right: 0,
        bottom: 0,
        toJSON: jest.fn(),
      };
    });
    view.implementStyles({}, 'horizontal');
    expect(styles).not.toEqual(
      view.fetchHTMLEl('slider__min--vertical', true, item).style.cssText
    );
  });
});

describe('View:refresh coordinates new', () => {
  let deepCheck;
  let item;
  let model;
  let pres;
  let view;
  let data;
  beforeEach(() => {
    // eslint-disable-next-line no-global-assign
    document = dom.window.document;
    item = document.createElement('div');
    document.body.appendChild(item);
    model = new Model({}, item);
    pres = new Pres(model, item);
    view = new View(pres, {}, item);
    pres.temp = pres.determineMetrics('horizontal');
    view.temp = pres.temp;
    model.temp = pres.temp;
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
    item.appendChild(handleRight);
    const tool2 = document.createElement('div');
    tool2.classList.add('js-tooltip');
    handleRight.appendChild(tool2);

    const js1 = document.createElement('div');
    const js2 = document.createElement('div');
    js1.classList.add('js-slider-clickable');
    js2.classList.add('js-slider-clickable');
    js1.textContent = '19';
    js2.textContent = '20';
    pres.fetchDivs();
    const xs = [200, 15, 10, 100, 199];
    const values = [100, 1000, 1361];
    data = {
      main: 20,
      prevMain: 0,
      value: 1,
      prevValue: 0,
      caller: '',
      clicked: false,
      altDrag: true,
      target: null,
      shift: 0,
    };

    const rangeWidth = view._elements._range.style.width;
    const handleLeft1 = view._elements._handles[0].style.left;
    const handleLeft2 = view._elements._handles[1].style.left;
    const toolTipiValue = view._elements._tooltips.textContent;
    // eslint-disable-next-line func-names
    deepCheck = function (data, handle, ori, type, targetFocClick?) {
      data.target = targetFocClick || handle;
      xs.forEach((i) => {
        values.forEach((j) => {
          data.main = i;
          data.value = j;
          view.refreshCoords(data, ori, type);

          let handleReceiver;
          let numOfHandle;
          if (handle === view._elements._handles[0]) {
            handleReceiver = handleLeft1;
            numOfHandle = 0;
          } else {
            handleReceiver = handleLeft2;
            numOfHandle = 1;
          }
          expect(rangeWidth).not.toEqual(view._elements._range.style.width);
          expect(handleReceiver).not.toEqual(handle.style.left);
          expect(toolTipiValue).not.toEqual(
            view._elements._tooltips[numOfHandle].textContent
          );
        });
      });
    };
  });
  test('should refresh coordinates on drag,horizontal,single', () => {
    deepCheck(data, view._elements._handles[0], 'horizontal', 'single');
  });

  test('should refresh coordinates on drag,horizontal,double', () => {
    view._elements._range.style.width = '0px';
    deepCheck(data, view._elements._handles[0], 'horizontal', 'double');
  });
  test('should refresh coordinates on drag,horizontal,double,second handle', () => {
    view._elements._handles[0].style.left = '2px'; // so that 2 handles do not occupy the same position
    deepCheck(data, view._elements._handles[1], 'horizontal', 'double');
  });
  test('should refresh coordinates on drag when pinnedDrag is used', () => {
    const d = {
      main: 20,
      prevMain: 0,
      value: 1,
      prevValue: 0,
      caller: '',
      clicked: false,
      altDrag: false,
      target: null,
      shift: 0,
      marginLeft: 0,
      marginTop: 0,
      mainMax: 200,
    };
    const mains = [50, 100, 150, 200];
    const offsets = [];
    mains.forEach((i) => {
      const div: HTMLElement = document.createElement('div');
      const div2 = document.createElement('div');
      div2.textContent = String(i * 30);
      div2.classList.add('js-slider-clickable');
      div.appendChild(div2);
      div.classList.add('js-offset');
      div.textContent = String(i * 30);
      div.dataset.value = String(i * 30);
      item.appendChild(div);
      div.getBoundingClientRect = jest.fn(() => {
        return {
          top: 0,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          left: i,
          right: 0,
          bottom: 0,
          toJSON: jest.fn(),
        };
      });
      div2.getBoundingClientRect = jest.fn(() => {
        return {
          top: 0,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          left: i,
          right: 0,
          bottom: 0,
          toJSON: jest.fn(),
        };
      });
      offsets.push({ div: div, value: div.textContent, offset: i });
    });
    view.pinsCoordinatesItems = offsets;
    const nums = offsets.map((num) => num.offset);
    view.pinsCoordinates = nums;

    deepCheck(d, view._elements._handles[0], 'horizontal', 'single');
  });

  test('should refresh coords properly on click', () => {
    view._elements._range.style.width = '0px';

    const mains = [50, 100, 150, 200];
    mains.forEach((i) => {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div2.textContent = String(i * 30);
      div2.classList.add('js-slider-clickable');
      div.textContent = String(i * 30);
      div.dataset.value = String(i * 30);
      div.appendChild(div2);
      div.classList.add('js-offset');
      item.appendChild(div);

      div.getBoundingClientRect = jest.fn(() => {
        return {
          top: 0,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          left: 113,
          right: 0,
          bottom: 0,
          toJSON: jest.fn(),
        };
      });
      div2.getBoundingClientRect = jest.fn(() => {
        return {
          top: 0,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          left: 114,
          right: 0,
          bottom: 0,
          toJSON: jest.fn(),
        };
      });
      const testData = {
        main: 20,
        prevMain: 0,
        value: 1,
        prevValue: 0,
        caller: '',
        clicked: true,
        altDrag: false,
        target: null,
        shift: 0,
        marginLeft: 5,
        marginTop: 10,
      };
      deepCheck(
        testData,
        view._elements._handles[0],
        'horizontal',
        'single',
        div2
      );
    });
  });
});
