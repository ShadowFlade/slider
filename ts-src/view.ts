import Model, { ICoords } from './model';
import EventMixin from './eventemitter';
import Pres from './pres';
import { Type, Ori } from './model';
type Elements<T> = {
  _slider: T;
  _sliderMain: T;
  _sliderScale: T;
  _sliderRange: T;
  _sliderTooltipContainers: T[];
  _sliderHandles: T[];
  _sliderContainer: T;
  _sliderTooltip: T[];
  _sliderTooltipSticks: T[];
  _sliderPins: T[];
};
type Fetch = {
  (className: string, single: true, item?): HTMLElement;
  (className: string, single: false, item?): HTMLElement[];
};
class View extends EventMixin {
  valueDivs: Object[];
  valueDivsArray: number[];
  offsetArray: number[];
  offsets: { div: HTMLElement; offset: number }[];
  offsetsNums: number[];
  _temp: { [key: string]: string | number };
  _pres: Pres;
  _item: HTMLElement;
  orientation: string;
  public _elements: Elements<HTMLElement> = {
    _slider: null,
    _sliderMain: null,
    _sliderScale: null,
    _sliderRange: null,
    _sliderTooltipContainers: [],
    _sliderHandles: [],
    _sliderContainer: null,
    _sliderTooltip: [],
    _sliderTooltipSticks: [],
    _sliderPins: [],
  };

  constructor(pres, options, item) {
    super();
    this._pres = pres;
    this._item = item;
  }

  public implementStyles(options, pos) {
    this.initiateOptions(options);
    this.orientation = pos;

    if (this._elements._sliderTooltip[0].getBoundingClientRect().left < 0) {
      this._elements._sliderContainer.style.justifyContent = 'space-between';
      this._elements._sliderContainer.style.flexDirection = 'row-reverse';
      const min = this.fetchHTMLEl('slider-min--vertical', true) as HTMLElement;
      min.style.left = '10px';
      this._elements._sliderScale.style.left = '-5px';
      this._elements._sliderTooltipContainers.forEach((item) => {
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

  public showSlider(sliderMain: Node, ori: Ori) {
    const main = this._item.appendChild(sliderMain as Node) as HTMLElement;
    const marginLeft = main.getBoundingClientRect().left;
    const marginTop = main.getBoundingClientRect().top;
    const offsetWidth = main.offsetWidth;
    const offsetHeight = main.offsetHeight;
    const handles = this.fetchHTMLEl('slider-handle', false);
    return { marginLeft, marginTop, handles, offsetWidth, offsetHeight };
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
    this._elements._sliderRange = this.fetchHTMLEl(
      `${defClassName}-range`,
      true
    ) as HTMLElement;
    this._elements._sliderHandles = this.fetchHTMLEl(
      `${defClassName}-handle--${orientation}`,
      false
    ) as HTMLElement[];
    // console.log(this._elements._sliderHandles, 'fetch divs');
    this._elements._sliderTooltip = this.fetchHTMLEl(
      `tooltip`,
      false
    ) as HTMLElement[];
    this._elements._sliderContainer = this.fetchHTMLEl(
      `${defClassName}-container`,
      true
    ) as HTMLElement;
    this._elements._sliderScale = this.fetchHTMLEl(
      `${defClassName}-marker`,
      true
    ) as HTMLElement;
    this._elements._sliderTooltipContainers = this.fetchHTMLEl(
      'tooltipContainer',
      false
    ) as HTMLElement[];
    this._elements._sliderPins = this.fetchHTMLEl(
      'jsSlider-clickable',
      false
    ) as HTMLElement[];
    const valueDivs: { div: HTMLElement; value: number }[] = Array.from(
      this._item.getElementsByClassName('jsSlider-clickable')
    ).map((item: HTMLElement) => {
      return Object.create({
        div: item,
        value: item.textContent,
      });
    });

    this.valueDivs = valueDivs;
    this.valueDivsArray = valueDivs.map((item) => {
      return item.value;
    });
    let offset;
    if (orientation == 'horizontal') {
      offset = 'offsetLeft';
    } else {
      offset = 'offsetTop';
    }
    const offsets = Array.from(
      this._item.getElementsByClassName('jsOffset')
    ).map((item: HTMLElement) => {
      return { div: item, offset: item[offset] };
    });

    const offsetsNums = offsets.map((item) => {
      return item.offset;
    });
    this.offsets = offsets;
    this.offsetsNums = offsetsNums;
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
          } else if (option.toString().includes('tool')) {
            for (const tool of this._elements._sliderTooltip) {
              console.log(i, j, 'ij');
              tool.style[i] = j;
            }
          }
        }
      }
    }
  }

