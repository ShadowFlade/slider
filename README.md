# Slider

Customizable JQuery plugin

## Installing

1. `git clone https://github.com/ShadowFlade/slider.git`
2. `npm i`
3. `npm run build` will get you a minified version of js file, otherwise use `npm run dev`

## Setup

In the **dist** folder you will find **plugin.js** and **plugin.min.css** fils. You will need both of them for the plugin to work.

1. You are going to need `JQuery` in your page for the plugin to work. You can checkout many options on their site https://jquery.com/download/ or just insert this line into your HTML file `<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>`.
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
    sliderWidth: 5,
  sliderHeight: 200,
  //not recommended for use
  progressBarColor: 'brown',
  sliderColor: 'red',
  pinTextColor: 'green',
  toolTextColor: 'red',
}

`$('#slider').slider(data)`

```

> Content inside `div` element with `id='slider'` will be deleted

**className** is name of the class,which will be used for the body of the slider,therefore is should not be used anywhere else on the page. **Default** option is **slider**.

**orientation**. **Options** are : **horizontal** or **vertical** . **Default** option is **horizontal** .

**type** is responsible for slider being range-type or singular. **Options** are : **single** or **double** . **Default** option is **single**.

**stepsize** determines the amount of value changing between steps. **Default** option is **90**.

**maxValue**. **Default** option is //TODO.

**minValue**. **Default** option is //TODO.

**toolTip**. Determines whether value is displayed or not. Option type is **boolean**.

**marker**. Determines whether scale will be created or not (does not depend on tooltip option). Option type is **boolean**.

:warning: Using and setting color options is not recommended. Better change the styles in `plugin.min.css`
**progressBarColor** will set the color of progress bar. **Default** option is //TODO

**sliderColor** will set the color of the background of the slider (_when not overlayed by the progress bar_). **Default** option is //TODO

**toolTextColor** will set the color of text in the tooltip circle above the handle. **Default** option is () //TODO insdert a pic of tooltip
