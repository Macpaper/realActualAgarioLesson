export default class CircleGuy {
    constructor(game, x, y) {
      this.x = x;
      this.y = y;
      this.myTile = { tileX: x, tileY: y };
      this.r = 100;
      this.game = game;
      let red = 0;
      let green = 255;
      let blue = 0;
      this.color = `rgba(${red}, ${green}, ${blue})`;
    
    }
    update() {
        this.game.circles.forEach(c => {
            if (c.r > this.r) {
                let diffX = this.x - c.x;
                let diffY = this.y - c.y;
                let dist = Math.sqrt(diffX * diffX + diffY * diffY);
                if(dist < this.r + c.r) {    
                    c.consumed = true;
                }
            }
        });
    }
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      ctx.fill();

    }
  
    setR(r) {
      this.r = r;
    }
    getR() {
      return this.r;
    }
    setX(x) {
      this.x = x;
    }
    getX() {
      return this.x;
    }
    setY(y) {
      this.y = y;
    }
    getY() {
      return this.y;
    }
    getArea() {
      return Math.PI * this.r * this.r;
    }
    distanceTo(circle) {
      let diffX = this.getX() - circle.getX();
      let diffY = this.getY() - circle.getY();
      return Math.sqrt(diffX * diffX + diffY * diffY);
    }
  }
  