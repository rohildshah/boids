import { Boid } from './boid.js';
import { Vector } from './vector.js';
import { rand } from './utility.js';

const FPS = 20;
var running = false;

var c = document.getElementsByTagName('canvas')[0];
var ctx = c.getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var intervalId;

var boids = [];

for (let i = 0; i < 20; i++) {
    boids.push(new Boid());
}

// boids.push(new Boid(700, 400, 7, 0.1));
// boids.push(new Boid(65, 385, 7, 2.1));
// boids.push(new Boid(150, 650, 7, 1));
// boids.push(new Boid(150, 150, 7, -1));

function main() {
    ctx.clearRect(0, 0, c.width, c.height);

    for (var boid of boids) {
        boid.render(ctx);
        boid.update(ctx, boids);
    }

    console.log("ran");
}

document.addEventListener('keydown', (event) => {
    if (event.key === 's' && !running) {
        intervalId = setInterval(() => {
            main();
        }, 1000 / FPS);
        running = true;

        console.log("Started running");
    } else if (event.key === 's' && running) {
        clearInterval(intervalId);
        running = false;

        console.log("Stopped running");
    }
});


//TODO: fix blanking out of canvas when resizing
window.addEventListener('resize', () => {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
});