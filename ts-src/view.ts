import Model, { ICoords } from './model';
import EventMixin from './eventemitter';
import Pres from './pres';
import { Type, Ori } from './model';
type Elements<T> = {
  _slider: T;
  _sliderMain: T;
  _scale: T;
  _range: T;
  _tooltipContainers: T[];
  _handles: T[];
  _sliderContainer: T;
  _tooltips: T[];
  _tooltipsSticks: T[];
  _pins: T[];
};
type Fetch = {
  (className: string, single: true, item?): HTMLElement;
  (className: string, single: false, item?): HTMLElement[];
};
class View extends EventMixin {
  divsContainingValues: Object[];
  valuesFromDivs: number[];
  offsetArray: number[];
  pinsCoordinatesItems: { div: HTMLElement; offset: number }[];
  pinsCoordinates: number[];
  _temp: { [key: string]: string | number };
  _pres: Pres;
  _item: HTMLElement;
  orientation: string;
  public _elements: Elements<HTMLElement> = {
    _slider: null,
    _sliderMain: null,
    _sliderContainer: null,
    _scale: null,
    _range: null,
    _tooltipContainers: [],
    _handles: [],
    _tooltips: [],
    _tooltipsSticks: [],
    _pins: [],
  };

  constructor(pres, options, item) {
    super();
    this._pres = pres;
    this._item = item;
  }
  public implementStyles(options, pos) {
    this.initiateOptions(options);
    this._temp.orientation = pos;
    const tooltipLeft =
      this._elements._tooltips[0].getBoundingClientRect().left;
    if (tooltipLeft < 0) {
      this._elements._sliderContainer.classList.add(
        'slider-container--vertical--corrected'
      );
      const min = this.fetchHTMLEl('slider-min--vertical', true) as HTMLElement;
      min.style.left = '10px';
      this._elements._tooltipContainers.forEach((item) => {
        item.classList.add('tooltipContainer--vertical--corrected');
      });
    }
    const valuesDivs = this.fetchHTMLEl('values', false) as HTMLElement[];
    valuesDivs.forEach((div) => {
      div.classList.add('values--corrected');
    });
    return {
      slider: this._elements._slider,
      range: this._elements._range,
      handles: this._elements._handles,
      wrapper: this._elements._sliderMain,
    };
  }

  public showSlider(sliderMain: Node, ori: Ori) {
    const main = this._item.appendChild(sliderMain as Node) as HTMLElement;
  }
  public getVisuals(ori: Ori) {
    const { offsetLength } = this.convertValues(ori);
    const mainMax =
      this._elements._sliderMain[offsetLength] -
      this._elements._handles[0][offsetLength] / 2;
    const mainMin = this._elements._handles[0][offsetLength] / 2;
    const marginTop = this._elements._slider.getBoundingClientRect().top;
    const marginLeft = this._elements._slider.getBoundingClientRect().left;
    return {
      mainMax,
      mainMin,
      marginTop,
      marginLeft,
    };
  }
  public fetchHTMLEl(
    className: string,
    single: boolean,
    elem: HTMLElement = this._item
  ): HTMLElement | HTMLElement[] {
    const item = Array.from(
      elem.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>
    );

    if (single) {
      return item[0] as HTMLElement;
    } else {
      return item as HTMLElement[];
    }
  }

