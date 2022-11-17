//TODO: clean up this file and include only the important stuff

import { Vector } from './vector.js';

export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function positiveAngle(a) {
  return (2 * Math.PI + a) % (2 * Math.PI);
}

export function rotateVector(v, a) {
  return new Vector(v.x * Math.cos(a) - v.y * Math.sin(a), v.x * Math.sin(a) + v.y * Math.cos(a));
}