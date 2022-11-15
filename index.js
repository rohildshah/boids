import { Boid } from './boid.js';
import { rand } from './utility.js';

const FPS = 20;
var running = false;

var c = document.getElementsByTagName('canvas')[0];
var ctx = c.getContext('2d');
var intervalId;

var boids = [];

for (let i = 0; i < 20; i++) {
    boids.push(new Boid());
}

// boids.push(new Boid(250, 250, 7, 2.5));
// boids.push(new Boid(200, 300, 7, 2.5));
// boids.push(new Boid(150, 650, 7, 1));
// boids.push(new Boid(150, 150, 7, -1));

function render() {
    ctx.clearRect(0, 0, c.width, c.height);

    for (var boid of boids) {
        boid.render(ctx, boids);
    }

    console.log("ran");
}

document.addEventListener('keydown', (event) => {
    if (event.key === 's' && !running) {
        intervalId = setInterval(() => {
            render();
        }, 1000 / FPS);
        running = true;

        console.log("Started running");
    } else if (event.key === 's' && running) {
        clearInterval(intervalId);
        running = false;

        console.log("Stopped running");
    }
});