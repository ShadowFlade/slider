// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
// const config = {
//   verbose: true,
// };

module.exports = {
  // "testRegex":"(/__tests__/.*|(\\.|/)(test|spec))//.tsx?$",
  "moduleFileExtensions":[
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  testEnvironment:"jsdom",
};