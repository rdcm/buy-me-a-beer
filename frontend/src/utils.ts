export function randomNumber(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

export function randomNumberInRange(
  min: number,
  max: number,
  exclude: number,
): number {
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num === exclude ? randomNumberInRange(min, max, exclude) : num;
}
