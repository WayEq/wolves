
export class Plant {
   constructor() {

      this.icon = new Raster('plant.png',Math.floor(Math.random()*document.getElementById('mainCanvas').scrollWidth),
      Math.floor(Math.random()*document.getElementById('mainCanvas').scrollHeight));
      this.icon.fillColor = 'black';
   }
}
