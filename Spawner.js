import CircleGuy from "./CircleGuy.js";
import Food from "./Food.js";
import Spike from "./Spike.js";
export default class Spawner {
  constructor(game) {
    this.game = game;
    this.spikes = 0;
    this.maxEnemies = 0;
    this.start();
    this.spawnTimer = Date.now();
    this.spawnDelay = 5000;
  }

  start() {
    // this.game.map.tiles.length / 100
    for (let i = 0; i < this.game.map.tiles.length / 20; i++) {
      this.maxEnemies += 1;
      if(this.maxEnemies % 10 == 0) {
        this.spikes += 1;
        let spike = new Spike(this.game,
          returnBetween2(
            this.game.map.lowerMapBoundsX,
            this.game.map.upperMapBoundsX
          ),
          returnBetween2(
            this.game.map.lowerMapBoundsY,
            this.game.map.upperMapBoundsY
          ));
          this.game.spikes.push(spike);
      }
      for (let i = 0; i < 2; i++) {
        let food = new Food(
          this.game,
          returnBetween2(
            this.game.map.lowerMapBoundsX,
            this.game.map.upperMapBoundsX
          ),
          returnBetween2(
            this.game.map.lowerMapBoundsY,
            this.game.map.upperMapBoundsY
          )
        );
        this.game.foods.push(food);
      }
    }
    console.log("this many spikes: " + this.spikes);

    // console.log("this many enemies: " + this.maxEnemies);
    // console.log("tiles: " + this.game.map.tiles.length);
  }

  update() {
    let currentTime = Date.now();
    let diffTime = currentTime - this.spawnTimer;
    if (diffTime >= this.spawnDelay) {
      console.log("spawn!");
      // console.log(this.game.circles.length);
      // console.log(this.maxEnemies);

      for (let i = this.game.circles.length; i < this.maxEnemies; i++) {
        let randX = returnBetween2(
          this.game.map.lowerMapBoundsX,
          this.game.map.upperMapBoundsX
        );
        let randY = returnBetween2(
          this.game.map.lowerMapBoundsY,
          this.game.map.upperMapBoundsY
        );
        console.log("random x: " + randX);
        console.log("random y: " + randY);
        let circle1 = new CircleGuy(this.game, randX, randY);

        circle1.r = circle1.r * this.game.currentScale;
        circle1.dx = circle1.dx * this.game.currentScale;
        circle1.dy = circle1.dy * this.game.currentScale;
        this.game.circles.push(circle1);
        console.log("spawned an enemy");
      }
      this.spawnTimer = Date.now();
    }
  }
  draw(ctx) {
    
  }
}

function returnBetween2(low, high) {
  return Math.random() * (high - low) + low;
}
