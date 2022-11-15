export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function positiveAngle(a) {
  return (2 * Math.PI + a) % (2 * Math.PI);
}

export function angleBetween(a, b) {
  return (b - a > Math.PI) ? b - a - (2 * Math.PI) : (b - a < -Math.PI) ? b - a + (2 * Math.PI) : b - a;
}

export function reflectX(a) {
  return positiveAngle(Math.PI - a);
}

export function reflectY(a) {
  return positiveAngle(-a);
}