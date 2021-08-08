import Model from './model';
import EventMixin from './eventemitter';
import Pres from './pres';
type Ori = 'horizontal' | 'vertical';
type Elements<T> = {
  _slider: T;

  _sliderMain: T;
  _sliderScale: T;
  _sliderRange: T;
  _sliderTooltipContainers: T[];
  _sliderHandles: T[];
  _sliderContainer: T;
  _tooltipContainer: T[];
  _sliderTooltip: T;
};
class View extends EventMixin {
  valueDivs: Object[];

  valueDivsArray: number[];

  _model: Model;

  _pres: Pres;

  _item: HTMLElement;

  orientation: string;
  public _elements: Elements<HTMLElement> = {
    _slider: null,

    _sliderMain: null,
    _sliderScale: null,
    _sliderRange: null,
    _sliderTooltipContainers: null,
    _sliderHandles: [],
    _sliderContainer: null,
    _tooltipContainer: null,
    _sliderTooltip: null,
  };
  constructor(pres, options, item, model: Model) {
    super();
    this._model = model;
    this._pres = pres;
    this._item = item;
  }

  public implementStyles(options, pos) {
    // const className = this.trigger('settingRequired', 'classsName') //TODO why this doesnt work
    this.fetchDivs(pos);
    this.initiateOptions(options);
    this.orientation = pos;
    if (this._elements._sliderTooltip.getBoundingClientRect().left < 0) {
      this._elements._sliderContainer.style.justifyContent = 'space-between';
      this._elements._sliderContainer.style.flexDirection = 'row-reverse';
      const min = Array.from(
        this._item.getElementsByClassName(
          'slider-min--vertical'
        ) as HTMLCollectionOf<HTMLElement>
      )[0];
      // min.style.transform = 'translate(150%, -120%)';
      min.style.left = '10px';
      this._elements._sliderScale.style.left = '-5px';
      this._elements._tooltipContainer.forEach((item) => {
        item.style.flexDirection = 'row';
        item.style.right = 'auto';

        item.style.left = '100%';
        Array.from(
          this._item.getElementsByClassName(
            'values'
          ) as HTMLCollectionOf<HTMLElement>
        ).forEach((item) => {
          item.style.justifyContent = 'flex-end';
        }); //TODO should be a nicer way
      });
    }
    return {
      slider: this._elements._slider,
      range: this._elements._sliderRange,
      handles: this._elements._sliderHandles,
      wrapper: this._elements._sliderMain,
    };
  }

  public showSlider(sliderMain, ori: Ori) {
    this._item.appendChild(sliderMain);
    const marginLeft = sliderMain.getBoundingClientRect().left;
    const marginTop = sliderMain.getBoundingClientRect().top;
    const offsetWidth = sliderMain.offsetWidth;
    const offsetHeight = sliderMain.offsetHeight;
    const handles = this.fetchHTMLEl('slider-handle', false);
    return { marginLeft, marginTop, handles, offsetWidth, offsetHeight };
  }

  private fetchHTMLEl(
    className: string,
    single: boolean,
    elem: HTMLElement = this._item
  ): HTMLElement | HTMLElement[] {
    const item = Array.from(
      elem.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>
    );

    if (single) {
      return item[0];
    } else {
      return item;
    }
  }

