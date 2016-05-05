/*global paper Shape Point Raster view*/
/*eslint-env jquery, paper.js */
'use strict';

let startPopulation = 10;
let startFood = 10;
let foodSpawnPerTurn = 1; // per turn

let wolfStartHealth = 100;
let wolfMaxSpeed = 10;
let wolfStartSize = 10;

function dist(a,b) {
   return Math.abs(a.icon.position.x - b.icon.position.x) + Math.abs(a.icon.position.y - b.icon.position.y);
}

class Food {
   constructor() {

      //this.icon = Shape.Rectangle(600,300, 10,10);
      this.icon = new Raster('rabbit.gif',Math.floor(Math.random()*document.getElementById('mainCanvas').width),
      Math.floor(Math.random()*document.getElementById('mainCanvas').height));
      this.icon.fillColor = 'black';
   }
}

let wolfId = 0;
class Wolf {
   constructor() {
      const startHealth = 100;
      this.id = wolfId++;

      this.health = startHealth;
      //if (wolfId === 6) {
         this.icon = new Raster('wolf', Math.floor(Math.random()*document.getElementById('mainCanvas').width),
                                  Math.floor(Math.random()*document.getElementById('mainCanvas').height));
      // } else {
      //    //this.icon = Shape.Circle(800,400, 10);
      //    this.icon = Shape.Circle(Math.floor(Math.random()*document.getElementById('mainCanvas').width),
      //                             Math.floor(Math.random()*document.getElementById('mainCanvas').height), 10);
         this.icon.fillColor = 'green';
      //}
      console.log('created wolf at: ' + this.icon.position);
   }
   getMoveDist() {
      return wolfMaxSpeed * (1 - (this.health / wolfStartHealth));
   }
   moveTowardFood(closestFood) {

      //console.log('im at : '+ this.icon.position);
      //console.log('need to get to: '+ closestFood.icon.position);
      let vector = new Point(closestFood.icon.position.x - this.icon.position.x,
                                   closestFood.icon.position.y - this.icon.position.y);
      //console.log('vector '+vector);
      //let moveDist = 50 - 5*this.health;
      let xMove =Math.abs(vector.x) * this.getMoveDist() / (Math.abs(vector.y) + Math.abs(vector.x));
      xMove = (vector.x < 0) ? xMove *= -1 : xMove;
      xMove = Math.abs(vector.x) - Math.abs(xMove) > 0 ? xMove : vector.x;
      let yMove = this.getMoveDist() - Math.abs(xMove);
      yMove =  (vector.y < 0) ? yMove *= -1 : yMove;
      yMove = Math.abs(vector.y) - Math.abs(yMove) > 0 ? yMove : vector.y;

      //console.log('xmove: ' + xMove  + ' ymove: ' + yMove);
      let that = this;
      let target = new Point(that.icon.position.x+xMove,that.icon.position.y+yMove);
      this.icon.position.x = target.x;
      this.icon.position.y = target.y;
      if (this.near(closestFood.icon.position)) {
         //console.log('EATING');
         this.eatFood(closestFood);
      }
      this.health--;
      this.icon.radius = wolfStartSize *  (this.health/ wolfStartHealth);
      if (that.health == 0) {
         that.icon.rotate(180);
         wolves = wolves.filter(w => w.id !== that.id);
         setTimeout(() => that.icon.remove(),500);
      }

      // return new Promise(function(resolve, reject) {
      //    view.onFrame = function(event) {
      //       let pv = new Point(target.x - that.icon.position.x,target.y - that.icon.position.y);
      //
      //       if (that.near(closestFood.icon.position)) {
      //          //console.log('EATING');
      //          that.eatFood(closestFood);
      //       }
      //       if (that.near(target)) {
      //          that.health--;
      //          that.icon.radius = that.health * 3;
      //          if (that.health == 0) {
      //             that.icon.fillColor = 'red';
      //             wolves = wolves.filter(w => w.id !== that.id);
      //          }
      //          view.onFrame = null;
      //          resolve();
      //       }
      //       that.icon.position.x  += pv.x / 2;
      //       that.icon.position.y  += pv.y / 2;
      //
      //       //console.log('c: ' + that.icon.position + ' .');
      //       paper.view.draw();
      //    };
      // });
   }
   runTurn() {

      //console.log('wolf ' + this.id);
      let that = this;
      if (food.length < 1) {
         return;
      }
      let closestFood = food.reduce((ret,a) =>
         dist(a,that) < dist(ret,that)? a : ret
      );
      this.moveTowardFood(closestFood);

   }
   near(point) {
      return ((Math.abs(this.icon.position.x - point.x) < 1) &&
         (Math.abs(this.icon.position.y - point.y) < 1));
   }
   eatFood(closestFood) {
      food = food.filter(e => (! this.near(e.icon.position)));
      closestFood.icon.remove();
      this.health = wolfStartHealth;
      this.icon.radius = wolfStartSize;
   }
}

function spawn(num,ctor) {
   let a = [];
   for (let i=0;i<num;i++) {
      a.push(new ctor());
   }
   return a;
}

let i=0;
function runTurn() {

   'use strict';

   wolfStartHealth = $('#wolfStartHealth').val();
   startPopulation =$('#startPopulation').val();
   startFood = $('#startFood').val();
   foodSpawnPerTurn = $('#foodSpawnPerTurn').val(); // per turn
   wolfMaxSpeed = $('#wolfMaxSpeed').val();

   console.log('wsh: ' + wolfStartHealth);
   paper.install(window);
   paper.setup(document.getElementById('mainCanvas'));
   paper.view.draw();

   food = spawn(startFood,Food);
   wolves = spawn(startPopulation,Wolf);
   let special = wolves[5];
   special.getMoveDist = () => 10;
   special.icon.fillColor = 'blue';
   //console.log('running');
   view.onFrame = function(event) {
      if (i++%5 !== 0) {
         return;
      }
      if(i===5) {
         i=0;
      }
      for (let i=0;i<wolves.length;i++) {
         wolves[i].runTurn();
      }
      if (Math.random() < (.05 * foodSpawnPerTurn)) {
         spawn(1,Food).map(e => food.push(e));
      }
      $('#numWolves').text(wolves.length);
      $('#numFood').text(food.length);
   };
   paper.view.draw();
   //runTurn();
   // grun(runWolves).then(function()  {
   //
   //    spawn(foodSpawnPerTurn,Food).map(e => food.push(e));
   //    paper.view.draw();
   //    runTurn();
   // });
}

let food;
let wolves;
