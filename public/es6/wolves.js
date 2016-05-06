/*global paper project Point Raster Matrix view*/
/*eslint-env jquery, paper.js */
'use strict';


let plants = [];
let rabbits = [];
let wolves = [];

function dist(a,b) {
   return Math.abs(a.icon.position.x - b.icon.position.x) + Math.abs(a.icon.position.y - b.icon.position.y);
}

class Plant {
   constructor() {

      this.icon = new Raster('plant.png',Math.floor(Math.random()*document.getElementById('mainCanvas').scrollWidth),
      Math.floor(Math.random()*document.getElementById('mainCanvas').scrollHeight));
      this.icon.fillColor = 'black';
   }
}

let animalId = 0;

class Animal {
   constructor(icon,x,y) {
      this.id = animalId++;
      this.lastDirection = -1;
      if (! x) { x =  Math.floor(Math.random()*document.getElementById('mainCanvas').scrollWidth); }
      if (! y) { y =  Math.floor(Math.random()*document.getElementById('mainCanvas').scrollHeight); }
      this.icon = new Raster(icon,x,y);
   }
   getMoveDist() {
      return this.maxSpeed * (1 - (this.health / this.startHealth));
   }
   moveTowardFood(closestFood) {
      let vector = new Point(closestFood.icon.position.x - this.icon.position.x,
                                   closestFood.icon.position.y - this.icon.position.y);
      let xMove =Math.abs(vector.x) * this.getMoveDist() / (Math.abs(vector.y) + Math.abs(vector.x));

      let direction = 1;
      if (vector.x < 0) {
         direction = -1;
         xMove *= -1;
      }
      if (this.lastDirection != direction) {
         this.icon.transform(new Matrix(-1,0,0,1,this.icon.position.x*2,0));
      }
      this.lastDirection = direction;

      xMove = Math.abs(vector.x) - Math.abs(xMove) > 0 ? xMove : vector.x;
      let yMove = this.getMoveDist() - Math.abs(xMove);
      yMove =  (vector.y < 0) ? yMove *= -1 : yMove;
      yMove = Math.abs(vector.y) - Math.abs(yMove) > 0 ? yMove : vector.y;
      let target = new Point(this.icon.position.x+xMove,this.icon.position.y+yMove);
      this.icon.position.x = target.x;
      this.icon.position.y = target.y;
      if (this.near(closestFood.icon.position)) {
         this.eatFood(closestFood);
      }
      this.health--;
      if (this.health == 0) {
         this.icon.rotate(180);
         let that = this;
         this.population.splice(this.population.indexOf(this),1);
         setTimeout(() => that.icon.remove(),500);
      }

   }
   runTurn() {

      let that = this;
      if (this.food.length < 1) {
         return;
      }
      let closestFood = this.food.reduce((ret,a) =>
         dist(a,that) < dist(ret,that)? a : ret
      );
      this.moveTowardFood(closestFood);

   }
   near(point) {
      return ((Math.abs(this.icon.position.x - point.x) < 1) &&
         (Math.abs(this.icon.position.y - point.y) < 1));
   }
   eatFood(closestFood) {
      this.food.splice(this.food.indexOf(closestFood),1);
      closestFood.icon.remove();
      this.health = this.startHealth;
   }
}
class Wolf extends Animal {
   constructor(x,y) {
      super('wolf',x,y);
      this.startHealth = $('#wolfStartHealth').val();
      this.maxSpeed = $('#wolfMaxSpeed').val();
      this.health = this.startHealth;
      this.food = rabbits;
      this.population = wolves;
   }
}
class Rabbit extends Animal {
   constructor(x,y) {
      super('rabbit',x,y);
      this.startHealth = $('#rabbitStartHealth').val();
      this.maxSpeed = $('#rabbitMaxSpeed').val();
      this.health = this.startHealth;
      this.food = plants;
      this.population = rabbits;
   }
   eatFood(closestFood) {
      this.food.splice(this.food.indexOf(closestFood),1);
      closestFood.icon.remove();
      this.health = this.startHealth;
      this.icon.position.x += 20;
      this.icon.position.y += 20;
      this.population.push(new Rabbit(this.icon.position.x-20,this.icon.position.y-20));
   }
}

function spawn(num,ctor) {
   let a = [];
   for (let i=0;i<num;i++) {
      a.push(new ctor());
   }
   return a;
}

function runTurn() {

   'use strict';

   let startWolfPopulation =$('#startWolfPopulation').val();
   let startRabbitPopulation =$('#startRabbitPopulation').val();
   let startPlantPopulation = $('#startPlantPopulation').val();
   let plantSpawnPerTurn = $('#plantSpawnPerTurn').val(); // per turn

   project.activeLayer.removeChildren();
   plants.length = rabbits.length = wolves.length = 0;
   plants.push(... spawn(startPlantPopulation,Plant));
   rabbits.push(... spawn(startRabbitPopulation,Rabbit));
   wolves.push(... spawn(startWolfPopulation,Wolf));
   // let special = wolves[5];
   // special.getMoveDist = () => 10;
   // special.icon.fillColor = 'blue';

   let i=0;
   view.onFrame = function(event) {
      if (i++%2 !== 0) {
         return;
      }
      if(i===2) {
         i=0;
      }

      for (let i=0;i<rabbits.length;i++) {
         rabbits[i].runTurn();
      }
      for (let i=0;i<wolves.length;i++) {
         wolves[i].runTurn();
      }
      if (Math.random() < (.05 * plantSpawnPerTurn)) {
         spawn(1,Plant).map(e => plants.push(e));
      }
      $('#numWolves').text(wolves.length);
      $('#numRabbits').text(rabbits.length);
      $('#numPlants').text(plants.length);
   };
   paper.view.draw();
}
$(document).ready(function() {

   paper.install(window);
   paper.setup(document.getElementById('mainCanvas'));
   paper.view.draw();
});
