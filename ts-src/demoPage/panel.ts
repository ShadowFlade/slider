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
  name: string;
  constructor(nameOfSliderDiv) {
    this.item = document.getElementById(nameOfSliderDiv);
    this.name = nameOfSliderDiv;
  }
  bindToDiv(nameOfElement, func: Function | string, nameOfElement2?) {
    const element = document.querySelector(nameOfElement);
    const element2 = document.querySelector(nameOfElement2);
    if (element.type === 'checkbox') {
      element.onchange = func;
      return true;
    }

    [element, element2].forEach((item) => {
      item.onkeydown = (e) => {
        const f = func as string;
        if (e.keyCode === 13) {
          // console.log(element.value, 'element value', element);
          // console.log(element2.value, 'element2 value', element2);
          // console.log(this.item);
          $(this.name).slider[f](Number(element.value), Number(element2.value));
        }
      };
    });
  }
}

const qwe = new Panel('qwe');
qwe.bindToDiv('#min', 'setLimits', '#max');

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

const from = document.getElementById('from') as HTMLInputElement;
const to = document.getElementById('to') as HTMLInputElement;

from.onkeydown = handleChangeFrom;
to.onkeydown = handleChangeTo;
function handleChangeFrom(e) {
  if (e.keyCode == 13) {
    // keycode for enter is 13

    $('qwe').slider.setValue(from.value, 1);
    return false;
  }
}
function handleChangeTo(e) {
  if (e.keyCode == 13) {
    // keycode for enter is 13

    $('qwe').slider.setValue(to.value, 2);
    return false;
  }
}
const step = document.getElementById('step') as HTMLInputElement;
step.onkeydown = handleStep;
function handleStep(e) {
  if (e.keyCode == 13) {
    // keycode for enter is 13

    $('qwe').slider.setStep(step.value);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if ($('#qwe').slider.isRange()) {
    to.disabled = false;
  } else {
    to.disabled = true;
  }
});
