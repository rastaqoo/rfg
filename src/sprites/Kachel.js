import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.angleInc = 1; 
  }

  update () {
    //this.angle = (Math.sin(this.y/60) * 10) -5;
    // console.log(this.scale);
    //this.scale.x = 1 + (Math.sin(this.y/60) /5);
    //this.scale.y = 1 + (Math.sin(this.y/60) /5);
  }
}
