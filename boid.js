//TODO: clean up these imports
import { rand, rotateVector } from './utility.js';
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

        return neighbors;
    }

    
    calc_alignment(neighbors) {
        if (neighbors.length == 0) { return new Vector(0, 0); }

        let sum = new Vector(0, 0);

        for (let boid of neighbors) {
            sum = sum.add(boid.velocity);
        }

        return sum.divide(neighbors.length).subtract(this.velocity).divide(8);
    }

    calc_separation(neighbors) {
        neighbors = neighbors.filter(boid => this.distance(boid) < 20);
        if (neighbors.length == 0) { return new Vector(0, 0); }

        let sum = new Vector(0, 0);

        for (let boid of neighbors) {
            sum = sum.subtract((new Vector(boid.x - this.x, boid.y - this.y)).divide(Math.pow(this.distance(boid), 1)));
        }
        return sum.divide(1);
    }

    calc_cohesion(neighbors) {
        if (neighbors.length == 0) { return new Vector(0, 0); }

        let sum = new Vector(0, 0);

        for (let boid of neighbors) {
            sum = sum.add(new Vector(boid.x, boid.y));
        }

        return sum.divide(neighbors.length).subtract(new Vector(this.x, this.y)).divide(100);
    }

    calc_speed() {
        if (this.velocity.magnitude() > 10) {
            this.velocity = this.velocity.resize(10);
        }
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

        let alignment_correction = this.calc_alignment(neighbors);
        let separation_correction = this.calc_separation(neighbors);
        let cohesion_correction = this.calc_cohesion(neighbors);
        this.calc_speed();
        let wall_correction = this.calc_wall();

        this.velocity = this.velocity.add(wall_correction,
                                          alignment_correction,
                                          separation_correction,
                                          cohesion_correction);

        //move in direction of newly computed velocity
        this.x += this.velocity.getX();
        this.y += this.velocity.getY();
    }

}

export { Boid };