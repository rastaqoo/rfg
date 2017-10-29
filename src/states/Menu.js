/* globals __DEV__ */
import Phaser from 'phaser'
import Platform from '../sprites/Platform'
import Kachel from '../sprites/Kachel'
import config from '../config'
import GameLayout from '../layout/GameLayout'
import GameLogic  from '../logic/GameLogic'
import GameComponentFactory from '../factory/GameComponentFactory'

export default class extends Phaser.State {

  init () {
    console.log("Menu State");

  }

  preload () {

    this.load.image('kleckse', './assets/images/bg_kleckse.png')
  }

  create () {

    this.game.add.image(game.world.centerX, game.world.centerY, 'kleckse').anchor.set(0.5);

    this.gameText = GameComponentFactory.getText({
      game: this.game,
      x: game.world.centerX, 
      y: game.world.centerY-GameLayout.getScaledY(config.menuFontSize), 
      text: 'Game ',
      anchor: 0.5,
      fontSize: GameLayout.getScaledY(config.menuFontSize)+20
    });  
    
    this.shopText = GameComponentFactory.getText(
      {
        game: this.game,
        x: game.world.centerX, 
        y: game.world.centerY+GameLayout.getScaledY(config.menuFontSize), 
        text: 'Shop ',
        anchor: 0.5,
        fontSize: GameLayout.getScaledY(config.menuFontSize)
      });  
  

    this.shopText = this.add.existing(this.shopText);
    this.gameText = this.add.existing(this.gameText);
    
    this.shopText.inputEnabled = true;
    this.gameText.inputEnabled = true;
    this.shopText.events.onInputDown.add(this.toShop, this);
    this.gameText.events.onInputDown.add(this.toGame, this);
    
  }

  update () 
  {

  }

  toShop() {
    this.state.start('Shop')
  }

  toGame() {
    this.state.start('Game')
  }

}
