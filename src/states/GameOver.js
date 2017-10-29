import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import GameLayout            from '../layout/GameLayout'
import GameLogic             from '../logic/GameLogic'
import GameComponentFactory  from '../factory/GameComponentFactory'
import config from '../config'

export default class extends Phaser.State {
  init () {

    this.enterTime = this.game.time.time;

  }

  preload () {
    this.load.image('kleckse', './assets/images/bg_kleckse.png')
  }

  create () {
    this.game.add.image(game.world.centerX, game.world.centerY, 'kleckse').anchor.set(0.5);
    const bannerText = 'Game Over \r\n(Score: '+GameLogic.getScore()+') ';
    var textComponent = GameComponentFactory.getText(
      { 
        game: this.game,
        x: this.world.centerX, 
        y: this.world.centerY, 
        text: bannerText,
        anchor: 0.5,
        fontSize: GameLayout.getScaledY(config.gameOverFontSize)
      })
    var b = this.add.existing(textComponent);
    b.inputEnabled = true;
    b.events.onInputDown.add(this.continueGame, this);

    this.backText = GameComponentFactory.getText(
      {
      game: this.game,
      x: game.world.centerX, 
      y: GameLayout.getScaledY(config.gameHeight-80), 
      text: 'Back to Menu ',
      anchor: 0.5
      });  

    this.backText = this.add.existing(this.backText);
    this.backText.inputEnabled=true;
    this.backText.events.onInputDown.add(this.continueGame.bind(this));

  }

  update() {

    if ((this.game.time.time - this.enterTime) > 5000)
    {
     //  this.state.start('Game');

    }

  }

  continueGame() 
  {
    this.state.start('Menu');
  }


  render () {
    
  }

}
