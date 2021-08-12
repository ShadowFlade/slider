import jsdom from 'jsdom'
const { JSDOM } = jsdom;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => { virtualConsole.log(err) });
virtualConsole.on("warn", () => { virtualConsole.log(err) });
virtualConsole.on("info", () => { virtualConsole.log(err) });
virtualConsole.on("dir", () => { virtualConsole.log(err) });
const dom=new JSDOM(`<!DOCTYPE html><div class="item"></div>`,{ runScripts: "outside-only",virtualConsole })
export default dom













// const DEFAULT_HTML = '<html><body></body></html>';

// // Define some variables to make it look like we're a browser
// // First, use JSDOM's fake DOM as the document
// global.document = jsdom.jsdom(DEFAULT_HTML);

// // Set up a mock window
// global.window = document.defaultView;
// global.window.location = "https://www.bobsaget.com/"
// // ...Do extra loading of things like localStorage that are not supported by jsdom