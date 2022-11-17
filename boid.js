//TODO: clean up these imports
import { rand, randDir, positiveAngle, angleBetween, reflectX, reflectY, addVector, divideVector, rotateVector, subVector, multVector } from './utility.js';
import { Vector } from './vector.js';

class Boid {
    x;
    y;
    velocity;
    eyesight;
    size = 7;
    
    constructor(x = rand(this.size, window.innerWidth - this.size),
                y = rand(this.size, window.innerHeight - this.size),
                velocity = new Vector(rand(-50, 50), rand(-50, 50)),
                eyesight = 100) {
        this.x = x;
        this.y = y;
        this.velocity = velocity.resize(rand(6, 8));
        this.eyesight = eyesight;
    }

    outOfBoundsX(n) {
        return (n < this.size || n > window.innerWidth - this.size);
    }

    outOfBoundsY(n) {
        return (n < this.size || n > window.innerHeight - this.size);
    }

    distance(boid) {
        return Math.sqrt(Math.pow(this.x - boid.x, 2) + Math.pow(this.y - boid.y, 2));
    }

    getNeighbors(boids) {
        let neighbors = []

        for (let boid of boids) {
            if (boid == this) {
                continue;
            }
            if (this.distance(boid) < this.eyesight) {
                neighbors.push(boid);
            }
        }

        return neighbors
    }

    
    calc_alignment(neighbors) {
        if (neighbors.length == 0) { return new Vector(0, 0); }

        let sum = new Vector(0, 0);

        for (let boid of neighbors) {
            sum = addVector(sum, boid.velocity)
        }

        //TODO: this is the most disgusting line of code i have written so please fix it
        return divideVector(subVector(divideVector(sum, neighbors.length), this.velocity), 8);
    }

    //Average Position Of Neighbors (APON)
    // apon(sensitivity) {
    //     let sumX = 0, sumY = 0;

    //     //sum x and y components of neighbors' relative positions and scale inversely to distance
    //     for (let boid of this.neighbors) {
    //         sumX += (boid.x - this.x) / Math.pow(this.distance(boid), sensitivity);
    //         sumY += (boid.y - this.y) / Math.pow(this.distance(boid), sensitivity);
    //     }

    //     sumX /= this.neighbors.length;
    //     sumY /= this.neighbors.length;

    //     return [sumX, sumY]
    // }

    calc_separation() {
        if (this.neighbors.length == 0) { return 0; }

        let sumX = 0, sumY = 0;

        for (let boid of this.neighbors) {
            sumX -= (boid.x - this.x) / Math.pow(this.distance(boid), 2);
            sumY -= (boid.y - this.y) / Math.pow(this.distance(boid), 2);
        }

        //Average Distance Of Neighbors (ADON)
        let adon = Math.atan2(sumY, sumX);
        return angleBetween(this.heading, adon);
    }

    calc_cohesion() {
        if (this.neighbors.length == 0) { return 0; }

        let sumX = 0, sumY = 0;

        for (let boid of this.neighbors) {
            sumX += boid.x / Math.pow(this.distance(boid), 2);
            sumY += boid.y / Math.pow(this.distance(boid), 2);
        }

        //Average Position Of Neighbors (APON)
        let apon = Math.atan2(sumY / this.neighbors.length, sumX / this.neighbors.length);
        return angleBetween(this.heading, apon);
    }

    calc_wall() {
        let v = new Vector(0, 0);

        if (this.x < this.size) {
            v.x = 1;
        } else if (this.x > window.innerWidth - this.size) {
            v.x = -1;
        }
        if (this.y < this.size) {
            v.y = 1;
        } else if (this.y > window.innerHeight - this.size) {
            v.y = -1;
        }

        return v;
    }

    render(ctx) {
        //init the directions for the wings
        let leftWingVector = rotateVector(this.velocity, 3 * Math.PI / 4);
        let rightWingVector = rotateVector(this.velocity, -3 * Math.PI / 4);

        //draw the triangular shaped body
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + leftWingVector.getX(this.size), this.y + leftWingVector.getY(this.size));
        ctx.lineTo(this.x + this.velocity.getX(this.size), this.y + this.velocity.getY(this.size));
        ctx.lineTo(this.x + rightWingVector.getX(this.size), this.y + rightWingVector.getY(this.size));
        ctx.closePath();
        ctx.stroke();
    }

    update(ctx, boids) {
        let neighbors = this.getNeighbors(boids);

        //TODO: implement all other corrections and make sure they dont look like complete garbage
        let alignment_correction = this.calc_alignment(neighbors);
        // let separation_correction = this.calc_separation();
        // let cohesion_correction = this.calc_cohesion();
        let wall_correction = this.calc_wall();

        // if (this.neighbors.length > 0) {
        //     //calculate direction to move if you want to be aligned, separated, and cohesed
        //     let aligned = this.ahon();
        //     let [x_apon, y_apon] = this.apon(2); //more sensitive to distance for separation
        //     let separated = Math.atan2(-1 * y_apon, -1 * x_apon);
        //     [x_apon, y_apon] = this.apon(1); //less sensitive to distance for cohesion
        //     let cohesed = Math.atan2(y_apon, x_apon);

        //     //calculate angle between current heading and the desired direction (alignment, separation, cohesion)
        //     alignment_correction = angleBetween(this.heading, aligned);
        //     separation_correction = angleBetween(this.heading, separated);
        //     cohesion_correction = angleBetween(this.heading, cohesed);

        // }

        // this.heading += 0.125 * alignment_correction
        //               + 0.01 * separation_correction
        //               + 0.01 * cohesion_correction
                    //   + 0.1 * wall_correction;
        
        // ctx.moveTo(this.x, this.y)
        // ctx.lineTo(this.x + 100 * Math.cos(separation_correction), this.y + 100 * Math.sin(separation_correction));
        // ctx.stroke();

        // if (this.outOfBoundsX(this.x)) {
        //     this.heading = reflectX(this.heading);
        //     this.x = Math.max(this.size, Math.min(window.innerWidth - this.size, this.x));
        // }
        // if (this.outOfBoundsY(this.y)) {
        //     this.heading = reflectY(this.heading);
        //     this.y = Math.max(this.size, Math.min(window.innerHeight - this.size, this.y));
        // }

        //TODO: i dont like that i have to do an addvector for every correction so try to fix that
        this.velocity = addVector(this.velocity, alignment_correction);
        this.velocity = addVector(this.velocity, wall_correction);

        //move in direction of newly computed velocity
        this.x += this.velocity.getX();
        this.y += this.velocity.getY();
    }

}

export { Boid };