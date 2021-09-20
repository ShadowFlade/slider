# Stack

This plugin was created with the use of TypeScript and JQuery as a wrapper. This plugin was build using MVP design-pattern with Webpack as a bundler.

# Project structure

In the root folder you can find config files and :

`ts-src` - contains all the source files
`dist` - bundled plugin file + files for demopage (`index.html` and `index.js`)
`docs`- examples of the plugin (`.png`)

## Testing

You can run tests with `npm run test`. First initialization might take some time,further tries will take about 10 seconds.

## Architecture

As MVP pattern dictates plugins consists of **Model**, **Presenter** (`pres.ts`) and **View**.

It's also wrapped in `App.ts` if you want to detach it from JQuery easily.
Then we have a plugin class example which in built into JQuery wrapper. It is the object you will work with after initialization.

### Model

Model is the business logic of this app. Most of the calculation is done via **Model** (such as calculation the position of the handle on slider) and most of the data is stored there (settings and a few style options).

### Presenter

It is an entity that binds **Model** and **View** together. It is responsilbe for the data transmissions and deal with event listeners.

### View

This entitity is responsible for the rendering of the result of **Model** calculations.

### Observer

**Model** is not connected to any other entity directly except for **Observer** object. **Presenter** is listening to **Model** and reacts to definite calls. E.g. :

```
    //In the Presenter
    this._model.on('coords changed', this.transferData.bind(this));
    //In the Model
    this.trigger('coords changed', validatedCoords, ori, type);
```

## How it works

**Presenter** listens with `eventListeners` for the manipulation with the handle (or it might be a click on a scale), sends the data to **Model** , it calulates necessary data,validates it and sends back to presenter, which then sends it to **View** to render.
