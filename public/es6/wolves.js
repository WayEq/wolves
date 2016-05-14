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

global.adjustStat = function(id) {
   console.log(id);
   let bp = $('#buildPoints');
   let wsh = $('#wolfStartHealth');
   let wsp = $('#startWolfPopulation');
   let rsh = $('#rabbitStartHealth');
   let srp = $('#startRabbitPopulation');
   let spp = $('#startPlantPopulation');
   let wms = $('#wolfMaxSpeed');
   let rms = $('#rabbitMaxSpeed');
   let available = bp.text();
   console.log('av: ' + available);
   switch(id) {
   case 'wolfStartHealthPlus':
      if (available < 1) { return; }
      bp.text(+available - 1);
      wsh.text(+wsh.text() +1);
      break;
   case 'wolfStartHealthMinus':
      if (wsh.text() < 1) { return; }
      bp.text(+bp.text() + 1);
      wsh.text(+wsh.text() - 1);
      break;
   case 'startWolfPopulationPlus':
      if (available < 10) { return; }
      bp.text(+bp.text() - 10);
      wsp.text(+wsp.text() + 1);
      break;
   case 'startWolfPopulationMinus':
      if (wsp.text() < 1) { return; }
      bp.text(+bp.text() + 10);
      wsp.text(+wsp.text() - 1);
      break;
   case 'rabbitStartHealthPlus':
      if (available < 1) { return; }
      bp.text(+bp.text() - 1);
      rsh.text(+rsh.text() + 1);
      break;
   case 'rabbitStartHealthMinus':
      if (rsh.text() <1) {return;}
      bp.text(+bp.text() + 1);
      rsh.text(+rsh.text() - 1);
      break;
   case 'startRabbitPopulationPlus':
      if (available < 10) { return; }
      bp.text(+bp.text() - 10);
      srp.text(+srp.text() + 1);
      break;
   case 'startRabbitPopulationMinus':
      if (srp.text() <1) {return;}
      bp.text(+bp.text() + 10);
      srp.text(+srp.text() - 1);
      break;
   case 'startPlantPopulationPlus':
      if (available < 10) { return; }
      bp.text(+bp.text() - 10);
      spp.text(+spp.text() + 1);
      break;
   case 'startPlantPopulationMinus':
      if (spp.text() <1) {return;}
      bp.text(+bp.text() + 10);
      spp.text(+spp.text() - 1);
      break;
   case 'wolfMaxSpeedPlus':
      if (available < 200) { return; }
      bp.text(+bp.text() - 200);
      wms.text(+wms.text() + 1);
      break;
   case 'wolfMaxSpeedMinus':
      if (wms.text() <1) { return;}
      bp.text(+bp.text() + 200);
      wms.text(+wms.text() - 1);
      break;
   case 'rabbitMaxSpeedPlus':
      if (available < 200) { return; }
      bp.text(+bp.text() - 200);
      rms.text(+rms.text() + 1);
      break;
   case 'rabbitMaxSpeedMinus':
      if (rms.text() <1) { return;}
      bp.text(+bp.text() + 200);
      rms.text(+rms.text() - 1);
      break;
   }
};

global.runTurn = function() {

   'use strict';
   $('#days').text('0');
   let startWolfPopulation =$('#startWolfPopulation').text();
   let startRabbitPopulation =$('#startRabbitPopulation').text();
   let startPlantPopulation = $('#startPlantPopulation').text();
   let plantSpawnPerTurn = 2;//$('#plantSpawnPerTurn').text(); // per turn

   console.log(startWolfPopulation);
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
      if (Rabbit.population.length === 0 || Wolf.population.length === 0) {
         $('#days').text('GAME OVER! Lasted: ' + $('#days').text() + ' days.');
         view.onFrame = null;
      }
      if (i%20 === 0 ) {
         plantsLength.shift();
         wolvesLength.shift();
         rabbitsLength.shift();
         plantsLength.push(Plant.population.length);
         wolvesLength.push(Wolf.population.length);
         rabbitsLength.push(Rabbit.population.length);
         myChart.update();
         $('#days').text(+$('#days').text() + 1);
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
