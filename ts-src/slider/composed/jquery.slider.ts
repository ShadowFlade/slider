/* eslint-disable no-irregular-whitespace */
import '../style.scss';
import App from './app';
import Plugin from './plugin';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let $: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins = new Map();
$.fn.slider = function slider(
  this: JQuery,
  options?: Record<string, unknown>
): Plugin {
  const app = new App(this[0], options);
  plugins.set(this[0], { plugin: $(this), app: app });
  return new Plugin(this[0], app);
};

export default Plugin;
