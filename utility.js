function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function positiveAngle(a) {
  return (2 * Math.PI + a) % (2 * Math.PI);
}

function angleBetween(a, b) {
  return (b - a > Math.PI) ? b - a - (2 * Math.PI) : (b - a < -Math.PI) ? b - a + (2 * Math.PI) : b - a;
}

function reflectX(a) {
  return positiveAngle(Math.PI - a);
}

function reflectY(a) {
  return positiveAngle(-a);
}

export { rand, positiveAngle, angleBetween, reflectX, reflectY };