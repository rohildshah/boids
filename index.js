import { Boid } from './boid.js';

const FPS = 50;

var c = document.getElementsByTagName('canvas')[0];
var ctx = c.getContext('2d');

c.width  = window.innerWidth;
c.height = window.innerHeight;

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

    //halve excess space to center the grid
    let grid_width = 50;
    let horiz_offset = c.width % grid_width / 2;
    let vert_offset = c.height % grid_width / 2;

    //draw vertical lines
    for (let i = horiz_offset; i < c.width; i += grid_width) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, c.height);
    }

    //draw horizontal lines
    for (let i = vert_offset; i < c.height; i += grid_width) {
        ctx.moveTo(0, i);
        ctx.lineTo(c.width, i);
    }

    ctx.stroke();
    ctx.strokeStyle = "#000000";
}

document.getElementById('alignment').oninput = function() {
    state["align"] = this.value != 1;
    state["alignment_factor"] = 15 - 1.4 * this.value;
}

document.getElementById('separation').oninput = function() {
    state["separate"] = this.value != 1;
    state["separation_factor"] = 1.9 - 0.18 * this.value;
}

document.getElementById('cohesion').oninput = function() {
    state["cohese"] = this.value != 1;
    state["cohesion_factor"] = 199 - 19.8 * this.value;
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
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
});

intervalId = setInterval(() => {
    main();
}, 1000 / FPS);
running = true;

console.log("Started running");