  public fetchDivs(orientation: Ori, defClassName: string) {
    this._elements._sliderMain = this.fetchHTMLEl(
      `${defClassName}-main`,
      true
    ) as HTMLElement;
    this._elements._slider = this.fetchHTMLEl(
      defClassName,
      true
    ) as HTMLElement;
    this._elements._range = this.fetchHTMLEl(
      `${defClassName}-range`,
      true
    ) as HTMLElement;
    this._elements._handles = this.fetchHTMLEl(
      `${defClassName}-handle--${orientation}`,
      false
    ) as HTMLElement[];
    this._elements._tooltips = this.fetchHTMLEl(
      `tooltip`,
      false
    ) as HTMLElement[];
    this._elements._sliderContainer = this.fetchHTMLEl(
      `${defClassName}-container`,
      true
    ) as HTMLElement;
    this._elements._scale = this.fetchHTMLEl(
      `${defClassName}-marker`,
      true
    ) as HTMLElement;
    this._elements._tooltipContainers = this.fetchHTMLEl(
      'tooltipContainer',
      false
    ) as HTMLElement[];
    this._elements._pins = this.fetchHTMLEl(
      'jsSlider-clickable',
      false
    ) as HTMLElement[];

    const divsContainingValues: { div: HTMLElement; value: number }[] =
      Array.from(this._item.getElementsByClassName('jsSlider-clickable')).map(
        (item: HTMLElement) => {
          return Object.create({
            div: item,
            value: item.textContent,
          });
        }
      );

    this.divsContainingValues = divsContainingValues;
    this.valuesFromDivs = divsContainingValues.map((item) => {
      return item.value;
    });
    const { offset } = this.convertValues(orientation);
    const pinsCoordinatesItems = Array.from(
      this._item.getElementsByClassName('jsOffset')
    ).map((item: HTMLElement) => {
      return { div: item, offset: item[offset] };
    });

    const pinsCoordinates = pinsCoordinatesItems.map((item) => {
      return item.offset;
    });
    this.pinsCoordinatesItems = pinsCoordinatesItems;
    this.pinsCoordinates = pinsCoordinates;
  }

  private initiateOptions(options) {
    Object.keys(options).forEach((option) => {
      if (typeof options[option] === 'object') {
        for (const [i, j] of Object.entries(options[option])) {
          if (option.toString().includes('slider')) {
            this._elements._slider.style[i] = j;
          } else if (option.toString().includes('progressBar')) {
            this._elements._range.style[i] = j;
          } else if (option.toString().includes('markUp')) {
            this._elements._slider.style[i] = j;
          } else if (option.toString().includes('handle')) {
            this._elements._handles.forEach((handle) => {
              handle.style[i] = j;
            });
          } else if (option.toString().includes('tool')) {
            this._elements._tooltips.forEach((tool) => {
              tool.style[i] = j;
            });
          }
        }
      }
    });
  }

  public refreshCoords(data, ori: Ori, type: Type) {
    const isClickedOnPin = data.clicked;
    const isNormallyDragged = data.altDrag;
    let newLeft: number;
    let coordsForUse;
    let handle: HTMLElement;
    let value = data.value;
    const { widthOrHeight, direction } = this.convertValues(ori);
    if (type == 'single') {
      handle = this._elements._handles[0];
    } else if (type == 'double') {
      handle = data.target;
    }
    const range = this._elements._range;
    const toolTip = this.fetchHTMLEl(`tooltip`, true, handle) as HTMLDivElement;
    const newCoords = Object.assign({}, data);
    let pin: HTMLElement;
    if (isClickedOnPin) {
      coordsForUse = this.reactOnClick(newCoords, ori, type);
      newLeft = coordsForUse.newLeft;
      pin = coordsForUse.pin;
    } else {
      if (isNormallyDragged) {
        coordsForUse = this.reactOnDrag(newCoords, ori, type);
        newLeft = coordsForUse.newLeft;
        pin = coordsForUse.pin;
      } else {
        let { newLeft: nl, value: v } = this.pinnedDrag(newCoords, ori, type);
        newLeft = nl;
        value = v;
      }
    }
    handle.style[direction] = newLeft + 'px';
    if (type == 'double') {
      this.rangeInterval(ori);
    } else {
      range.style[widthOrHeight] = newLeft + handle.offsetWidth / 2 + 'px';
    }
    handle.dataset.value = value;
    value = shortenValue(value);
    toolTip.textContent = value;
    return;
  }

