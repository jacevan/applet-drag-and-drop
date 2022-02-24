class DragDropManager {
  constructor(dragData, dropData) {
    this.drags = [];
    this.drops = [];
    this.createDrags(dragData);
    this.createDrops(dropData);

    this.activeDrag = undefined;
    this.matches = []
  }

  createDrags(dragData) {
    for (let drag of dragData) {
      this.drags = [...this.drags, new Drag(drag.x, drag.y, drag.width, drag.height, drag.id, drag.content)];
    }
    console.log(this.drags)
  }

  createDrops(dropData) {
    for (let drop of dropData) {
      this.drops = [...this.drops, new Drop(drop.x, drop.y, drop.width, drop.height, drop.ids)];
    }
    console.log(this.drops)
  }

  update() {
    this.updateDrops();
    this.updateDrags();
    this.updateMatches();
  }

  updateDrops() {
    if (this.activeDrag !== undefined) {
      this.getDragDropOverlaps();
      this.setDropHighlight();
    }
    for (let drop of this.drops) {
      drop.update();
    }
  }

  updateDrags() {
    this.checkDragMouseOver();
    for (let drag of this.drags) {
      drag.update();
    }
    // keep active drag on top
    if (this.activeDrag !== undefined) {
      this.activeDrag.update();
    }
  }

  checkDragMouseOver() {
    if (this.activeDrag === undefined) {
      for (let drag of this.drags) {
        drag.checkMouseOver();
      }
    }
  }

  checkDragMousePressed() {
    for (let drag of this.drags) {
      if (drag.isMouseOver) {
        this.activeDrag = drag;
        this.activeDrag.pressed();
        break;
      }
    }
  }

  mousePressed() {
    this.checkDragMousePressed();
  }

  mouseReleased() {
    if (this.activeDrag !== undefined) {
      this.activeDrag.released();
      this.getDragDropOverlaps();
      this.setDropHighlight();
      this.activeDrag = undefined;
    }
    this.updateMatches();
  }

  updateMatches() {
    this.matches = [];
    
    for (let drop of this.drops) {
      
      if (drop.attachedDrag !== undefined) {
        this.matches = [...this.matches, drop.ids.includes(drop.attachedDrag.id)];
      } else {
        this.matches = [...this.matches, undefined]
      }
    }
  }

  getDragDropOverlaps() {
    for (let drop of this.drops) {
      let overlapWidth = 0;
      let overlapHeight = 0;

      let dLeft = drop.width - (this.activeDrag.left - drop.left)
      let dRight = drop.width - (drop.right - this.activeDrag.right)
      let dTop = drop.height - (this.activeDrag.top - drop.top)
      let dBottom = drop.height - (drop.bottom - this.activeDrag.bottom)

      if (dLeft > 0 && dLeft <= drop.width) {
        overlapWidth = dLeft;
      }
      if (dRight > 0 && dRight <= drop.width && dRight > overlapWidth) {
        overlapWidth = dRight;
      }
      if (dTop > 0 && dTop <= drop.height) {
        overlapHeight = dTop;
      }
      if (dBottom > 0 && dBottom <= drop.height && dBottom > overlapHeight) {
        overlapHeight = dBottom;
      }

      drop.overlap = overlapWidth * overlapHeight;
    }
    
  }

  getMaxOverlap() {
    let maxOverlap = 0;
    for (let drop of this.drops) {
      if (drop.overlap > maxOverlap) {
        maxOverlap = drop.overlap
      }
    }
    return maxOverlap;
  }

  setDropHighlight() {
    const maxOverlap = this.getMaxOverlap();
    if (maxOverlap === 0) {
      this.activeDrag.overDrop = undefined;
    }
    for (let drop of this.drops) {
      if (drop.overlap !== 0 && drop.overlap === maxOverlap) {
        drop.highlight = true;
        this.activeDrag.overDrop = drop;
      } else {
        drop.highlight = false;
      }
    }
  }
}

class Drop {
  constructor(x, y, width, height, ids) {
    this.left = x;
    this.right = x + width;
    this.top = y;
    this.bottom = y + height;
    this.width = width;
    this.height = height;

    this.ids = ids;

    this.overlap = 0;
    this.highlight = false;
    this.attachedDrag = undefined;

    this.draw();
  }

  draw() {
    strokeWeight(4);
    if (this.attachedDrag === undefined && this.highlight) {
      stroke('white');
      fill(codecademyDragOver);
    } else {
      stroke(codecademyDragDrop);
      fill(codecademyBackground);
    }
    rect(this.left, this.top, this.width, this.height);
  }

  update() {
    this.draw();
  }
}

class Drag {
  constructor(x, y, width, height, id, content) {
    this.homeX = x;
    this.homeY = y;
    this.left = x;
    this.right = x + width;
    this.top = y;
    this.bottom = y + height;
    this.width = width;
    this.height = height;

    this.id = id;
    this.content = content;
    this.image = undefined;

    this.isDragging = false;
    this.isMouseOver = false;
    this.overDrop = undefined;

    this.setup();
    this.draw();
  }

  checkMouseOver() {
    if (mouseX > this.left && 
        mouseX < this.right && 
        mouseY > this.top && 
        mouseY < this.bottom) {
      this.isMouseOver = true;
    } else {
      this.isMouseOver = false;
    }
  }

  setup() {
    if(this.content['type'] === 'image') {
      this.image = loadImage(this.content['content']);
    }
  }

  draw() {
    stroke('white');
    if (this.isDragging || this.isMouseOver) {
      strokeWeight(4);
    } else {
      strokeWeight(0);
    }
    fill(codecademyDragDrop);
    rect(this.left, this.top, this.width, this.height);
    if(this.content['type'] === "image") {
      image(this.image, this.left, this.top);
    }
    // fill("white")
    // textSize(32);
    // strokeWeight(0);
    // text(str(this.id), this.left + this.width/3, this.top+this.height/5, this.width, this.height);
  }

  update() {
    if (this.isDragging) {
      this.left = mouseX + this.offsetX;
      this.top = mouseY + this.offsetY;
      this.right = this.left + this.width;
      this.bottom = this.top + this.height;
    }

    this.draw();
  }

  pressed() {
    if (mouseX > this.left && 
        mouseX < this.right && 
        mouseY > this.top && 
        mouseY < this.bottom) {
      if (this.overDrop !== undefined) {
        this.overDrop.attachedDrag = undefined;
      }
      this.isDragging = true;
      this.offsetX = this.left - mouseX;
      this.offsetY = this.top - mouseY;
    }
  }

  released() {
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    if (this.overDrop !== undefined && 
        this.overDrop.attachedDrag === undefined) { 
      this.overDrop.attachedDrag = this;
      this.left = this.overDrop.left;
      this.top = this.overDrop.top;
    } else {
      this.left = this.homeX;
      this.top = this.homeY;
    }
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  getMatch() {
    if (this.overDrop === undefined) {
      return "undefined";
    }
    return this.overDrop.ids.includes(this.id);
  }
}