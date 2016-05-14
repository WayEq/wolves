/*global */
/*eslint-env jquery, paper.js */

import { Animal} from './Animal.js';
import { Rabbit} from './Rabbit.js';

export class Wolf extends Animal {
   constructor(x,y) {
      super('wolf',x,y);
      this.startHealth = $('#wolfStartHealth').text();
      this.maxSpeed = $('#wolfMaxSpeed').text();
      this.health = this.startHealth;
      this.food = Rabbit.population;
      this.population = Wolf.population;
   }
}
