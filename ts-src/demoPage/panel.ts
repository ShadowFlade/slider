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
  tilt: Function;
  range: Function;
  scale: Function;
  bar: Function;
  tip: Function;
  isRange: Function;
  setLimits: Function;
  setValue: Function;
  setStep: Function;
};
interface JQuery {
  slider: IPlugin;

  tilt: JQuery;
}

class Panel {
  item: HTMLElement;
  elements: HTMLElement[];
  to: HTMLInputElement;
  slider: JQuery;
  name: string;
  constructor(nameOfSliderDiv, slider) {
    this.item = document.querySelector(nameOfSliderDiv);
    this.name = nameOfSliderDiv;
    this.elements = [];
    if (this.to) {
      this.checkForRange();
    }
    this.slider = slider;
  }
  public bindToDiv(nameOfElement, func: string, nameOfElement2?) {
    console.log(this.slider);
    const element = document.querySelector(nameOfElement);
    this.elements.push(element);
    this.bindCheckboxs();
    if (element.type === 'checkbox') {
      element.onchange = $(this.name).slider[func];
      return true;
    }
  }
  private bindCheckboxs() {
    this.elements.forEach((item) => {
      item.addEventListener('change', () => {
        this.checkForRange();
      });
    });
  }

  private checkForRange() {
    if ($(this.name).slider.isRange()) {
      this.to.disabled = false;
    } else {
      this.to.disabled = true;
    }
  }

  public bindMinMax(elementID1: string, elementID2: string) {
    const el1: HTMLInputElement = document.querySelector(elementID1);
    const el2: HTMLInputElement = document.querySelector(elementID2);

    [el1, el2].forEach((item: HTMLInputElement) => {
      item.onkeydown = (e) => {
        if (e.keyCode === 13) {
          $(this.name).slider.setLimits(Number(el1.value), Number(el2.value));
        }
      };
    });
  }

  public bindFromTo(elementID1, elementID2) {
    const el1: HTMLInputElement = document.querySelector(elementID1);
    const el2: HTMLInputElement = document.querySelector(elementID2);
    this.to = el2;
    el1.onkeydown = (e) => {
      if (e.keyCode === 13) {
        $(this.name).slider.setValue(Number(el1.value), 1);
      }
    };
    el2.onkeydown = (e) => {
      if (e.keyCode === 13) {
        $(this.name).slider.setValue(Number(el2.value), 2);
      }
    };
  }
  public bindStep(elementID) {
    const el = document.querySelector(elementID);
    el.onkeydown = (e) => {
      if (e.keyCode === 13) {
        $(this.name).slider.setStep(el.value);
      }
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const slider3 = $('#slider3').slider();

  const slider2 = $('#slider2').slider();
  const qwer = $('#qwe').slider({
    minValue: 0,
    maxValue: 1360,
  });
  const qwe = new Panel('#qwe', qwer);
  qwe.bindMinMax('#min', '#max');
  qwe.bindFromTo('#from', '#to');
  qwe.bindStep('#step');
  qwe.bindToDiv('#orientation', 'tilt');
  // qwe.bindToDiv('#range', () => {
  //   $('qwe').slider.range();
  // });
  // qwe.bindToDiv('#scale', () => {
  //   $('qwe').slider.scale();
  // });
  // qwe.bindToDiv('#bar', () => {
  //   $('qwe').slider.bar();
  // });
  // qwe.bindToDiv('#tip', () => {
  //   $('qwe').slider.tip();
  // });

  const panel2 = new Panel('#slider2', slider2);
  panel2.bindMinMax('#min2', '#max2');
  panel2.bindFromTo('#from2', '#to2');
  panel2.bindStep('#step2');
  panel2.bindToDiv('#orientation2', 'tilt');
  // panel2.bindToDiv('#range2', () => {
  //   $('#slider2').slider.range();
  // });
  // panel2.bindToDiv('#scale2', () => {
  //   $('#slider2').slider.scale();
  // });
  // panel2.bindToDiv('#bar2', () => {
  //   $('#slider2').slider.bar();
  // });
  // panel2.bindToDiv('#tip2', () => {
  //   $('#slider2').slider.tip();
  // });

  const panel3 = new Panel('#slider3', slider3);
  panel3.bindMinMax('#min3', '#max3');
  panel3.bindFromTo('#from3', '#to3');
  panel3.bindStep('#step3');
  panel3.bindToDiv('#orientation3', 'tilt');
  // panel3.bindToDiv('#range3', () => {
  //   $('#slider3').slider.range();
  // });
  // panel3.bindToDiv('#scale3', () => {
  //   $('#slider3').slider.scale();
  // });
  // panel3.bindToDiv('#bar3', () => {
  //   $('#slider3').slider.bar();
  // });
  // panel3.bindToDiv('#tip3', () => {
  //   $('#slider3').slider.tip();
  // });

  console.log(panel2.slider.data());
  console.log(panel3.slider.data());
  console.log(slider2, 'SLIDRE');
  console.log(slider3, 'SLIDER@');
});
