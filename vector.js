class Vector {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //return magnitude of vector
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    //return new vector in same direction but resized to param length
    resize(length) {
        return new Vector(length * this.x / this.magnitude()
                        , length * this.y / this.magnitude());
    }

    //return this + all vectors in param arguments
    add() {
        let sum = new Vector(this.x, this.y);
        for (let v of arguments) {
            sum = new Vector(sum.x + v.x, sum.y + v.y);
        }

        return sum;
    }

    //return this - all vectors in param arguments
    subtract() {
        let sum = new Vector(this.x, this.y);
        for (let v of arguments) {
            sum = new Vector(sum.x - v.x, sum.y - v.y);
        }

        return sum;
    }

    //return this / param scalar
    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    //return this vector rotated by param angle
    rotate(angle) {
        return new Vector(this.x * Math.cos(angle) - this.y * Math.sin(angle),
                          this.x * Math.sin(angle) + this.y * Math.cos(angle));
    }
}

export { Vector };