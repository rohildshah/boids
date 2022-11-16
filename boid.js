import { rand, positiveAngle, angleBetween, reflectX, reflectY } from './utility.js';

class Boid {
    x;
    y;
    speed;
    heading;
    color;
    eyesight;
    neighbors;
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
        this.neighbors = []

        for (let boid of boids) {
            if (boid == this) {
                continue;
            }
            if (this.distance(boid) < this.eyesight) {
                this.neighbors.push(boid);
            }
        }
    }

    //Average Heading Of Neighbors (AHON)
    ahon() {
        let sumX = 0, sumY = 0;

        //sum x and y components of neighbors' headings and scale inversely to distance
        for (let boid of this.neighbors) {
            sumX += (Math.cos(boid.heading)) / this.distance(boid);
            sumY += (Math.sin(boid.heading)) / this.distance(boid);
        }

        return Math.atan2(sumY, sumX);
    }

    //Average Position Of Neighbors (APON)
    apon(sensitivity) {
        let sumX = 0, sumY = 0;

        //sum x and y components of neighbors' relative positions and scale inversely to distance
        for (let boid of this.neighbors) {
            sumX += (boid.x - this.x) / Math.pow(this.distance(boid), sensitivity);
            sumY += (boid.y - this.y) / Math.pow(this.distance(boid), sensitivity);
        }

        sumX /= this.neighbors.length;
        sumY /= this.neighbors.length;

        return [sumX, sumY]
    }        

    render(ctx, boids) {
        ctx.fillStyle = this.color;
        this.drawBody(ctx);
    }

    update(ctx, boids) {
        this.getNeighbors(boids);

        let alignment_correction = 0;
        let separation_correction = 0;
        let cohesion_correction = 0;
        let wall_correction = 0;

        if (this.neighbors.length > 0) {
            //calculate direction to move if you want to be aligned, separated, and cohesed
            let aligned = this.ahon();
            let [x_apon, y_apon] = this.apon(2); //more sensitive to distance for separation
            let separated = Math.atan2(-1 * y_apon, -1 * x_apon);
            [x_apon, y_apon] = this.apon(1); //less sensitive to distance for cohesion
            let cohesed = Math.atan2(y_apon, x_apon);

            //calculate angle between current heading and the desired direction (alignment, separation, cohesion)
            alignment_correction = angleBetween(this.heading, aligned);
            separation_correction = angleBetween(this.heading, separated);
            cohesion_correction = angleBetween(this.heading, cohesed);

            // ctx.moveTo(this.x, this.y)
            // ctx.lineTo(this.x + 100 * Math.cos(cohesed), this.y + 100 * Math.sin(cohesed));
            // ctx.stroke();
        }

        this.heading += 0.1 * alignment_correction
                      + 0.005 * separation_correction
                      + 0.005 * cohesion_correction

        if (this.outOfBoundsX(this.x)) {
            this.heading = reflectX(this.heading);
            this.x = Math.max(this.size, Math.min(window.innerWidth - this.size, this.x));
        }
        if (this.outOfBoundsY(this.y)) {
            this.heading = reflectY(this.heading);
            this.y = Math.max(this.size, Math.min(window.innerHeight - this.size, this.y));
        }

        //move in direction of newly computed heading
        this.x += this.speed * Math.cos(this.heading);
        this.y += this.speed * Math.sin(this.heading);
    }

}

export { Boid };