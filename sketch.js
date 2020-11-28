var  dog, happyDog, lazyDog, database, foodS, foodStock;
var dogSprite, happyDogSprite;
var foodObj;
var clicks = 0;
var fedTime, lastFed;
var bedroom, washroom, garden;
var gameState;
var currentTime;
var m;
var lastM;


function preload() {
  dog = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");
  lazyDog = loadImage("Lazy.png");
  bedroom = loadImage("BedRoom.png");
  washroom = loadImage("WashRoom.png");
  garden = loadImage("Garden.png");
}

function setup() {
  createCanvas(460, 800);
  database = firebase.database();

  dogSprite = createSprite(230, 400, 50, 50);
  //dogSprite.addImage(dog);
  dogSprite.scale = .4;

  foodS = database.ref("Food");
  foodS.on("value", function(data){
    foodS = data.val();
  });
  gameState = database.ref("gameState");
  gameState.on("value", function(data){
    gameState = data.val();
  });
  foodObj = new Food();
}


function draw() {  
  background(0, 120, 180);
  fill("black");
  textSize(24);
  text("Food Remaining: " + foodS, 130, 200);
  var feed = createButton("Feed the Dog");
  feed.position(145, 620);
  feed.mousePressed(feedDog);
  var addFood = createButton("Add Food");
  addFood.position(245, 620);
  addFood.mousePressed(addFoods);
  push();
  textSize(24);
  text("You have added food " + clicks + " times", 80, 695);
  pop();
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  }); 
  lastM = database.ref('lastMinute');
  lastM.on("value", function(data){
    lastM = data.val();
  });
  currentTime = hour();
  m = minute();
  if(currentTime > 12){
    if(m < 10){
    text("Time Now- " + (currentTime % 12) + ":" + 0 + m + " PM", 120, 730);
    }else{
    text("Time Now- " + (currentTime % 12) + ":" + m + " PM", 120, 730);
    }
  }else if(currentTime === 0){
    if(m < 10){
    text("Time Now- " + 12 + ":" + 0 + m + " AM", 120, 730);
    }else{
    text("Time Now- " + 12 + ":" + m + " AM", 120, 730);
    }
  }else if(currentTime === 12){
    if(m < 10){
    text("Time Now- " + 12 + ":" + 0 + m + " PM", 120, 730);
    }else{
    text("Time Now- " + 12 + ":" + m + " PM", 120, 730);
    }
  }else{
    if(m < 10){
    text("Time Now- " + currentTime + ":" + 0 + m + " AM", 120, 730);
    }else{
    text("Time Now- " + currentTime + ":" + m + " AM", 120, 730);
    }
  }
  if(currentTime === (lastFed + 1)){
    updateGamestate("Playing");
    foodObj.gardenBackground();
    feed.hide();
    dogSprite.remove();
  }else if(currentTime === (lastFed + 2)){
    updateGamestate("Sleeping");
    foodObj.bedroomBackground();
    feed.hide();
    dogSprite.remove();
  }else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    updateGamestate("Bathing");
    foodObj.washroomBackground();
    feed.hide();
    dogSprite.remove();
  }else if(currentTime === lastFed){
       dogSprite.addImage(happyDog);
  }else{
    updateGamestate("Hungry");
    feed.show();
    dogSprite.addImage(lazyDog);
    text("I'm Hungry", 160, 300);
  }
  push();
  textSize(15);
  if(lastFed > 12){
    if(lastM < 10){
    text("Last Fed At " + (lastFed % 12) + ":" + 0 + lastM + " PM", 170, 670);
    }else{
      text("Last Fed At " + (lastFed % 12) + ":" + lastM + " PM", 170, 670);
    }
  }else if(lastFed === 0){
    if(lastM < 10){
    text("Last Fed At " + 12 + ":" + 0 + lastM + "AM", 170, 670);
    }else{
      text("Last Fed At " + 12 + ":" + lastM + "AM", 170, 670);
    }
  }else if(lastFed === 12){
    if(lastM < 10){
    text("Last Fed At " + 12 + ":" + 0 + lastM + "PM", 170, 670);
    }else{
      text("Last Fed At " + 12 + ":" + lastM + "PM", 170, 670);
    }
  }else{
    if(lastM < 10){
    text("Last Fed At " + lastFed  + ":" + 0 + lastM + "AM", 170, 670);
    }else{
      text("Last Fed At " + lastFed  + ":" + lastM + "AM", 170, 670);
    }
  }
  pop();
  console.log(lastFed);
  drawSprites();
  foodObj.display();
}

function readPosition(data) {
  position = data.val();
}
function feedDog(){
  if(foodS > 0){
  dogSprite.addImage(happyDog);
  foodObj.updateFoodStock(foodS);
  database.ref('/').update({
    Food: foodS--,
    FeedTime: hour(),
    lastMinute: minute()
  });
}
}

function addFoods(){
  if(foodS < 10){
  foodS++;
  clicks++;
  database.ref('/').update({
    Food: foodS
  });
  }
}
function updateGamestate(state){
  database.ref('/').update({
    gameState: state
  });
}
