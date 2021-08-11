import { test,describe } from '@jest/globals'
import Model from '../model'

describe('Model:',() => {

  test('giving an empty object to model should not mutate the settings',() => {

    const settings={
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
      mainMax: 0,
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
        sliderWidth: 5,
        sliderHeight: 200,
      },
    };

    const model=new Model({},'item')
    expect(settings).toEqual(model._settings)
  })
  
})
