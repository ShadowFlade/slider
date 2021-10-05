type IOptions = {
  className: string;
  orientation: string;
  type: string;
  stepSize: number;
  maxValue: number;
  minValue: number;
  toolTip: boolean;
  marker: boolean;
  progressBarColor: string;
  sliderColor: string;
  sliderWidth: number;
  sliderHeight: number;
  pinTextColor: string;
  toolTextColor: string;
};
type IPlugin = {
  (options?: Partial<IOptions>): IPlugin;
  tilt: () => IPlugin;
  range: () => IPlugin;
  scale: () => IPlugin;
  bar: () => IPlugin;
  tip: () => IPlugin;
  isRange: () => boolean;
  setLimits: (valMin: number, valMax: number) => IPlugin;
  setValue: (value: number, numOfHandle: number | string) => IPlugin;
  setStep: (str: string) => IPlugin;
};
class Panel {
  item: HTMLElement;

  elements: HTMLElement[];

  to: HTMLInputElement;

  name: string;

  slider: IPlugin;

  constructor(nameOfSliderDiv: string, slider: IPlugin) {
    this.fetchItem(nameOfSliderDiv);
    this.name = nameOfSliderDiv;
    this.elements = [];
    this.slider = slider;
  }

  private fetchItem(name: string) {
    this.item = document.querySelector(name);
  }

  public bindToDiv(nameOfElement: string, func: string): boolean {
    const element: HTMLInputElement = document.querySelector(nameOfElement);
    this.bindCheckboxs();
    this.elements.push(element);
    if (element.type === 'checkbox') {
      element.onchange = this.slider[func];

      return true;
    }
    return false;
  }

  private bindCheckboxs() {
    const onChange = () => {
      this.checkForRange();
    };
    this.elements.forEach((item) => {
      item.addEventListener('change', onChange);
    });
  }

  private checkForRange() {
    if (this.slider.isRange()) {
      this.to.disabled = false;
    } else {
      this.to.disabled = true;
    }
  }

  public bindMinMax(minDivID: string, maxDivID: string): void {
    const el1: HTMLInputElement = document.querySelector(minDivID);
    const el2: HTMLInputElement = document.querySelector(maxDivID);

    [el1, el2].forEach((item: HTMLInputElement) => {
      item.onkeydown = (e) => {
        if (e.keyCode === 13) {
          this.slider.setLimits(Number(el1.value), Number(el2.value));
        }
      };
    });
  }

  public bindFromTo(fromDivID: string, toDivID: string): void {
    const el1: HTMLInputElement = document.querySelector(fromDivID);
    const el2: HTMLInputElement = document.querySelector(toDivID);
    this.to = el2;
    el1.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.slider.setValue(Number(el1.value), 1);
      }
    };
    el2.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.slider.setValue(Number(el2.value), 2);
      }
    };
    if (this.to) {
      this.checkForRange();
    }
  }

  public bindStep(stepDivID: string): void {
    const el: HTMLInputElement = document.querySelector(stepDivID);
    el.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.slider.setStep(el.value);
      }
    };
  }
}

export { Panel, IPlugin, IOptions };
