/*global Raster Point Matrix  */
/*eslint-env jquery, paper.js */

let animalId = 0;
export class Animal {
   constructor(icon,x,y) {
      this.id = animalId++;
      this.lastDirection = -1;
      if (! x) { x =  Math.floor(Math.random()*document.getElementById('mainCanvas').scrollWidth); }
      if (! y) { y =  Math.floor(Math.random()*document.getElementById('mainCanvas').scrollHeight); }
      this.icon = new Raster(icon,x,y);
   }

   dist(a,b) {
      return Math.abs(a.icon.position.x - b.icon.position.x) + Math.abs(a.icon.position.y - b.icon.position.y);
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
      let closestFood = this.food.reduce(function (ret,a) {
         let d = that.dist(a,that);
         //console.log('d: ' + d + ' ret: ' + ret);
         if (d < ret.dist) {
            let r = {val: a, dist: d};
            //console.log('returning: ' + r);
            return r;
         }
         return ret;
      },{val: null, dist: Infinity});
      this.moveTowardFood(closestFood.val);

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

export {Animal};
