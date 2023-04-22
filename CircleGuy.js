export default class CircleGuy {
  constructor(game, x, y) {
    this.x = x;
    this.y = y;
    this.myTile = { tileX: x, tileY: y };
    this.r = Math.random() * 40 + 15;
    this.game = game;
    this.dx = Math.random() * 6 - 3;
    this.dy = Math.random() * 6 - 3;
    // this.dx = 0;
    // this.dy = 0;
    let red = Math.random() * 256;
    let green = Math.random() * 256;
    let blue = Math.random() * 256;
    this.color = `rgba(${red}, ${green}, ${blue})`;
    this.consumed = false;
    this.target = null;
    this.speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy) * this.game.currentScale;
    this.enemyAngle = 0;
  }
  update() {
    if(this.target  && !this.target.consumed) {
      console.log("my target has radius: " + this.target.r)
      let diffX = this.x - this.target.x;
      let diffY = this.y - this.target.y;
      this.enemyAngle = Math.atan2(diffY, diffX) + Math.PI;
      console.log(this.enemyAngle * 180 / Math.PI);
      this.x += Math.cos(this.enemyAngle) * this.speed;
      this.y += Math.sin(this.enemyAngle) * this.speed;
    } else {
      this.x += this.dx;
      this.y += this.dy;
    }

    console.log("my speed is: " + this.speed)
    // check for collision between this class and the player
    // first, check for distance between the two using pythagorean's theorem
    let diffX = this.x - this.game.player.getX();
    let diffY = this.y - this.game.player.getY();

    let dist = Math.sqrt(diffX * diffX + diffY * diffY);

    if (dist < this.r + this.game.player.getR() && !this.game.player.consumed) {
      if (this.r < this.game.player.getR()) {
        let newArea = this.getArea() + this.game.player.getArea();
        let newPlayerRadius = Math.sqrt(newArea / Math.PI);
        let ratio = this.game.player.getR() / newPlayerRadius;
        this.game.zoom(1, ratio);
        console.log(ratio);
        this.game.player.setR(
          Math.sqrt(
            this.r * this.r + this.game.player.getR() * this.game.player.getR()
          )
        );
        this.consumed = true;
      } else {
        let newArea = this.getArea() + this.game.player.getArea();
        let newRadius = Math.sqrt(newArea / Math.PI);
        this.setR(newRadius);
        this.game.player.consumed = true;
      }
    }

    this.game.circles.forEach((c) => {
      if (c != this) {
        // c.color = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;

        let diffX = this.x - c.x;
        let diffY = this.y - c.y;

        let dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist < this.r + c.r) {
          if (this.r < c.r) {
            let newArea = this.getArea() + c.getArea();
            let newCircleRadius = Math.sqrt(newArea / Math.PI);
            c.setR(newCircleRadius);
            this.consumed = true;
          } else {
            let newArea = this.getArea() + c.getArea();
            let newCircleRadius = Math.sqrt(newArea / Math.PI);
            this.setR(newCircleRadius);
            c.consumed = true;
          }
        }
      }
    });

    // //ai attempt gone wrong
    // if (this.nearestEnemy && !this.nearestEnemy.consumed) {
    //   let diffX = this.x - this.nearestEnemy.getX();
    //   let diffY = this.y - this.nearestEnemy.getY();
    //   this.distanceToNearestEnemy = Math.sqrt(diffX * diffX + diffY * diffY);

    //   // let realDiffX = this.x - this.nearestEnemy.getX();
    //   // let realDiffY = this.y - this.nearestEnemy.getY();
    //   // let angle = Math.atan2(realDiffY, realDiffX) + Math.PI;
    //   // this.dx = this.speed * Math.cos(angle);
    //   // this.dy = this.speed * Math.sin(angle);
    // }

    // for (let i = 0; i < this.game.circles.length - 1; i++) {
    //   for (let j = i; j < this.game.circles.length; j++) {
    //     if (
    //       this.distanceTo(this.game.circles[j]) <
    //       this.distanceTo(this.game.circles[i])
    //     ) {
    //     }
    //   }
    // }
    let shortestDistance = 10000;
    this.game.circles.forEach((c) => {
      if (c != this && c.r < this.r) {
        // c.r < this.r
        // !c.consumed
        if(c == this.game.player) {
          console.log("what thte fuck?")
        }
        let diffX = this.x - c.x;
        let diffY = this.y - c.y;
        let dist = Math.sqrt(diffX * diffX + diffY * diffY);

        if (dist < shortestDistance) {
          shortestDistance = dist;
          this.target = c;
        }

        // if (dist < this.distanceToNearestEnemy) {
        //   this.nearestEnemy = c;
        // }
      }
    });
    // console.log(shortestDistance);

    // let realDiffX = this.x - this.game.player.getX();
    // let realDiffY = this.y - this.game.player.getY();
    // let angle = Math.atan2(realDiffY, realDiffX) + Math.PI;
    // let speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    // this.dx = speed * Math.cos(angle);
    // this.dy = speed * Math.sin(angle);

    this.game.foods.forEach((f) => {
      let diffX = this.x - f.x;
      let diffY = this.y - f.y;
      let dist = Math.sqrt(diffX * diffX + diffY * diffY);
      if (dist < this.r + f.r && !f.setToRespawn) {
        let newArea = this.getArea() + f.getArea();
        let newCircleRadius = Math.sqrt(newArea / Math.PI);
        this.setR(newCircleRadius);
        f.setToRespawn = true;
        
      } 
    });

    let xLBound = this.game.map.lowerMapBoundsX;

    let xRBound = this.game.map.upperMapBoundsX;

    if (this.x < xLBound || this.x > xRBound) {
      this.dx = -this.dx;
    }
    let yLBound = this.game.map.lowerMapBoundsY;

    let yUBound = this.game.map.upperMapBoundsY;
    if (this.y < yLBound || this.y > yUBound) {
      this.dy = -this.dy;
    }
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    // if (this.nearestEnemy && !this.nearestEnemy.consumed) {
    //   ctx.strokeStyle = this.color;
    //   ctx.beginPath();
    //   ctx.moveTo(this.x, this.y);
    //   ctx.lineTo(this.nearestEnemy.x, this.nearestEnemy.y);
    //   ctx.stroke();
    // }
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
