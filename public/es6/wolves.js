/*global view*/
/*eslint-env jquery, paper.js */
'use strict';

import {Plant} from './Plant.js';
import {Wolf}  from './Wolf.js';
import {Rabbit} from './Rabbit.js';
let Chart = require('chart.js');
let Paper = require('paper');

Plant.population = [];
Rabbit.population = [];
Wolf.population = [];

function spawn(num,ctor) {
   let a = [];
   for (let i=0;i<num;i++) {
      a.push(new ctor());
   }
   return a;
}

global.runTurn = function() {

   'use strict';
   let startWolfPopulation =$('#startWolfPopulation').val();
   let startRabbitPopulation =$('#startRabbitPopulation').val();
   let startPlantPopulation = $('#startPlantPopulation').val();
   let plantSpawnPerTurn = $('#plantSpawnPerTurn').val(); // per turn

   Paper.project.activeLayer.removeChildren();
   Plant.population.length = Rabbit.population.length = Wolf.population.length = 0;
   Plant.population.push(... spawn(startPlantPopulation,Plant));
   Rabbit.population.push(... spawn(startRabbitPopulation,Rabbit));
   Wolf.population.push(... spawn(startWolfPopulation,Wolf));

   let plantsLength = Array(10).fill(Plant.population.length);
   let rabbitsLength = Array(10).fill(Rabbit.population.length);
   let wolvesLength =Array(10).fill(Wolf.population.length);


   let ctx = document.getElementById('populationChart');

   let myChart = new Chart(ctx, {
      type: 'line',
      data: {
         labels: [10,9,8,7,6,5,4,3,2,1],
         datasets:
         [
            {
               label: 'Wolves',
               data: wolvesLength,
               borderColor: '#770000'
            },
            {
               label: 'Rabits',
               data: rabbitsLength,
               borderColor: '#000077'
            },
            {
               label: 'Plants',
               data: plantsLength,
               borderColor: '#007700'
            }
         ]
      },
      options: {
         scales: {
            yAxes: [{
               ticks: {
                  beginAtZero:true
               }
            }]
         }
      }
   });

   let i=0;
   view.onFrame = function(event) {
      if (i%20 === 0 ) {
         plantsLength.shift();
         wolvesLength.shift();
         rabbitsLength.shift();
         plantsLength.push(Plant.population.length);
         wolvesLength.push(Wolf.population.length);
         rabbitsLength.push(Rabbit.population.length);
         myChart.update();
      }
      if (++i%2 !== 0) {
         return;
      }
      for (let i=0;i<Rabbit.population.length;i++) {
         Rabbit.population[i].runTurn();
      }
      for (let i=0;i<Wolf.population.length;i++) {
         Wolf.population[i].runTurn();
      }
      if (Math.random() < (.05 * plantSpawnPerTurn)) {
         spawn(1,Plant).map(e => Plant.population.push(e));
      }

   };
   Paper.view.draw();
};
$(document).ready(function() {

   Paper.install(window);
   Paper.setup(document.getElementById('mainCanvas'));
   Paper.view.draw();


});