  private fetchDivs(orientation) {
    this._elements._sliderMain = Array.from(
      this._item.getElementsByClassName(
        `${this._model._settings.className}-main`
      ) as HTMLCollectionOf<HTMLElement>
    )[0];
    this._elements._slider = Array.from(
      this._item.getElementsByClassName(
        this._model._settings.className
      ) as HTMLCollectionOf<HTMLElement>
    )[0];
    this._elements._sliderRange = Array.from(
      this._item.getElementsByClassName(
        `${this._model._settings.className}-range`
      ) as HTMLCollectionOf<HTMLElement>
    )[0];
    this._elements._sliderHandles = Array.from(
      this._item.getElementsByClassName(
        `${this._model._settings.className}-handle--${orientation}`
      ) as HTMLCollectionOf<HTMLElement>
    );

    this._elements._sliderTooltip = Array.from(
      this._item.getElementsByClassName(
        `tooltip--${orientation}`
      ) as HTMLCollectionOf<HTMLElement>
    )[0];

    this._elements._sliderContainer = Array.from(
      this._item.getElementsByClassName(
        `${this._model._settings.className}-container`
      ) as HTMLCollectionOf<HTMLElement>
    )[0];

    this._elements._tooltipContainer = Array.from(
      this._item.getElementsByClassName(
        `tooltipContainer`
      ) as HTMLCollectionOf<HTMLElement>
    );
    this._elements._sliderScale = Array.from(
      this._item.getElementsByClassName(
        `slider-marker`
      ) as HTMLCollectionOf<HTMLElement>
    )[0];
    this._elements._sliderTooltipContainers = Array.from(
      this._item.getElementsByClassName(
        'tooltipContainer'
      ) as HTMLCollectionOf<HTMLElement>
    );
    const valueDivs: { div: HTMLElement; value: number }[] = Array.from(
      this._item.getElementsByClassName('jsSlider-clickable')
    ).map((item: HTMLElement) => {
      return Object.create({ div: item, value: item.textContent });
    });

    this.valueDivs = valueDivs;
    this.valueDivsArray = valueDivs.map((item) => {
      return item.value;
    });
  }

  private initiateOptions(options) {
    for (const option of Object.keys(options)) {
      if (typeof options[option] === 'object') {
        for (const [i, j] of Object.entries(options[option])) {
          if (option.toString().includes('slider')) {
            this._elements._slider.style[i] = j;
          } else if (option.toString().includes('progressBar')) {
            this._elements._sliderRange.style[i] = j;
          } else if (option.toString().includes('markUp')) {
            this._elements._slider.style[i] = j;
          } else if (option.toString().includes('handle')) {
            for (const handle of this._elements._sliderHandles) {
              handle.style[i] = j;
            }
          }
        }
      }
    }
  }

  public refreshCoords(data) {
    const shiftX = data.shiftX;
    const pinPoints = this.valueDivsArray;
    let newLeft: string;
    let dataObject;
    let handle: HTMLElement;
    let direction: string;
    let widthOrHeight: string;
    if (this._model._settings.orientation == 'vertical') {
      direction = 'top';
      widthOrHeight = 'height';
    } else if (this._model._settings.orientation == 'horizontal') {
      direction = 'left';
      widthOrHeight = 'width';
    }
    if (this._model._settings.type == 'single') {
      handle = this._elements._sliderHandles[0];
    } else if (this._model._settings.type == 'double') {
      handle = data.target;
    }

    const range = this._elements._sliderRange;

    const toolTip = this.fetchHTMLEl(
      `tooltip--${this.orientation}`,
      true,
      handle
    ) as HTMLDivElement;
    const newCoords = Object.assign(data, {
      shiftX: shiftX,
      newLeft: newLeft,
      pinPoints: pinPoints,
    });
    let pin;

    if (data.clicked) {
      dataObject = this.reactOnClick(newCoords);
      if (dataObject) {
        newLeft = dataObject.newLeft;
        pin = dataObject.pin;
      } else {
        return false;
      }
    } else {
      dataObject = this.reactOnDrag(newCoords);

      newLeft = dataObject.newLeft;
      pin = dataObject.pin;
    }

    handle.style[direction] = newLeft + 'px';

    if (this._model._settings.type == 'double') {
      this.rangeInterval(data.mainAxis);
    } else {
      range.style[widthOrHeight] = newLeft + 'px';
    }

    const value = numberOfDigits(data.value);
    handle.dataset.value = value;
    toolTip.textContent = value;
    return;

    // toolTip.textContent = data.value;
  }

  private reactOnDrag(data) {
    let direction = '0';
    let widthOrHeight = '';
    let newLeft = data.newLeft;
    let margin: number;
    let value: number;
    if (data.mainAxis == 'x') {
      direction = 'left';
      widthOrHeight = data.width;
      margin = data.marginLeft;
    } else {
      direction = 'top';
      widthOrHeight = data.height;
      margin = data.marginTop;
    }

    const handle = data.target;
    const handleWidth = handle.offsetWidth;
    const handleHeight = handle.offsetHeight;
    const range = this._elements._sliderRange;
    const toolTip = this._elements._sliderTooltip;

    if (data.value == 0) {
      range.style[widthOrHeight] = '0';
    }
    // const pin = this.matchHandleAndPin(data.value)
    // let neededCoords = pin.getBoundingClientRect()[direction]

    // newLeft = neededCoords - margin - handleHeight / 2
    // if (data.mainAxis == 'x') {
    if (data.altDrag) {
      newLeft = data.main - data.shiftX;
    } else {
      newLeft += handle.offsetWidth / 2;
      // if (pin.className.includes('values')) {
      //   if (pin.className.includes('slider-min')) {
      //     newLeft = 0
      //   } else if (pin.className.includes('slider-max')) {
      //     newLeft = data.mainMax - handleWidth / 2
      //   }
      // }
    }
    // }

    return {
      newLeft,
      // pin,
      value,
    };
  }

