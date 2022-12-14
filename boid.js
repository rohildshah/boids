import { rand } from './utility.js';
import { Vector } from './vector.js';

class Boid {
    x;
    y;
    velocity;
    eyesight = 100;

    constructor(x = rand(0, window.innerWidth),
                y = rand(0, window.innerHeight),
                velocity = (new Vector(rand(-50, 50), rand(-50, 50))).resize(rand(6, 8))) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    //return x-y distance between this and param boid
    distance(boid) {
        let dx = this.x - boid.x;
        let dy = this.y - boid.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    //return boids within this.eyesight x-y distance
    getNeighbors(boids) {
        let neighbors = [];

        for (let boid of boids) {
            if (boid == this) { continue; }
            if (this.distance(boid) < this.eyesight) { neighbors.push(boid);}
        }

        return neighbors;
    }

    //return vector in direction of nearest wall if out of bounds
    wall() {
        let v = new Vector(0, 0);
        let edge_offset = 50;

        if (this.x < edge_offset) {
            v.x = 2;
        } else if (this.x > window.innerWidth - edge_offset) {
            v.x = -2;
        }
        if (this.y < edge_offset) {
            v.y = 2;
        } else if (this.y > window.innerHeight - edge_offset) {
            v.y = -2;
        }

        return v;
    }

    //return relative average velocity of neighbors
    alignment(neighbors) {
        if (neighbors.length == 0) { return new Vector(0, 0); }

        let sum = new Vector(0, 0);

        for (let boid of neighbors) {
            sum = sum.add(boid.velocity);
        }

        return sum.divide(neighbors.length).subtract(this.velocity);
    }

    //return -1 * (relative average distance from closest neighbors)
    separation(neighbors) {
        neighbors = neighbors.filter(boid => this.distance(boid) < 20);
        if (neighbors.length == 0) { return new Vector(0, 0); }

        let sum = new Vector(0, 0);

        for (let boid of neighbors) {
            sum = sum.subtract((new Vector(boid.x - this.x, boid.y - this.y)).divide(Math.pow(this.distance(boid), 1)));
        }
        return sum;
    }

    //return relative average position of neighbors
    cohesion(neighbors) {
        if (neighbors.length == 0) { return new Vector(0, 0); }

        let sum = new Vector(0, 0);

        for (let boid of neighbors) {
            sum = sum.add(new Vector(boid.x, boid.y));
        }

        return sum.divide(neighbors.length).subtract(new Vector(this.x, this.y));
    }

    //return relative position to param x, y of a goal
    goal(x, y) {
        return new Vector(x - this.x, y - this.y);
    }

    //limit velocity magnitude to param speed
    limitVelocity(speed) {
        if (this.velocity.magnitude() > speed) {
            this.velocity = this.velocity.resize(speed);
        }
    }

    //draw boid shape to context param ctx
    render(ctx) {
        let size = 7;

        //init the directions for body vertices
        let head = this.velocity.resize(size);
        let left = this.velocity.rotate(3 * Math.PI / 4).resize(size);
        let right = this.velocity.rotate(-3 * Math.PI / 4).resize(size);

        //draw the body to the context
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + left.x,   this.y + left.y);
        ctx.lineTo(this.x + head.x,   this.y + head.y);
        ctx.lineTo(this.x + right.x,  this.y + right.y);
        ctx.closePath();
        ctx.stroke();
    }

    //recalculate boid velocity depending on rules
    //update position based on new velocity
    update(boids, state) {
        let neighbors = this.getNeighbors(boids);

        //compute all correction vectors and scale them by arbitrary weights
        let wall_vector = this.wall();
        let alignment_vector = (state["align"]) ?
            this.alignment(neighbors).divide(state["alignment_factor"]) :
            new Vector(0, 0);
        let separation_vector = (state["separate"]) ?
            this.separation(neighbors).divide(state["separation_factor"]) :
            new Vector(0, 0);
        let cohesion_vector = (state["cohese"]) ?
            this.cohesion(neighbors).divide(state["cohesion_factor"]) :
            new Vector(0, 0);
        let goal_vector = (state["goal"]) ?
            this.goal(state["goal_x"], state["goal_y"]).divide(state["goal_factor"]) :
            new Vector(0, 0);
        this.limitVelocity(state["max_speed"]);

        //add all correction vectors to velocity
        this.velocity = this.velocity.add(wall_vector,
                                          alignment_vector,
                                          separation_vector,
                                          cohesion_vector,
                                          goal_vector);

        //move in direction of newly computed velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

export { Boid };