import './demo.css';
import { Panel, IPlugin } from './panel';
declare global {
  interface JQuery {
    slider: (options?) => IPlugin;
  }
}

const onDOMLoaded = () => {
  const slider3 = $('#slider3').slider();

  const slider2 = $('#slider2').slider();
  const qweSlider = $('#qwe').slider({
    minValue: 0,
    maxValue: 1360,
  });
  const qwe = new Panel('#qwe', qweSlider);
  qwe.bindMinMax('#min', '#max');
  qwe.bindFromTo('#from', '#to');
  qwe.bindStep('#step');
  qwe.bindToDiv('#orientation', 'tilt');
  qwe.bindToDiv('#range', 'range');
  qwe.bindToDiv('#scale', 'scale');
  qwe.bindToDiv('#bar', 'bar');
  qwe.bindToDiv('#tip', 'tip');

  const panel2 = new Panel('#slider2', slider2);
  panel2.bindMinMax('#min2', '#max2');
  panel2.bindFromTo('#from2', '#to2');
  panel2.bindStep('#step2');
  panel2.bindToDiv('#orientation2', 'tilt');
  panel2.bindToDiv('#range2', 'range');
  panel2.bindToDiv('#scale2', 'scale');
  panel2.bindToDiv('#bar2', 'bar');
  panel2.bindToDiv('#tip2', 'tip');

  const panel3 = new Panel('#slider3', slider3);
  panel3.bindMinMax('#min3', '#max3');
  panel3.bindFromTo('#from3', '#to3');
  panel3.bindStep('#step3');
  panel3.bindToDiv('#orientation3', 'tilt');
  panel3.bindToDiv('#range3', 'range');
  panel3.bindToDiv('#scale3', 'scale');
  panel3.bindToDiv('#bar3', 'bar');
  panel3.bindToDiv('#tip3', 'tip');
};
document.addEventListener('DOMContentLoaded', onDOMLoaded);
