function elemsDiff(arr: number[]): number[] {
  const res = [];
  for (let i = 0; i < arr.length - 1; i += 1) {
    const result = +arr[i + 1] - +arr[i];
    res.push(result);
  }
  return res;
}

function checkForZero(number: number): number {
  if (number > 0) {
    return number;
  }
  throw new Error('can not operate with non-positive numbers');
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

function divisionFloor(x: number, y: number): number {
  const result = Math.trunc(x / y);
  return result;
}

export { elemsDiff, checkForZero, shortenValue, divisionFloor };
