/*global paper Shape Point view*/
/*eslint-env jquery, paper.js */
'use strict';

const startPopulation = 10;
const startFood = 10;
const foodSpawnPerTurn = 2; // per turn

function dist(a,b) {
   return Math.abs(a.icon.position.x - b.icon.position.x) + Math.abs(a.icon.position.y - b.icon.position.y);
}

class Food {
   constructor() {

      //this.icon = Shape.Rectangle(600,300, 10,10);
      this.icon = Shape.Rectangle(Math.floor(Math.random()*document.getElementById('mainCanvas').width),
      Math.floor(Math.random()*document.getElementById('mainCanvas').height), 10,10);
      this.icon.fillColor = 'black';
   }
}

let wolfId = 0;
class Wolf {
   constructor() {
      this.id = wolfId++;

      this.health = 10;
      //this.icon = Shape.Circle(800,400, 10);
      this.icon = Shape.Circle(Math.floor(Math.random()*document.getElementById('mainCanvas').width),
                               Math.floor(Math.random()*document.getElementById('mainCanvas').height), 10);
      this.icon.fillColor = 'green';
      console.log('created wolf at: ' + this.icon.position);
   }
   getMoveDist() {
      return 50 - this.health * 5;
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
      that.health--;
      that.icon.radius = that.health * 3;
      if (that.health == 0) {
         that.icon.fillColor = 'red';
         wolves = wolves.filter(w => w.id !== that.id);
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
      this.health = 10;
      this.icon.radius = this.health * 3;
   }
}

function spawn(num,ctor) {
   let a = [];
   for (let i=0;i<num;i++) {
      a.push(new ctor());
   }
   return a;
}

function* runWolves() {
   for (let i=0;i<wolves.length;i++) {
      yield wolves[i].runTurn();
   }
}

// function grun(g) {
//    return new Promise(function(resolve, reject) {
//
//       const it = g();
//       (function iterate(val) {
//          const x = it.next(val);
//          if(!x.done) {
//             if(x.value instanceof Promise) {
//                x.value.then(iterate).catch(err => it.throw(err));
//             } else {
//                setTimeout(iterate, 0, x.value);
//             }
//          } else {
//             resolve();
//          }
//       })();
//
//    });
// }
function runTurn() {
   //console.log('running');

   for (let i=0;i<wolves.length;i++) {
      wolves[i].runTurn();
   }

   spawn(foodSpawnPerTurn,Food).map(e => food.push(e));
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
$(document).ready(function () {
   'use strict';

   paper.install(window);
   paper.setup(document.getElementById('mainCanvas'));
   paper.view.draw();

   food = spawn(startFood,Food);
   wolves = spawn(startPopulation,Wolf);
   let special = wolves[5];
   special.getMoveDist = () => 100;
   special.icon.fillColor = 'blue';

   setInterval(runTurn,50);

});
