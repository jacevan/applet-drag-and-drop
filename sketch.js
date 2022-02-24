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
  const tableHeight = windowHeight - promptHeight - dragHeight - resultHeight;
  const tableTop = promptHeight;
  const tableCenter = Math.floor(windowWidth / 2);
  let rowHeight = 80
  let rowAdjust = 40;
  let imageSize = 60;

  fill('white');
  textSize(24);
  for(let row of configRows) {
    if(row['typeColumn1'] === 'text') {
      textAlign(RIGHT, CENTER);
      text(row['contentColumn1'], tableCenter - rowHeight/2, tableTop + rowAdjust);
    } 
    if(row['typeColumn2'] === 'dragDrop') {
      drops = [...drops, 
                {
                  ids: [rowAdjust], 
                  x: tableCenter + 50,
                  y: tableTop + rowAdjust - imageSize / 2, // image height hardcoded
                  width: imageSize, // image width hardcoded
                  height: imageSize // image height hardcoded
                }
      ]
      drags = [...drags,
                {
                  id: rowAdjust, 
                  content: row['contentColumn2']
                }
      ]
    } 
    rowAdjust += rowHeight;
  }

  strokeWeight(4);
  stroke(255);
  // line(tableCenter, tableTop, tableCenter, tableTop + rowAdjust - 50)
  dragTop = tableTop + rowAdjust - rowHeight/2
}

function drawDragFrame() {
  let columnAdjust = 10; 
  let columnWidth = 80
  let rowAdjust = 40;
  let imageSize = 60;
  const centerWidth = Math.floor(drags.length / 2) * columnWidth; // hardcoded
  const dragStart = Math.floor(windowWidth / 2) - centerWidth;
  const dragY = dragTop + columnAdjust;


  drags.forEach(drag => {
    drag.x = dragStart + 10 // hardcoded
    drag.y = dragY
    drag.width = imageSize;
    drag.height = imageSize;
    columnAdjust += columnWidth;
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
  