  public refreshCoords(data, ori: Ori, type: Type) {
    const shiftX = data.shiftX;
    const pinPoints = this.valueDivsArray;
    let newLeft: string;
    let dataObject;
    let handle: HTMLElement;
    let direction: string;
    let widthOrHeight: string;
    let value = data.value;
    if (ori == 'vertical') {
      direction = 'top';
      widthOrHeight = 'height';
    } else if (ori == 'horizontal') {
      direction = 'left';
      widthOrHeight = 'width';
    }
    if (type == 'single') {
      handle = this._elements._sliderHandles[0];
    } else if (type == 'double') {
      handle = data.target;
    }
    const range = this._elements._sliderRange;
    const toolTip = this.fetchHTMLEl(`tooltip`, true, handle) as HTMLDivElement;
    const newCoords = Object.assign(data, {
      shiftX: shiftX,
      newLeft: newLeft,
      pinPoints: pinPoints,
    });
    let pin;

    if (data.clicked) {
      dataObject = this.reactOnClick(newCoords, ori, type);
      if (dataObject) {
        newLeft = dataObject.newLeft;
        pin = dataObject.pin;
      } else {
        return false;
      }
    } else {
      if (data.altDrag) {
        dataObject = this.reactOnDrag(newCoords, ori, type);
        newLeft = dataObject.newLeft;
        pin = dataObject.pin;
      } else {
        let { newLeft: nl, value: v } = this.pinnedDrag(data, ori, type);
        newLeft = nl;
        value = v;
      }
    }
    handle.style[direction] = newLeft + 'px';

    if (type == 'double') {
      this.rangeInterval(ori);
    } else {
      range.style[widthOrHeight] = newLeft + 'px';
    }
    value = numberOfDigits(value);
    handle.dataset.value = value;
    toolTip.textContent = value;
    return;
  }

  private reactOnDrag(data, ori: Ori, type: string) {
    let direction = '0';
    let widthOrHeight = '';
    let newLeft = data.newLeft;
    let margin: number;
    let value: number;
    if (ori == 'horizontal') {
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

    if (data.altDrag) {
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
    let widthOrHeight = '';
    let newLeft;
    let margin: number;
    let value: number;
    const handleHeight = this._elements._sliderHandles[0].offsetWidth;
    if (ori == 'horizontal') {
      direction = 'left';
      widthOrHeight = data.width;
      margin = data.marginLeft;
    } else {
      direction = 'top';
      widthOrHeight = data.height;
      margin = data.marginTop;
    }
    const pin = this.matchHandleAndPin(data.main, ori);

    value = pin.dataset.value;
    let neededCoords = pin.getBoundingClientRect()[direction];
    newLeft = neededCoords - margin - handleHeight / 2;
    if (pin.className.includes('values')) {
      if (pin.className.includes('slider-min')) {
        newLeft = 0;
      } else if (pin.className.includes('slider-max')) {
        newLeft = data.mainMax - handleHeight / 2;
      }
    }

    return { newLeft, value };
  }
  private reactOnClick(data, ori, type) {
    if (type == 'double') {
      return false;
    }
    const handle = this._elements._sliderHandles[0];
    const handleWidth = handle.offsetWidth;
    const pin = data.target.parentElement;
    const pinPointsValues = this.valueDivsArray;
    let newLeft: number;
    const { offset, widthOrHeight, direction, margin } = this.convertValues({
      mainAxis: 'x',
    });
    newLeft =
      pin.getBoundingClientRect()[direction] - data[margin] - handleWidth / 2;
    handle.style[direction] = newLeft + 'px';
    this._elements._sliderRange.style[widthOrHeight] = newLeft + 'px';
    this._elements._sliderTooltip[0].textContent = data.value;

    if (pinPointsValues.includes(data.value)) {
      for (const i of this.valueDivs) {
        const item = i as { div: HTMLElement; value: number };
        if (item.value == data.value) {
          for (const i of this.valueDivs) {
            const item = i as { div: HTMLElement; value: number };
            item.div.style.color = '';
          }
          item.div.style.color = String(this._temp.pinText);
        }
      }
    }
    return { newLeft, pin };
  }

  public rangeInterval(orientation) {
    let offset: string;
    let widthOrHeight: string;
    let direction: string;
    if (orientation == 'horizontal') {
      offset = 'offsetLeft';
      widthOrHeight = 'width';
      direction = 'left';
    } else if (orientation == 'vertical') {
      offset = 'offsetTop';
      widthOrHeight = 'height';
      direction = 'top';
    }

    const minOffset = parseFloat(
      this._elements._sliderHandles[0].style[direction]
    );
    let maxOffset;
    if (this._elements._sliderHandles[1]) {
      maxOffset =
        parseFloat(this._elements._sliderHandles[1].style[direction]) || null; //only works if style.left is in pxs
    } else {
      maxOffset = null;
    }

    const length = Math.abs(minOffset - maxOffset);
    const handleOffset = Math.min(minOffset, maxOffset);

    this._elements._sliderRange.style[direction] = handleOffset + 'px';
    this._elements._sliderRange.style[widthOrHeight] = length + 'px';
  }

  public showValue(target, value) {
    const tool = target.getElementsByClassName('tooltip')[0];
    tool.textContent = Math.abs(value); //Math.abs is a hack and it shouldnt be there
  }

  private matchHandleAndPin(main, ori: Ori) {
    let offset;
    const offsets = this.offsets;
    const offsetsNums = this.offsetsNums;
    if (ori == 'horizontal') {
      offset = 'offsetLeft';
    } else {
      offset = 'offsetTop';
    }

    let minDiff = Infinity;
    let pinOffset: number;
    for (const offset of offsetsNums) {
      const leastDiff = Math.abs(main - Number(offset));
      if (leastDiff < minDiff) {
        minDiff = leastDiff;
        pinOffset = Number(offset);
      }
    }
    let pin;

    for (const i of offsets) {
      const item = i;

      if (pinOffset == item.offset) {
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
