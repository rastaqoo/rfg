import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import ShopState from './states/Shop'
import MenuState from './states/Menu'


import GameOverState from './states/GameOver'
import GameLayout from './layout/GameLayout'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    GameLayout.setDimension(
      {width: window.innerWidth, 
       height: window.innerHeight});

    super(GameLayout.getDeviceWidth(), GameLayout.getDeviceHeight(), Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.add('GameOver', GameOverState, false)
    this.state.add('Shop', ShopState, false)
    this.state.add('Menu', MenuState, false)
    
    this.state.start('Boot')
  }

  


}

window.game = new Game()
