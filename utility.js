//return random int between param min and param max
export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}