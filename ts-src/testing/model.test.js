import { test,describe } from '@jest/globals'
import Model from '../model'

describe('Model with default settings:',() => {
let settings
let maxMinDifference
let model
let item
beforeEach(() => {

   settings={
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
    maxMinDifference: maxMinDifference,
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
      handleColor: 'black',
      sliderWidth: 200,
      sliderHeight: 5,
    },
  };
   item='item'
   model=new Model({},item)
  maxMinDifference=settings.maxValue-settings.minValue
  settings.maxMinDifference=maxMinDifference
  settings.pxPerValue=settings.mainMax/(settings.maxMinDifference/settings.stepSize)
  settings.valuePerPx = settings.maxMinDifference / settings.mainMax;

});
  test('giving an empty object to model should not mutate the settings',() => {
   
    expect(settings).toEqual(model._settings)
  })

  test('should change the width and height if they are set not according to orietation',()=> {
   
    expect(settings).toEqual(model._settings)

  })

  test('setOptions:should not mutate the settings when passing empty object',()=> {
    model.setOptions({})
    expect(settings).toEqual(model._settings)
  })
  test('should return default settings',()=> {
    model.setOptions(undefined)
    expect(settings).toEqual(model._settings)
    model.setOptions(null)
    expect(settings).toEqual(model._settings)
    model.setOptions(false)
    expect(settings).toEqual(model._settings)

  })

  test('should return default styles',()=> {
    expect(settings.styles).toEqual(model.getStyles())
  })
  test('should return default style',()=> {
    const styles=['progressBarColor','sliderColor','handleColor','sliderWidth','sliderHeight']
    for (let i of styles) {
      expect(settings.styles[i]).toBe(model.getStyle(i))

    }
  })
  test('should return default settings',()=> {
    expect(settings).toEqual(model.getSettings())
  })

  test('should return given to model item',()=> {
    expect(item).toBe(model._item)
    expect(item).toBe(model.getItem())

  })

  test('should return the exact setting of default settings',()=> {
    for (let i in settings) {
      const setting=settings[i]
      expect(setting).toEqual(model._settings[i])
    }
  })








})

describe('Model coords main', () => {
  let testMain
  let testCoords
  let item='item'
  let model
  beforeEach(() => {
     testMain=[-1,0,10,99,100,200,201]
     testCoords={
      y: 0,
x: 0,

marginLeft: 0,
clicked: false,
marginTop: 0,
target: 'target1',
    }
    model=new Model({},item)
  });
  test('renew method should return valid coords,testing main with horizontal,double',()=> {
    for (let i of testMain) {
      testCoords.x=i
      model.renew(testCoords,'horizontal','double')
      expect(Number(model.coords.main)).toBeLessThanOrEqual(Number(model._settings.mainMax))
    }
  })
  test('renew method should return valid coords,testing main with horizontal,single',()=> {
    for (let i of testMain) {
      testCoords.y=i
      model.renew(testCoords,'horizontal','single')
      expect(Number(model.coords.main)).toBeLessThanOrEqual(Number(model._settings.mainMax))
    }
  })
  test('renew method should return valid coords,testing main with vertical,double',()=> {
    for (let i of testMain) {
      testCoords.y=i
      model.renew(testCoords,'vertical','double')
      expect(Number(model.coords.main)).toBeLessThanOrEqual(Number(model._settings.mainMax))
    }
  })
  test('renew method should return valid coords,testing main with vertical,single',()=> {
    for (let i of testMain) {
      testCoords.y=i
      model.renew(testCoords,'vertical','single')
      expect(Number(model.coords.main)).toBeLessThanOrEqual(Number(model._settings.mainMax))
    }
  })


});

describe('Model coords value', () => {
  let testMain
  let testCoords
  let item='item'
  let model
  beforeEach(() => {
     testMain=[-1,0,10,99,100,200,201]
     testCoords={
      y: 0,
      x: 0,
      marginLeft: 0,
      clicked: false,
      marginTop: 0,
      target: 'target1',
    }
    model=new Model({},item)
  });

  test('should return valid value,horizontal double',()=> {
    for (let i of testMain) {
      testCoords.x=i
      model.renew(testCoords,'horizontal','double')
      expect(model.coords.value).toBeLessThanOrEqual(model._settings.maxValue)
      expect(model.coords.value).toBeGreaterThanOrEqual(model._settings.minValue)
    }
  })
  test('should return valid value,vertical single',()=> {
    for (let i of testMain) {
      testCoords.y=i
      model.renew(testCoords,'horizontal','double')
      expect(model.coords.value).toBeLessThanOrEqual(model._settings.maxValue)
      expect(model.coords.value).toBeGreaterThanOrEqual(model._settings.minValue)
    }
  })
  test('should return valid main,calcMain',()=> {
    const testValues=[-1,0,1,10,99,100,101,999,1000,1001,1360,1361]
    for (let i of testValues) {
      model.calcMain(i,'target')
      expect(model.coords.main).toBeLessThanOrEqual(model._settings.mainMax)
      expect(model.coords.main).toBeGreaterThanOrEqual(model._settings.mainMin)


    }
  })


});

describe('Model calcValue:', () => {
  test('should return valid value',()=> {
    const testMain=[-1,0,10,99,100,200,201]
    const model=new Model({})
    for (let i of testMain) {
      expect(model.calcValue('target',i).value).toBeGreaterThanOrEqual(model._settings.minValue)
      expect(model.calcValue('target',i).value).toBeLessThanOrEqual(model._settings.maxValue)

    }
  })
});
