let testDrop
let testDrag;
let activeDrag = undefined;
let codecademyDragDrop;
let codecademyDragOver;
let codecademyBackground;

let drags = [];
let drops = [];

const promptHeight = 50;
const dragHeight = 100;
const resultHeight = 50;
let resultMessage = "";
let dragTop = 0;

let tableComplete = false;
let results = [];

let ddManager = undefined;

function setup() {
  codecademyBackground = color(17, 22, 45);
  codecademyDragDrop = color(42, 86, 246);
  codecademyDragOver = color(160, 162, 171);
  drawCanvas();
  drawPromptFrame();
  drawTableFrame();
  drawDragFrame();
  ddManager = new DragDropManager(drags, drops);
  drawResultFrame();
}

function draw(){
  drawCanvas();
  drawPromptFrame();
  drawTableFrame();
  drawDragFrame();
  drawResultFrame();
  ddManager.update();
}

function drawCanvas() {
  createCanvas(windowWidth, windowHeight);
  background(codecademyBackground);
}

function drawPromptFrame() {
  fill('white');
  textSize(24);
  textAlign(CENTER, CENTER);
  text(configPrompt, Math.floor(windowWidth / 2), 25);
}

function drawTableFrame() {
  const tableHeight = windowHeight - promptHeight - dragHeight;
  const tableTop = promptHeight;
  const tableCenter = Math.floor(windowWidth / 2);
  let rowAdjust = 50;

  fill('white');
  textSize(24);
  for(let row of configRows) {
    if(row['typeColumn1'] === 'text') {
      textAlign(RIGHT, CENTER);
      text(row['contentColumn1'], tableCenter - 50, tableTop + rowAdjust);
    } 
    if(row['typeColumn2'] === 'dragDrop') {
      drops = [...drops, 
                {
                  ids: [rowAdjust], 
                  x: tableCenter + 50,
                  y: tableTop + rowAdjust - 40, // image height hardcoded
                  width: 80, // image width hardcoded
                  height: 80 // image height hardcoded
                }
      ]
      drags = [...drags,
                {
                  id: rowAdjust, 
                  content: row['contentColumn2']
                }
      ]
    } 
    rowAdjust += 100;
  }

  strokeWeight(4);
  stroke(255);
  // line(tableCenter, tableTop, tableCenter, tableTop + rowAdjust - 50)
  dragTop = tableTop + rowAdjust - 50
}

function drawDragFrame() {
  const centerWidth = Math.floor(drags.length / 2) * 100; // hardcoded
  const dragStart = Math.floor(windowWidth / 2) - centerWidth;
  const dragX = dragTop + 10; // hardcoded
  let columnAdjust = 10; // hardcoded


  drags.forEach(drag => {
    drag.x = dragStart + columnAdjust
    drag.y = dragX
    drag.width = 80
    drag.height = 80
    columnAdjust += 100;
  });
}

function drawResultFrame() {
  const resultTop = dragTop + dragHeight;
  tableComplete = true;
  // ddManager.updateMatches();
  for(let match of ddManager.matches) {
    if(match === undefined) {
      tableComplete = false;
    }
  }

  let button = createButton("Check Answer");
  button.position(windowWidth - 200, resultTop + Math.floor(resultHeight / 2)); 
  button.mousePressed(checkAnswer);
  button.style("background-color", codecademyDragDrop);
  button.style("color", "white");
  button.removeAttribute("disabled");
  if(!tableComplete) {
    button.attribute("disabled", true);
    button.style("background-color", "grey");
  }
  textSize(16);
  textAlign(LEFT, CENTER);
  strokeWeight(1);
  text(resultMessage, 100, resultTop + Math.floor(resultHeight / 2))
}

function checkAnswer() {
  let correct = true;
  tableComplete = true;
  resultMessage = "";
  // ddManager.updateMatches();
  let rowCount = 1;
  for(let match of ddManager.matches) {
    if(!match) {
      correct = false;
      resultMessage += `Row ${rowCount} is incorrect. `
    }
    rowCount++;
  }
  if(correct) {
    resultMessage = "Correct!"
  }
}

function mousePressed() {
  ddManager.mousePressed();
}

function mouseReleased() {
  ddManager.mouseReleased();
  console.log(ddManager.matches);
}
  

