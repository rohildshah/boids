//TODO: rethink whether or not i want to have all these member functions

import { positiveAngle, rand } from './utility.js';

class Vector {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //return angle to positive x axis (0 < angle < 2pi)
    angle() {
        return positiveAngle(Math.atan2(this.y, this.x));
    }

    //return magnitude of vector
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    // return length of unit vector in x direction
    getX(length = this.magnitude()) {
        return length * this.x / this.magnitude();
    }

    //return distance in y direction
    //param length is optional, defaults to magnitude of vector
    getY(length = this.magnitude()) {
        return length * this.y / this.magnitude();
    }

    //return new vector in same direction but resized to param length
    resize(length) {
        return new Vector(length * this.x / this.magnitude()
                        , length * this.y / this.magnitude());
    }
}

export { Vector };