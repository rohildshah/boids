import { rand, positiveAngle, angleBetween, reflectX, reflectY } from './utility.js';

class Boid {
    x;
    y;
    speed;
    heading;
    color;
    eyesight;
    size = 7;
    
    //TODO: change to random speed
    constructor(x = rand(this.size, window.innerWidth - this.size),
                y = rand(this.size, window.innerHeight - this.size),
                speed = 7,
                heading = rand(0, 2 * Math.PI),
                color = "rgb(" + rand(0, 256) + "," + rand(0, 256) + "," + rand(0, 256) + ")",
                eyesight = 100) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = heading;
        this.color = color;
        this.eyesight = eyesight;
    }

    drawBody(ctx) {
        let headAngle = [Math.cos(this.heading), Math.sin(this.heading)];
        let leftWingAngle = [Math.cos(this.heading + (3 * Math.PI / 4)), Math.sin(this.heading + (3 * Math.PI / 4))];
        let rightWingAngle = [Math.cos(this.heading - (3 * Math.PI / 4)), Math.sin(this.heading - (3 * Math.PI / 4))];

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.size * leftWingAngle[0], this.y + this.size * leftWingAngle[1]);
        ctx.lineTo(this.x + this.size * headAngle[0], this.y + this.size * headAngle[1]);
        ctx.lineTo(this.x + this.size * rightWingAngle[0], this.y + this.size * rightWingAngle[1]);
        ctx.closePath();
        ctx.stroke();
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
        let neighbors = [];

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

    //Average Heading Of Neighbors (AHON)
    ahon(neighbors) {
        let sumX = 0, sumY = 0;

        //sum x and y components of neighbors' headings and scale inversely to distance
        for (let boid of neighbors) {
            sumX += (Math.cos(boid.heading)) / this.distance(boid);
            sumY += (Math.sin(boid.heading)) / this.distance(boid);
        }

        return Math.atan2(sumY, sumX);
    }

    //Average Position Of Neighbors (APON)
    apon(neighbors, sensitivity) {
        let sumX = 0, sumY = 0;

        //sum x and y components of neighbors' relative positions and scale inversely to distance
        for (let boid of neighbors) {
            sumX += (boid.x - this.x) / Math.pow(this.distance(boid), sensitivity);
            sumY += (boid.y - this.y) / Math.pow(this.distance(boid), sensitivity);
        }

        sumX /= neighbors.length;
        sumY /= neighbors.length;

        return [sumX, sumY]
    }        

    render(ctx, boids) {
        ctx.fillStyle = this.color;
        this.drawBody(ctx);

        let neighbors = this.getNeighbors(boids);

        if (neighbors.length > 0) {
            //calculate direction to move if you want to be aligned, separated, and cohesed
            let aligned = this.ahon(neighbors);
            let [x_apon, y_apon] = this.apon(neighbors, 2); //more sensitive to distance for separation
            let separated = Math.atan2(-1 * y_apon, -1 * x_apon);
            [x_apon, y_apon] = this.apon(neighbors, 1); //less sensitive to distance for cohesion
            let cohesed = Math.atan2(y_apon, x_apon);

            //calculate angle between current heading and the desired direction (alignment, separation, cohesion)
            let alignment_correction = angleBetween(this.heading, aligned);
            let separation_correction = angleBetween(this.heading, separated);
            let cohesion_correction = angleBetween(this.heading, cohesed);

            let total_correction = 0.1 * alignment_correction
                                 + 0.005 * separation_correction
                                 + 0.005 * cohesion_correction;

            this.heading += total_correction;

            // ctx.moveTo(this.x, this.y);
            // ctx.lineTo(this.x + 50 * Math.cos(cohesed), this.y + 50 * Math.sin(cohesed));
            // ctx.stroke();
        }

        let vx = Math.cos(this.heading);
        let vy = Math.sin(this.heading);

        //deflection amount
        // let d = 0.1

        // ctx.fillRect(this.x, this.y + (200 * vy), 5, 5);
        // ctx.fillRect(this.x + (200 * vx), this.y, 5, 5);

        // if (this.outOfBounds(this.x + (200 * vx))) {
        //     if (vy != 0) {
        //         this.heading += d * Math.sign(vy * vx);
        //     } else {
        //         this.heading += (rand(0, 1) == 0) ? 0.5 : -0.5;
        //     }
        // }
        // if (this.outOfBounds(this.y + (200 * vy))) {
        //     if (vx != 0) {
        //         console.log(Math.sign(vy * vx))
        //         this.heading -= d * Math.sign(vy * vx);
        //     } else {
        //         this.heading += (rand(0, 1) == 0) ? 0.5 : -0.5;
        //     }
        // }

        // vx = Math.cos(this.heading);
        // vy = Math.sin(this.heading);

        this.x += this.speed * vx;
        this.y += this.speed * vy;

        if (this.outOfBoundsX(this.x)) {
            this.heading = reflectX(this.heading);
            this.x = Math.max(this.size, Math.min(window.innerWidth - this.size, this.x));
        }
        if (this.outOfBoundsY(this.y)) {
            this.heading = reflectY(this.heading);
            this.y = Math.max(this.size, Math.min(window.innerHeight - this.size, this.y));
        }
    }
}

export { Boid };