  private reactOnClick(data) {
    if (this._model._settings.type == 'double') {
      return false;
    }
    const handle = this._elements._sliderHandles[0];
    const handleWidth = handle.offsetWidth;
    const pin = data.target.parentNode;
    const pinPointsValues = this.valueDivsArray;
    let newLeft: number;
    const { offset, widthOrHeight, direction, margin } = this.convertValues({
      mainAxis: 'x',
    });
    newLeft =
      pin.getBoundingClientRect()[direction] - data[margin] - handleWidth / 2;

    handle.style[direction] = newLeft + 'px';
    this._elements._sliderRange.style[widthOrHeight] = newLeft + 'px';
    this._elements._sliderTooltip.textContent = data.value;

    if (pinPointsValues.includes(data.value)) {
      for (const i of this.valueDivs) {
        const item = i as { div: HTMLElement; value: number };
        if (item.value == data.value) {
          for (const i of this.valueDivs) {
            // TODO is there a better way to do this?
            const item = i as { div: HTMLElement; value: number };
            item.div.classList.remove('jsSlider-clicked');
          }
          item.div.classList.add('jsSlider-clicked');
        }
      }
    }
    return { newLeft, pin };
  }

  public rangeInterval(mainAxis) {
    let offset: string;
    let widthOrHeight: string;
    let direction: string;
    if (mainAxis == 'x') {
      offset = 'offsetLeft';
      widthOrHeight = 'width';
      direction = 'left';
    } else if (mainAxis == 'y') {
      offset = 'offsetTop';
      widthOrHeight = 'height';
      direction = 'top';
    }

    const minOffset = this._elements._sliderHandles[0][offset];
    // if (this._elements._sliderHandles[1]) {

    // }
    const maxOffset = this._elements._sliderHandles[1]?.[offset] || null;

    const length = Math.abs(minOffset - maxOffset);
    const handleOffset = Math.min(minOffset, maxOffset);

    this._elements._sliderRange.style[direction] = handleOffset + 'px';
    this._elements._sliderRange.style[widthOrHeight] = length + 'px';
  }

  public showValue(target, value) {
    const tool = target.getElementsByClassName('tooltip')[0];

    tool.textContent = value;
  }

  private matchHandleAndPin(value) {
    const pinPoints = this.valueDivsArray;
    let minDiff = Infinity;
    let pinValue: number;
    for (const i of pinPoints) {
      const leastDiff = Math.abs(value - Number(i));
      if (leastDiff < minDiff) {
        minDiff = leastDiff;
        pinValue = Number(i);
      }
    }
    let pin;

    for (const i of this.valueDivs) {
      const item = i as { div: HTMLElement; value: number };
      if (pinValue == item.value) {
        pin = item.div;
        return pin;
      }
    }
  }

  private convertValues(valueObject: Object) {
    for (const [key, value] of Object.entries(valueObject))
      if (key == 'orientation' || key == 'mainAxis') {
        let offset: string;
        let widthOrHeight: string;
        let direction: string;
        let margin: string;
        if (value == 'horizontal' || value == 'x') {
          offset = 'offsetLeft';
          widthOrHeight = 'width';
          direction = 'left';
          margin = 'marginLeft';
        } else if (value == 'vertical' || value == 'y') {
          offset = 'offsetTop';
          widthOrHeight = 'height';
          direction = 'top';
          margin = 'marginTop';
        }

        return { offset, widthOrHeight, direction, margin };
      }
  }
}
//shortens value to format  e.g.'1.3k'
function numberOfDigits(x) {
  let value: string;
  if (x.toString().length > 3) {
    value = (x / 1000).toFixed(1) + 'k';
  } else {
    value = x;
  }

  return value;
}
export { Ori };
export default View;
