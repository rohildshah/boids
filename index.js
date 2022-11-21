import { Boid } from './boid.js';

const FPS = 50;

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
    num_boids: 200,
};

for (let i = 0; i < state["num_boids"]; i++) {
    boids.push(new Boid());
}

function main() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawGrid();

    for (var boid of boids) {
        boid.render(ctx);
        boid.update(boids, state);
    }

    console.log("ran");
}

function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = "#dddddd";

    for (let i = 0; i < c.width; i += 50) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, c.height);
    }
    for (let i = 0; i < c.height; i += 50) {
        ctx.moveTo(0, i);
        ctx.lineTo(c.width, i);
    }
    ctx.stroke();
    ctx.strokeStyle = "#000000";
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