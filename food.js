class Food{
    constructor(){
        this.image = loadImage("Milk.png");
        this.lastFed;
    }
    display(){
        var x, y = 0;

        imageMode(CENTER);

         if(foodS != 0){
            for(var i = 0; i < foodS; i++){
                if(i % 5 === 0){
                    x = 60;
                    y += 50;
                }
                image(this.image, x, y, 100, 100);
                x += 85;
            }
        }
    }
    getFoodStock(){
        var gFood = database.ref("Food");
        gFood.on("value", function(data){
            gFood = data.val();
        });
    }
    updateFoodStock(food){
        database.ref('/').update({
            Food: food
        });
    }
    deductFood(food){
        database.ref('/').set({
            Food: food - 1
        });
    }
    bedroomBackground(){
        background(bedroom, 500, 250);
    }
    gardenBackground(){
        background(garden, 500, 250)
    }
    washroomBackground(){
        background(washroom, 500, 250)
    }
}