var points = [];
var acceleration = [];
var velocity = [];

var topspeed;

var numpoints_slider;
var topspeed_slider;
var pointsdimension_slider;

var menu;

var font;

function preload() {
  font = loadFont("assets/SourceCodePro-ExtraLight.ttf");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  menu = new Menu();

  numpoints_slider = createSlider(500, 1500, 1000);
  numpoints_slider.position(20, 20);
  numpoints_slider.hide();
  topspeed_slider = createSlider(10, 40, 20);
  topspeed_slider.position(20, 50);
  pointsdimension_slider = createSlider(0.5, 10, 1);
  pointsdimension_slider.position(20, 80);

  topspeed = topspeed_slider.value();

  for (var i = 0; i < numpoints_slider.value(); i++) {
    points.push(createVector(random(width), random(height)));
    acceleration.push(createVector(0, 0));
    velocity.push(createVector(0, 0));
  }
}

function draw() {
  background(0);

  menu.open(mouseX, mouseY);
  menu.animate();
  menu.display();

  model();
  view();
}

function model() {
  topspeed = topspeed_slider.value();
  var numpoints = numpoints_slider.value();

  for (var i = 0; i < points.length; i++) {
    var center_gravity = createVector(width / 2, height / 2);
    acceleration[i] = p5.Vector.sub(center_gravity, points[i]);
    acceleration[i].normalize();
    acceleration[i].mult(0.5);
    velocity[i].add(acceleration[i]);
    velocity[i].limit(topspeed);
    points[i].add(velocity[i]);
  }

  if (points.length > numpoints) {
    points.splice(0, points.length - numpoints);
    acceleration.splice(0, points.length - numpoints);
    velocity.splice(0, points.length - numpoints);
  } else if (points.length < numpoints_slider.value()) {
    for (var i = 0; i < numpoints; i++) {
      points.push(createVector(random(width), random(height)));
      acceleration.push(createVector(0, 0));
      velocity.push(createVector(0, 0));
    }
  }
}

function view() {
  var pointsdimension = pointsdimension_slider.value();
  for (var i = 0; i < points.length; i++) {
    stroke(255);
    strokeWeight(pointsdimension);
    point(points[i].x, points[i].y);
  }
}

var Menu = function() {
  this._location = createVector(5, 5);
  this.dimension = createVector(0, 0);
  this.newdimension = createVector(30, 30);
  this.activated = false;

  this.open = function(x, y) {
    if (x < this._location.x + this.dimension.x && x > this._location.x && y < this._location.y + this.dimension.y && y > this._location.y) {
      this.newdimension = createVector(340, 200);
      this.activated = true;
    } else {
      this.newdimension = createVector(30, 30);
      this.activated = false;
    }
  }

  this.animate = function() {
    var direction = p5.Vector.sub(this.newdimension, this.dimension);
    var velocity = p5.Vector.div(direction, 7);
    this.dimension.add(velocity);

    if (velocity.mag() < 3 && this.activated) {
      numpoints_slider.show();
      topspeed_slider.show();
      pointsdimension_slider.show();

      stroke(255);
      strokeWeight(0.4);
      textFont(font);
      textSize(14);
      textAlign(LEFT, TOP);
      text("Number of particles", 170, 20);
      text("Particles speed", 170, 50);
      text("Particles dimension", 170, 80);
      textAlign(CENTER, TOP);
      text("Try to resize the browser", (this._location.x/2)+(this.dimension.x/2), 120);
      text(".chaos", (this._location.x/2)+(this.dimension.x/2), 160);
      textSize(10);
      strokeWeight(0.3);
      stroke(150);
      text("kessondalef", (this._location.x/2)+(this.dimension.x/2), 180);
    } else if (!this.activated) {
      numpoints_slider.hide();
      topspeed_slider.hide();
      pointsdimension_slider.hide();
    }
  }

  this.display = function() {
    fill(255, 100);
    noStroke();
    rect(this._location.x, this._location.y, this.dimension.x, this.dimension.y);
  }
}