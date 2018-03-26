import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {

    this.enterTime = this.game.time.time;

  }

  preload () {
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.image('kachel'  , 'assets/images/kachel.png')
    this.load.image('rastaqoo',  'assets/images/rastaqoo_200.png')
    
  }

  create() {

    game.add.image(game.world.centerX, game.world.centerY, 'rastaqoo').anchor.set(0.5);
  }

  update () {

    console.log('Elapsed: '+(this.game.time.time - this.enterTime))
    if ((this.game.time.time - this.enterTime) > 3000)
    {

       this.state.start('Menu');

    }

  }
}
