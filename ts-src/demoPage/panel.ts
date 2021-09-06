interface ExamplePluginOptions {
  outputSelector: string;

  outputColor?: string;
}

interface ExamplePluginGlobalOptions {
  options: ExamplePluginOptions;
}

interface ExamplePluginFunction {
  (options: ExamplePluginOptions): JQuery;
}

interface ExamplePlugin
  extends ExamplePluginGlobalOptions,
    ExamplePluginFunction {}

interface JQuery {
  [x: string]: any;
  slider: JQuery;
}

class Panel {
  item: HTMLElement;
  elements: HTMLElement[];
  to: HTMLInputElement;
  name: string;
  constructor(nameOfSliderDiv) {
    this.item = document.getElementById(nameOfSliderDiv);
    this.name = nameOfSliderDiv;
    this.elements = [];
    if (this.to) {
      this.checkForRange();
    }
  }
  public bindToDiv(nameOfElement, func: Function | string, nameOfElement2?) {
    const element = document.querySelector(nameOfElement);
    this.elements.push(element);
    this.bindCheckboxs();
    if (element.type === 'checkbox') {
      element.onchange = func;
      return true;
    }
  }
  private bindCheckboxs() {
    console.log(this.elements);
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

const qwe = new Panel('qwe');
qwe.bindMinMax('#min', '#max');
qwe.bindFromTo('#from', '#to');
qwe.bindStep('#step');
qwe.bindToDiv('#orientation', () => {
  $('qwe').slider.tilt();
});
qwe.bindToDiv('#range', () => {
  $('qwe').slider.range();
});
qwe.bindToDiv('#scale', () => {
  $('qwe').slider.scale();
});
qwe.bindToDiv('#bar', () => {
  $('qwe').slider.bar();
});
qwe.bindToDiv('#tip', () => {
  $('qwe').slider.tip();
});
