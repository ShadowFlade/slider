function elemsDiff(arr: number[]) {
  let res = [];
  for (let i = 0; i < arr.length - 1; i += 1) {
    const result = +arr[i + 1] - +arr[i];
    res.push(result);
  }
  return res;
}

function checkForZero(number: number) {
  if (number > 0) {
    return number;
  } else {
    throw new Error('can not operate with non-positive numbers');
  }
}

// shortens value to format  e.g.'1.3k'
function shortenValue(x: number): string {
  let value: string;
  if (x.toString().length > 3) {
    value = (x / 1000).toFixed(1) + 'k';
  } else {
    value = String(x);
  }
  return value;
}

export { elemsDiff, checkForZero, shortenValue };
