import { test, describe } from '@jest/globals';
import { Model } from '../slider/layers/model';

describe('Model with default settings:', () => {
  let settings;
  let maxMinDifference;
  let model;
  let item;
  beforeEach(() => {
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
      _minPins: 5, // optimal maximum number of pins
      mainMax: 200,
      mainMin: 0,
      startPosLeftHandle: 0,
      startPosRightHandle: 100,
      startValueLeftHandle: 810,
      startValueRightHandle: 0,
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
    item = 'item';
    model = new Model({}, item);
    maxMinDifference = settings.maxValue - settings.minValue;
    settings.maxMinDifference = maxMinDifference;
    settings.pxPerValue =
      settings.mainMax / (settings.maxMinDifference / settings.stepSize);
    settings.valuePerPx = settings.maxMinDifference / settings.mainMax;
  });
  test('giving an empty object to model should not mutate the settings', () => {
    expect(settings).toEqual(model._settings);
  });

  test('should change the width and height if they are set not according to orietation', () => {
    expect(settings).toEqual(model._settings);
  });

  test('setOptions:should not mutate the settings when passing empty object', () => {
    model.setOptions({});
    expect(settings).toEqual(model._settings);
  });
  test('should return default settings', () => {
    model.setOptions(false);
    expect(settings).toEqual(model._settings);
  });

  test('should return default styles', () => {
    expect(settings.styles).toEqual(model.getStyles());
  });
  test('should return default style', () => {
    const styles = [
      'progressBarColor',
      'sliderColor',
      'handleColor',
      'sliderWidth',
      'sliderHeight',
      'toolTextColor',
    ];
    styles.forEach((i) => {
      expect(settings.styles[i]).toBe(model.getStyle(i));
    });
  });
  test('should return default settings2', () => {
    expect(settings).toEqual(model.getSettings());
  });

  test('should return given to model item', () => {
    expect(item).toBe(model._item);
    expect(item).toBe(model.getItem());
  });

  test('should return the exact setting of default settings', () => {
    Object.keys(settings).forEach((i) => {
      const setting = settings[i];
      expect(setting).toEqual(model._settings[i]);
    });
  });
});

describe('Model coords main', () => {
  let testMain;
  let testCoords;
  const item = document.createElement('div');
  let model;
  beforeEach(() => {
    testMain = [-1, 0, 10, 99, 100, 200, 201];
    testCoords = {
      y: 0,
      x: 0,
      marginLeft: 0,
      clicked: false,
      marginTop: 0,
      target: 'target1',
    };
    model = new Model({}, item);
  });
  test('renew method should return valid coords,testing main with horizontal,double', () => {
    testMain.forEach((i) => {
      const handlewidth = 10;

      testCoords.x = i;
      model.renew(testCoords, 'horizontal', 'double');
      expect(Number(model.coords.main)).toBeLessThanOrEqual(
        Number(model._settings.mainMax) + handlewidth / 2
      );
    });
  });
  test('renew method should return valid coords,testing main with horizontal,single', () => {
    testMain.forEach((i) => {
      const handlewidth = 10;
      testCoords.y = i;
      model.renew(testCoords, 'horizontal', 'single');
      expect(Number(model.coords.main)).toBeLessThanOrEqual(
        Number(model._settings.mainMax) + handlewidth / 2
      );
    });
  });
  test('renew method should return valid coords,testing main with vertical,double', () => {
    testMain.forEach((i) => {
      const handlewidth = 10;

      testCoords.y = i;
      model.renew(testCoords, 'vertical', 'double');
      expect(Number(model.coords.main)).toBeLessThanOrEqual(
        Number(model._settings.mainMax) + handlewidth / 2
      );
    });
  });
  test('renew method should return valid coords,testing main with vertical,single', () => {
    testMain.forEach((i) => {
      const handlewidth = 10;

      testCoords.y = i;
      model.renew(testCoords, 'vertical', 'single');
      expect(Number(model.coords.main)).toBeLessThanOrEqual(
        Number(model._settings.mainMax) + handlewidth / 2
      );
    });
  });

  test('should return valid value,horizontal double', () => {
    testMain.forEach((i) => {
      testCoords.x = i;
      model.renew(testCoords, 'horizontal', 'double');
      expect(model.coords.value).toBeLessThanOrEqual(model._settings.maxValue);
      expect(model.coords.value).toBeGreaterThanOrEqual(
        model._settings.minValue
      );
    });
  });
  test('should return valid value,vertical single', () => {
    testMain.forEach((i) => {
      testCoords.y = i;
      model.renew(testCoords, 'horizontal', 'double');
      expect(model.coords.value).toBeLessThanOrEqual(model._settings.maxValue);
      expect(model.coords.value).toBeGreaterThanOrEqual(
        model._settings.minValue
      );
    });
  });
  test('should return valid main,calcMain', () => {
    const testValues = [
      -1, 0, 1, 10, 99, 100, 101, 999, 1000, 1001, 1360, 1361,
    ];
    testValues.forEach((i) => {
      const handlewidth = 10;
      model.calcMain(i, 'target');
      expect(model.coords.main).toBeLessThanOrEqual(
        model._settings.mainMax + handlewidth / 2
      );
      expect(model.coords.main).toBeGreaterThanOrEqual(
        model._settings.mainMin - handlewidth / 2
      );
    });
  });

  test('should return valid value', () => {
    testMain = [-1, 0, 10, 99, 100, 200, 201];
    const model2 = new Model({}, item);
    testMain.forEach((i) => {
      const target = document.createElement('div');
      expect(model2.calcValue(target, i).value).toBeGreaterThanOrEqual(
        model2._settings.minValue
      );
      expect(model.calcValue(target, i).value).toBeLessThanOrEqual(
        model2._settings.maxValue
      );
    });
  });
});
