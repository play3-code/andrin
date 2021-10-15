let geodata;
let treeData;

let backgroundImg;

let bounds = {
  left: 8.20782,
  top: 47.094669,
  right: 8.365691,
  bottom: 47.024504,
};

function preload() {
  geodata = loadJSON("lucerne-trees.json");
  backgroundImg = loadImage("tree_background.png");
}

let quadtree = d3.quadtree();
let highlightObj = null;

function setup() {
  createCanvas(900, 650);

  treeData = geodata.features;

  quadtree
    .x(function (d) {
      return d.geometry.coordinates[0];
    })
    .y(function (d) {
      return d.geometry.coordinates[1];
    })
    .addAll(treeData);

  noLoop();
}

function draw() {
  background(253);

  //drawTrees();

  image(backgroundImg, 0, 0, width, height);

  colorMode(RGB, 100);

  if (highlightObj) {
    let lon = highlightObj.geometry.coordinates[0];
    let lat = highlightObj.geometry.coordinates[1];
    let x = map(lon, bounds.left, bounds.right, 0, width);
    let y = map(lat, bounds.top, bounds.bottom, 0, height);

    let hoehe = highlightObj.properties.BAUMHOEHE;
    let krone = highlightObj.properties.KR_DURCHMESSER;

    let pflanzjahr = highlightObj.properties.PFLANZJAHR;
    let alter = 2021 - pflanzjahr;

    let alterText = "";
    if (pflanzjahr!=null) {
      alterText = "Er ist " + alter + " Jahre alt.";
    }

    noFill();
    stroke(0, 0, 0);
    ellipse(x, y, 15);
    ellipse(x, y, 5);
    ellipse(x, y, 1);
    /*line(x, y - 3, x, y + 3);
    line(x, y - 13, x, y + 13);
    line(x - 3, y, x + 3, y);
    line(x - 13, y, x + 13, y);*/

    textSize(12);
    noStroke();
    fill(0);
    // text("Höhe: " + hoehe + "m\nKronen-Durchmesser: " + krone + "m", mouseX+10, mouseY);
    text("Dieser Baum ist " + hoehe + " Meter hoch.\nund seine Krone ist " + krone + " Meter gross.\n" + alterText, mouseX+13, mouseY);

    noFill();
    strokeWeight(1);
    stroke(0);
    line(mouseX, mouseY, x, y);


  }
}

function mouseMoved() {
  // console.log('mouseMove', mouseX, mouseY);
  let lon = map(mouseX, 0, width, bounds.left, bounds.right);
  let lat = map(mouseY, 0, height, bounds.top, bounds.bottom);

  highlightObj = quadtree.find(lon, lat);
  redraw();
}

function keyTyped() {
  saveCanvas("tree_background", "png");
}

function drawTrees() {
  for (let i = 0; i < treeData.length; i++) {
    let treeObject = treeData[i];
    let geometry = treeObject.geometry;
    let properties = treeObject.properties;
    // console.log(properties);
    let coordinates = geometry.coordinates;
    let lat = coordinates[1];
    let lon = coordinates[0];

    let x = map(lon, bounds.left, bounds.right, 0, width);
    let y = map(lat, bounds.top, bounds.bottom, 0, height);

    let status = highlightObj.properties.INAKTIV;

    noStroke();
    if (status == 1) {
      fill(0, 0, 255, 100);
    } else {
      fill(50, 230, 70, 1);
    }
    ellipse(x, y, 20);
    ellipse(x, y, 8);
    ellipse(x, y, 2);
  }
}
