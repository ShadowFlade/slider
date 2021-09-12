import EventMixin from './eventemitter';
import { Pres } from './pres';
import { shortenValue } from './utils';
import { Type, Ori, ICoords } from './model';
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

class View extends EventMixin {
  divsContainingValues: { div: HTMLElement; value: string }[];

  valuesFromDivs: string[];

  offsetArray: number[];

  pinsCoordinatesItems: { div: HTMLElement; offset: number }[];

  pinsCoordinates: number[];

  temp: { [key: string]: string | number };

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

  constructor(pres: Pres, options: Record<string, unknown>, item: HTMLElement) {
    super();
    this._pres = pres;
    this._item = item;
    console.log('🚀 ~ View ~ constructor ~ this._item', this._item);
  }

  public implementStyles(options: Record<string, unknown>): {
    slider: HTMLElement;
    range: HTMLElement;
    handles: HTMLElement[];
    wrapper: HTMLElement;
  } {
    this.initiateOptions(options);
    const tooltipLeftOffset =
      this._elements._tooltips[0].getBoundingClientRect().left;
    if (tooltipLeftOffset < 0) {
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

  public renderElement(element: Node, where: HTMLElement = this._item): void {
    where.append(element);
  }

  public getOffsetsAndLimits(): Record<string, number> {
    const { offsetLength } = this.temp;
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
    elem: ParentNode = this._item
  ): HTMLElement | HTMLElement[] {
    const items = elem.querySelectorAll(`.${className}`);
    const nodes = [...items];

    if (single) {
      return nodes[0] as HTMLElement;
    }
    return nodes as HTMLElement[];
  }

  public fetchDivs(orientation: Ori, defClassName: string): void {
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
    // TODO Array.from
    const divsContainingValues: { div: HTMLElement; value: string }[] =
      Array.from(this._item.getElementsByClassName('jsSlider-clickable')).map(
        (item: HTMLElement) => {
          return {
            div: item,
            value: item.textContent,
          };
        }
      );

    this.divsContainingValues = divsContainingValues;
    this.valuesFromDivs = divsContainingValues.map((item) => item.value);
    // console.log(this.temp);

    const { offset } = this.temp;
    const pinsCoordinatesItems = Array.from(
      // TODO Array.from
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
        Object.entries(options[option]).forEach(([i, j]) => {
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
        });
      }
    });
  }

  public refreshCoords(data: ICoords, ori: Ori, type: Type): void {
    const isClickedOnPin = data.clicked;
    const isNormallyDragged = data.altDrag;
    let newLeft: number;
    let coordsForUse;
    let handle: HTMLElement;
    let value = data.value;
    const { widthOrHeight, direction } = this.temp;
    if (type === 'single') {
      handle = this._elements._handles[0];
    } else if (type === 'double') {
      handle = data.target;
    }
    const range = this._elements._range;
    const toolTip = this.fetchHTMLEl(`tooltip`, true, handle) as HTMLDivElement;
    const newCoords = { ...data };
    if (isClickedOnPin) {
      coordsForUse = this.reactOnClick(newCoords, ori, type);
      newLeft = coordsForUse.newLeft;
    } else if (isNormallyDragged) {
      coordsForUse = this.reactOnDrag(newCoords);
      newLeft = coordsForUse.newLeft;
    } else {
      const { newLeft: nl, value: v } = this.pinnedDrag(newCoords);
      newLeft = nl;
      value = v;
    }
    handle.style[direction] = newLeft + 'px';
    if (type === 'double') {
      this.rangeInterval();
    } else {
      range.style[widthOrHeight] = newLeft + handle.offsetWidth / 2 + 'px';
    }
    if (!isClickedOnPin) {
      handle.dataset.value = String(value);
      toolTip.textContent = shortenValue(Number(value));
    }
  }

  private reactOnDrag(data) {
    let newLeft: number;
    const shift = data.shift || 0;
    let value: number;
    const { widthOrHeight } = this.temp;
    const handle = data.target;
    const range = this._elements._range;
    if (data.value === 0) {
      range.style[widthOrHeight] = '0';
    }
    const isNormallyDragged = data.altDrag;
    if (isNormallyDragged) {
      newLeft = data.main - shift;
    } else {
      newLeft += handle.offsetWidth / 2;
    }
    return {
      newLeft,
      value,
    };
  }

  private pinnedDrag(data): { newLeft: number; value: number } {
    let newLeft: number;
    const handleWidth = this._elements._handles[0].offsetWidth;
    // eslint-disable-next-line prefer-const
    let { direction, margin } = this.temp;
    margin = data[margin] as number;
    const pin = this.matchHandleAndPin(data.main);
    const value = Number(pin.dataset.value);
    const pinCoords = pin.getBoundingClientRect()[direction];
    newLeft = pinCoords - margin - handleWidth / 2;
    if (pin.className.includes('slider-min')) {
      newLeft = 0;
    } else if (pin.className.includes('slider-max')) {
      newLeft = data.mainMax - handleWidth / 2;
    }

    return { newLeft, value };
  }

  private reactOnClick(data, ori: Ori, type: Type) {
    if (type === 'double') {
      return false;
    }

    const handle = this._elements._handles[0];
    const handleWidth = handle.offsetWidth;
    const pin = data.target.parentElement;
    const pinPointsValues = this.valuesFromDivs;
    const toolTip = this._elements._tooltips[0];
    const { widthOrHeight, direction, margin } = this.temp;
    const pinCoords = pin.getBoundingClientRect()[direction];
    const newLeft = pinCoords - data[margin] - handleWidth / 2;
    handle.style[direction] = newLeft + 'px';
    this._elements._range.style[widthOrHeight] = newLeft + 'px';
    toolTip.textContent = data.value;
    if (pinPointsValues.includes(data.value)) {
      this.divsContainingValues.forEach((i) => {
        const item = i as { div: HTMLElement; value: string };
        if (item.value === data.value) {
          this.divsContainingValues.forEach(() => {
            const item2 = i as { div: HTMLElement; value: string };
            item2.div.style.color = '';
          });
          item.div.style.color = String(this.temp.pinTextColor);
        }
      });
    }
    return { newLeft, pin };
  }

  public rangeInterval(): void {
    const handle1 = this._elements._handles[0];
    const handle2 = this._elements._handles[1];
    const { widthOrHeight, direction } = this.temp;
    const minOffset = parseFloat(handle1.style[direction]);
    let maxOffset: number | null;
    if (handle2) {
      maxOffset = parseFloat(handle2.style[direction]); // only works if style.left is in pxs
    } else {
      maxOffset = null;
    }
    const length = Math.abs(minOffset - maxOffset);
    const handleOffset = Math.min(minOffset, maxOffset);
    this._elements._range.style[direction] = handleOffset + 'px';

    this._elements._range.style[widthOrHeight] =
      length + handle1.offsetWidth / 2 + 'px';
  }

  public showValue(target: HTMLElement, value: number): void {
    const tool = target.getElementsByClassName('tooltip')[0];
    target.dataset.value = String(Math.abs(value));
    tool.textContent = String(Math.abs(value));
  }

  private matchHandleAndPin(main: number) {
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
      if (pinOffset === item.offset) {
        pin = item.div;
        return pin;
      }
      return false;
    });
    return pin;
  }
}

export { Ori };
export default View;
