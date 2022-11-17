import { Boid } from './boid.js';

const FPS = 20;

var c = document.getElementsByTagName('canvas')[0];
var ctx = c.getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var intervalId;
var running = false;
var boids = [];

var state = {
    align: true,
    alignment_factor: 8,
    separate: true,
    separation_factor: 1,
    cohese: true,
    cohesion_factor: 100,
    goal: false,
    goal_factor: 500,
    goal_x: window.innerHeight / 2,
    goal_y: window.innerWidth / 2,
    max_speed: 10,
};

for (let i = 0; i < 200; i++) {
    boids.push(new Boid());
}

function main() {
    ctx.clearRect(0, 0, c.width, c.height);

    for (var boid of boids) {
        boid.render(ctx);
        boid.update(boids, state);
    }

    console.log("ran");
}

// document.getElementById('myRange').oninput = function() {
//     state["max_speed"] = this.value;
// }

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

intervalId = setInterval(() => {
    main();
}, 1000 / FPS);
running = true;

console.log("Started running");