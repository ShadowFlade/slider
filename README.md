# Slider

Customizable JQuery plugin

![slider](docs/example.png)

## Installing

1. `git clone https://github.com/ShadowFlade/slider.git`
2. `npm i`
3. `npm run build` will get you a minified version of js file, otherwise use `npm run dev`

## Setup

In the **dist** folder you will find **plugin.js** and **plugin.min.css** files. You will need both of them for the plugin to work.

1. You are going to need `JQuery` in your page for the plugin to work. You can checkout many options on their site https://jquery.com/download/ or just insert this line into your HTML file `<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>`.
2. Insert **plugin.min.css** into your HTML/PUG file.
3. Insert **plugin.js** file into your HTML/PUG file **after** `JQuery`.

## Using

Initialize default slider with
`$('#slider').slider()`

or customize it

```
const data={
  className: 'slider',
  orientation: 'horizontal',
  type: 'single',
  stepSize: 90,
  maxValue: 400,
  minValue: 0,
  mainMin: 0,
  toolTip: true,
  marker: true,
  sliderWidth: 200,
  sliderHeight: 5,
  //not recommended for use
  progressBarColor: 'brown',
  sliderColor: 'red',
  pinTextColor: 'green',
  toolTextColor: 'red',
}

`$('#slider').slider(data)`

```

> Content inside `div` element with `id='slider'` will be deleted

### Settings

**className** is name of the class,which will be used for the body of the slider,therefore is should not be used anywhere else on the page. **Default** option is **slider**.

**orientation**. **Options** are : **horizontal** or **vertical** . **Default** option is **horizontal** .

**type** is responsible for slider being range-type or singular. **Options** are : **single** or **double** . **Default** option is **single**.

**stepsize** determines the amount of value changing between steps. **Default** option is **90**.

**maxValue**. **Default** option is //TODO.

**minValue**. **Default** option is //TODO.

**startPosLeftHandle** determines start position of the first handle in pixels.

**startPosRightHandle** determines start position of the second handle in pixels.

**startValueLeftHandle** determines start position of the first handle infered from the handed value.

**startValueRightHandle** determines start position of the second handle infered from the handed value.

> Note: **startValue** settings will overwrite **startPos** settings. Do not use them together to avoid confusion.

**toolTip**. Determines whether value is displayed or not. Option type is **boolean**.

**marker**. Determines whether scale will be created or not (does not depend on tooltip option). Option type is **boolean**.

:warning: Using and setting color options is not recommended. Better change the styles in `plugin.min.css`
**progressBarColor** will set the color of progress bar. **Default** option is //TODO

**sliderColor** will set the color of the background of the slider (_when not overlayed by the progress bar_). **Default** option is //TODO

**toolTextColor** will set the color of text in the tooltip circle above the handle. **Default** option is () //TODO insdert a pic of tooltip

> Options might be corrected afterwards. E.g. if the orientation was set to **horizontal** and **sliderWidth: 5 sliderHeight:200** , **sliderWidth** and **sliderHeight** will be swapped,so it will be **sliderWidth:200** and **sliderHeight:5**.

### API

There are a few plugin methods you can use.

`$('#slider').slider.tilt()`
Is used to change orientation. Look up [`orientation`](###settings) in **settings**.

`$('#slider').slider.scale(option)` Option is of type `boolean`. Determines whether or not scale will be displayed.

`$('#slider').slider.bar(option)` Option is of type `boolean`. Determines whether or not progress bar will be displayed.

`$('#slider').slider.tip(option)` Option is of type `boolean`. Determines whether or not tooltip will be displayed. Look up [`tooltip`](###settings) in **settings**.

`$('#slider').slider.range(option)` Option is of type `boolean`. Determines the `type` of slider. Look up [`type`](###settings) in **settings**.

`$('#slider').slider.setValue(value,numberOfHandle)` **value** argument is the number you want to assign to the desired handle. **numberOfHandle** argument determines which of the 2 handles you want to move (\*therefore **numberOfHandle** argument can be either **1** or **2**).

`$('#slider').slider.setLimits(min,max)` Rebuilds the slider with desired limits. Both aruments must be integers.

`$('#slider').slider.isRange()` Returns `boolean`, `ture` if the `type` of slider is **double**, `false` if `type` of slider is **single**.

`$('#slider').slider.setStep(value)` Rebuilds the slider with the `stepsize` setting set to `value`.

`$('#slider').slider.noStick(option)` Removes stick element if option is `false`.

## Demo page

You can find demo page in `ts-src/demoPage/` or at https://shadowflade.github.io/slider/. You can play around with it to find the setup that suits you best.

![demoPage](docs/ex2.png)

[Architecture](docs/architecture.md)
