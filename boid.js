import { rand, positiveAngle, angleBetween, reflectX, reflectY } from './utility.js';

class Boid {
    x;
    y;
    speed;
    heading;
    color;
    size = 7;
    
    //TODO: change to random speed
    constructor(x = rand(this.size, window.innerWidth - this.size),
                y = rand(this.size, window.innerHeight - this.size),
                speed = 7,
                heading = rand(0, 2 * Math.PI),
                color = "rgb(" + rand(0, 256) + "," + rand(0, 256) + "," + rand(0, 256) + ")") {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.heading = heading;
        this.color = color;
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

    computeNeighbors(boids) {
        let neighbors = [];

        for (let boid of boids) {
            if (boid == this) {
                continue;
            }
            if (this.distance(boid) < 100) { //TODO: make this dynamic based on boid detection range
                neighbors.push(boid);
            }
        }

        return neighbors;
    }

    avgHeading(neighbors) {
        let sumX = 0;
        let sumY = 0;

        for (let boid of neighbors) {
            sumX += (Math.cos(boid.heading)) / this.distance(boid);
            sumY += (Math.sin(boid.heading)) / this.distance(boid);
        }

        return Math.atan2(sumY, sumX);
    }

    //TODO: rename appropriately
    avgDistance(neighbors) {
        let sumX = 0;
        let sumY = 0;

        for (let boid of neighbors) {
            sumX += (this.x - boid.x) / this.distance(boid);
            sumY += (this.y - boid.y) / this.distance(boid);
        }

        sumX /= neighbors.length;
        sumY /= neighbors.length;

        return [sumX, sumY]
    }        

    //TODO: write function to implement cohesion

    render(ctx, boids) {
        ctx.fillStyle = this.color;
        this.drawBody(ctx);

        let neighbors = this.computeNeighbors(boids);

        if (neighbors.length > 0) {
            //TODO: clean this code and rename it properly
            let avgHeading = this.avgHeading(neighbors);
            let [x, y] = this.avgDistance(neighbors);
            let avgDistance = Math.atan2(y, x);
            
            // ctx.moveTo(this.x, this.y);
            // ctx.lineTo(this.x + 100 * Math.cos(avgDistance), this.y + 100 * Math.sin(avgDistance));
            // ctx.stroke();
            // console.log(x, y)

            this.heading += 0.07 * angleBetween(this.heading, avgHeading) + 0.01 * angleBetween(this.heading, avgDistance);
        }

        // console.log(angleBetween(45, 315), angleBetween(315, 45), "90");
        // console.log(angleBetween(135, 225), angleBetween(225, 135), "90");
        // console.log(angleBetween(0, 90), angleBetween(90, 0), "90");
        // console.log(angleBetween(30, 240), angleBetween(240, 30), "150");

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
            this.x = Math.max(0, Math.min(window.innerWidth - this.size, this.x));
        }
        if (this.outOfBoundsY(this.y)) {
            this.heading = reflectY(this.heading);
            this.y = Math.max(0, Math.min(window.innerHeight - this.size, this.y));
        }
    }
}

export { Boid };