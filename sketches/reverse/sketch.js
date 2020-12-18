let arr = [60, 60, 74, 4, 18, 18];
const arrsize = 6;


let mat = [
  [2089, 436, 91, 19, 4, 1],
  [109, 436, 91, 19, 4, 1],
  [91, 364, 1729, 361, 76, 19],
  [19, 76, 361, 1729, 364, 91],
  [1, 4, 19, 91, 436, 109],
  [1, 4, 19, 91, 436, 2089]
]

let scaling = [1584, 396, 1584, 1584, 396, 1584];

for (let i = 0; i < mat.length; i++)
  for (let j = 0; j < mat[i].length; j++)
    mat[i][j] /= scaling[i];

let inp = createInputArr(arr);

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textSize(20);
}

const size = 300 / arrsize;
const boost = 20;
let selected = -1;
const growth = 0.4;

let framesSinceChange = 0;

function draw() {
  framesSinceChange += 15;
  if (framesSinceChange > 40) {
    framesSinceChange = 40;
  }

  push();
  translate(-50, -50);
  background(22);
  fill(255);

  text("Desired", 250, 75);
  text("Input", 250, 250)

  stroke(220);
  if (!mouseIsPressed) {
    if (selected == -1) {
      framesSinceChange = 0;
    }
    selected = -1;
  }

  for (let i = 0; i < arr.length; i++) {
    fill(255 / (100 + boost) * (arr[i] + boost));
    stroke(255 - 255 / (100 + boost) * (arr[i] + boost));
    if (mouseX >= i * size + 50 && mouseX < (i + 1) * size + 50 && mouseY > 150 && mouseY < 170 && !mouseIsPressed) {
      if (selected != i && selected != -1) {
        framesSinceChange = 0;
      }
      selected = i;
    } else if (selected != i) {
      rect(i * size + 100, 200, size, 20);
      textSize(10);
      fill(255 - 255 / (100 + boost) * (arr[i] + boost));
      text(round(arr[i] * 100) / 100, i * size + 100 + size / 2, 200 + 10)
    }
    fill(255 / (100 + boost) * (inp[i] + boost));
    stroke(255 - 255 / (100 + boost) * (inp[i] + boost));
    rect(i * size + 100, 400, size, 20);

    textSize(10);
    fill(255 - 255 / (100 + boost) * (inp[i] + boost));
    text(round(inp[i] * 100) / 100, i * size + 100 + size / 2, 400 + 10)
  }

  if (selected != -1) {
    fill(255 / (100 + boost) * (arr[selected] + boost));
    stroke(255 - 255 / (100 + boost) * (arr[selected] + boost));
    rect(selected * size + 100 - (size * (growth / 2) * (framesSinceChange) / 40), 200 - framesSinceChange, size + size * growth * (framesSinceChange) / 40, 20 + 80 * framesSinceChange / 40);
    textSize(10);
    fill(255 - 255 / (100 + boost) * (arr[selected] + boost));
    text(round(arr[selected] * 100) / 100, selected * size + 100 + size / 2, 200 + 10)
  }

  stroke(220);
  strokeWeight(2);

  for (let i = 0; i < arr.length; i++) {
    line(100 + size * (i), 190 - arr[i], 100 + (i + 1) * size, 190 - arr[i]);
    if (arr[i] != arr[i + 1])
      line(100 + size * (i + 1), 190 - arr[i], 100 + (i + 1) * size, 190 - arr[i + 1]);

    line(100 + size * (i), 370 - inp[i], 100 + (i + 1) * size, 370 - inp[i]);
    if (inp[i] != inp[i + 1])
      line(100 + size * (i + 1), 370 - inp[i], 100 + (i + 1) * size, 370 - inp[i + 1]);
  }
  pop();
}

function mouseDragged() {
  arr[selected] -= (mouseY - pmouseY) / 5;
  if (arr[selected] > 100) {
    arr[selected] = 100;
  } else if (arr[selected] < 0) {
    arr[selected] = 0;
  }

  inp = createInputArr(arr);
}

function createInputArr(arr) {
  let inp = [];
  for (let i = 0; i < arr.length; i++) {
    inp[i] = 0;
    for (let j = 0; j < arr.length; j++)
      inp[i] += arr[j] * mat[i][j];
  }

  return inp;
}

function visualize(arr, i) {
  let range = slider != null ? slider.value() : 1;
  return visualizeRange(arr, i, range, (i, j) => i / (5 * (range + j - 1)));
}

function visualizeRange(arr, i, range, inhibitionfunc) {
  let val = arr[i];

  for (let j = 1; j <= range; j++) {
    val -= inhibitionfunc((i - j > -1) ? arr[i - j] : arr[0], j);
    val -= inhibitionfunc((i + j < arr.length) ? arr[i + j] : arr[arr.length - 1], j);
  }

  return val;
}
