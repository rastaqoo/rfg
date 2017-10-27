import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import GameLayout from '../layout/GameLayout'

export default class extends Phaser.State {
  init () {

    this.enterTime = this.game.time.time;

  }

  preload () {
  }

  create () {
    const bannerText = 'Game Over\r\n(Score: '+this.state.states['Game'].score+')'
    let banner = this.add.text(this.world.centerX, this.world.centerY, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)
    banner.inputEnabled = true;
    banner.stroke = '#000000';
    banner.strokeThickness = 6;
    banner.fill = '#43d637';
    banner.events.onInputDown.add(this.continuePlay, this);

  }

  update() {

    if ((this.game.time.time - this.enterTime) > 5000)
    {
     //  this.state.start('Game');

    }

  }

  continuePlay() 
  {
    this.state.start('Game');
  }


  render () {
    if (__DEV__) {

       var scale = GameLayout.getScale();
       this.game.debug.text("sx: "+scale.x, 32, 32)
       this.game.debug.text("sy: "+scale.y, 32, 42)
    }
  }

}
