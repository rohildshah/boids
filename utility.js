//TODO: clean up this file and include only the important stuff

import { Vector } from './vector.js';

export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randDir() {
  let direction = rand(0, 2 * Math.PI);
  return [Math.cos(direction), Math.sin(direction)];
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

export function addVector(a, b) {
  return new Vector(a.x + b.x, a.y + b.y);
}

export function subVector(a, b) {
  return new Vector(a.x - b.x, a.y - b.y);
}

export function multVector(a, b) {
  return new Vector(a.x * b, a.y * b);
}

export function rotateVector(v, a) {
  return new Vector(v.x * Math.cos(a) - v.y * Math.sin(a), v.x * Math.sin(a) + v.y * Math.cos(a));
}

export function divideVector(v, n) {
  return new Vector(v.x / n, v.y / n);
}