  private reactOnDrag(data, ori: Ori, type: string) {
    let newLeft = data.newLeft;
    let value: number;
    const { widthOrHeight } = this.convertValues(ori);
    const handle = data.target;
    const range = this._elements._range;
    if (data.value == 0) {
      range.style[widthOrHeight] = '0';
    }
    const isNormallyDragged = data.altDrag;

    if (isNormallyDragged) {
      newLeft = data.main - data.shiftX;
    } else {
      newLeft += handle.offsetWidth / 2;
    }
    return {
      newLeft,
      value,
    };
  }
  private pinnedDrag(data, ori: Ori, type: Type) {
    let direction = '0';
    let newLeft: number;
    let margin: number;
    let value: string;
    const handleWidth = this._elements._handles[0].offsetWidth;
    if (ori == 'horizontal') {
      direction = 'left';
      margin = data.marginLeft;
    } else {
      direction = 'top';
      margin = data.marginTop;
    }
    const pin = this.matchHandleAndPin(data.main, ori);
    value = pin.dataset.value;
    let pinCoords = pin.getBoundingClientRect()[direction];
    newLeft = pinCoords - margin - handleWidth / 2;
    if (pin.className.includes('slider-min')) {
      newLeft = 0;
    } else if (pin.className.includes('slider-max')) {
      newLeft = data.mainMax - handleWidth / 2;
    }

    return { newLeft, value };
  }
  private reactOnClick(data, ori: Ori, type: Type) {
    if (type == 'double') {
      return false;
    }
    const handle = this._elements._handles[0];
    const handleWidth = handle.offsetWidth;
    const pin = data.target.parentElement;
    const pinPointsValues = this.valuesFromDivs;
    const toolTip = this._elements._tooltips[0];
    let newLeft: number;
    const { offset, widthOrHeight, direction, margin } =
      this.convertValues(ori);
    const pinCoords = pin.getBoundingClientRect()[direction];
    newLeft = pinCoords - data[margin] - handleWidth / 2;
    handle.style[direction] = newLeft + 'px';
    this._elements._range.style[widthOrHeight] = newLeft + 'px';
    toolTip.textContent = data.value;
    if (pinPointsValues.includes(data.value)) {
      this.divsContainingValues.forEach((i) => {
        const item = i as { div: HTMLElement; value: number };
        if (item.value == data.value) {
          this.divsContainingValues.forEach(() => {
            const item = i as { div: HTMLElement; value: number };
            item.div.style.color = '';
          });
          item.div.style.color = String(this._temp.pinTextColor);
        }
      });
    }
    return { newLeft, pin };
  }

  public rangeInterval(orientation) {
    const handle1 = this._elements._handles[0];
    const handle2 = this._elements._handles[1];
    const { offset, widthOrHeight, direction } =
      this.convertValues(orientation);
    const minOffset = parseFloat(handle1.style[direction]);
    let maxOffset: number | null;
    if (handle2) {
      maxOffset = parseFloat(handle2.style[direction]); //only works if style.left is in pxs
    } else {
      maxOffset = null;
    }
    const length = Math.abs(minOffset - maxOffset);
    const handleOffset = Math.min(minOffset, maxOffset);
    this._elements._range.style[direction] = handleOffset + 'px';
    this._elements._range.style[widthOrHeight] =
      length + handle1.offsetWidth / 2 + 'px';
  }

  public showValue(target, value) {
    const tool = target.getElementsByClassName('tooltip')[0];
    tool.textContent = Math.abs(value);
  }

  private matchHandleAndPin(main: number, ori: Ori) {
    const offsets = this.pinsCoordinatesItems;
    const offsetsNums = this.pinsCoordinates;
    let minDiff = Infinity;
    let pinOffset: number;
    offsetsNums.forEach((offset) => {
      const leastDiff = Math.abs(main - Number(offset));
      if (leastDiff < minDiff) {
        minDiff = leastDiff;
        pinOffset = Number(offset);
      }
    });
    let pin: HTMLElement;
    offsets.forEach((i) => {
      const item = i;
      if (pinOffset == item.offset) {
        pin = item.div;
        return pin;
      }
    });
    return pin;
  }
  public convertValues(orientation: string) {
    let offset: string;
    let widthOrHeight: string;
    let direction: string;
    let margin: string;
    let client: string;
    let offsetLength: string;
    if (orientation == 'horizontal') {
      offset = 'offsetLeft';
      widthOrHeight = 'width';
      direction = 'left';
      margin = 'marginLeft';
      client = 'clientX';
      offsetLength = 'offsetWidth';
    } else if (orientation == 'vertical') {
      offset = 'offsetTop';
      widthOrHeight = 'height';
      direction = 'top';
      margin = 'marginTop';
      client = 'clientY';
      offsetLength = 'offsetHeight';
    }
    return { offset, offsetLength, widthOrHeight, direction, margin, client };
  }
}

//shortens value to format  e.g.'1.3k'
function shortenValue(x) {
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
