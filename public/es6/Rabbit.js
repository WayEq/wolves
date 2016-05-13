/*global   Matrix */
/*eslint-env jquery, paper.js */
import {Animal} from './Animal.js';
import {Plant} from './Plant.js';

export class Rabbit extends Animal {
   constructor(x,y) {
      super('rabbit',x,y);

      this.icon.transform(new Matrix(-1,0,0,1,this.icon.position.x*2,0));
      this.startHealth = $('#rabbitStartHealth').val();
      this.maxSpeed = $('#rabbitMaxSpeed').val();
      this.health = this.startHealth;
      this.food = Plant.population;
      this.population = Rabbit.population;
      console.log('this pop: ' + this.population);
   }
   eatFood(closestFood) {
      this.food.splice(this.food.indexOf(closestFood),1);
      closestFood.icon.remove();
      this.health = this.startHealth;
      this.icon.position.x += 20;
      this.icon.position.y += 20;
      Rabbit.population.push(new Rabbit(this.icon.position.x-20,this.icon.position.y-20));
   }
}
