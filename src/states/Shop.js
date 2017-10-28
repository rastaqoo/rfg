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

   var me = this;

   GameLogic.startGame({
     onGameOver: function () {
                    me.state.start('GameOver')
                 },
     scale: GameLayout.getScale()
  });
   

  }

  preload () {


  }

  create () {

    this.titleText = GameComponentFactory.getText(
      this.game,
      GameLayout.getScaledX(game.world.centerX), 
      GameLayout.getScaledY(game.world.centerY), 
      'Shop');  

    this.titleText = this.add.existing(this.titleText);

    
  }

  update () 
  {

  }



}
