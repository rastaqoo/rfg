import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import GameLayout            from '../layout/GameLayout'
import GameLogic             from '../logic/GameLogic'
import GameComponentFactory  from '../factory/GameComponentFactory'

export default class extends Phaser.State {
  init () {

    this.enterTime = this.game.time.time;

  }

  preload () {
  }

  create () {
    const bannerText = 'Game Over\r\n(Score: '+GameLogic.getScore()+')';
    var textComponent = GameComponentFactory.getText(this.game,this.world.centerX, this.world.centerY, bannerText)
    var b = this.add.existing(textComponent);
    b.inputEnabled = true;
    b.events.onInputDown.add(this.continuePlay, this);

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
