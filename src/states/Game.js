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

   GameLogic.startGame();

  }

  preload () {

    this.load.image('kachel'  , 'assets/images/kachel_green_black.png')
    this.load.image('platform'  , 'assets/images/lower_platform_green.png')
    this.load.image('kleckse', './assets/images/bg_kleckse.png')


  }

  create () {
    
    this.game.add.image(game.world.centerX, game.world.centerY, 'kleckse').anchor.set(0.5);
    
    var graphics = game.add.graphics(0,0);

    graphics.beginFill(0xffffff);
    // graphics.drawRect(14, 14, game.world.width - 28, game.world.height - 28);
    graphics.endFill();


    this.platform = new Platform({
      game: this.game,
      x: this.world.centerX,
      y: GameLayout.getScaledY(config.infoPanelHeight + config.flyzonePanelHeight - config.platformHeight/2),
      asset: 'platform'
    })

    this.kacheln = this.game.add.physicsGroup();
    this.game.physics.enable(this.kacheln, Phaser.Physics.ARCADE);

    this.game.add.existing(this.platform)
    this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);

    this.platform.enableBody = true;
    this.platform.body.immovable = true;

    this.scoreText = GameComponentFactory.getText(
      this.game,
      GameLayout.getScaledX(config.laneBorderLeftRight), 
      GameLayout.getScaledY(5), 
      'Score');  

    this.livesText = GameComponentFactory.getText(
        this.game,
        GameLayout.getScaledX(config.laneBorderLeftRight), 
        GameLayout.getScaledY(25), 
        'Lives');  

    this.coinsText = GameComponentFactory.getText(
        this.game,
        GameLayout.getScaledX(config.laneBorderLeftRight), 
        GameLayout.getScaledY(45), 
        'Coins');  

    this.scoreText = this.add.existing(this.scoreText)
    this.livesText = this.add.existing(this.livesText)
    this.coinsText = this.add.existing(this.coinsText)
  }

  update () 
  {

    this.scoreText.text = "Score: "+GameLogic.getScore();
    this.livesText.text = "Lives: "+GameLogic.getLives();
    this.coinsText.text = "Coins: "+GameLogic.getCoins();
    

    this.game.physics.arcade.collide(this.platform, this.kacheln, this.collisionHandle.bind(this), null, this);
    this.game.physics.arcade.collide(this.mushroom, this.kacheln, this.collisionHandle.bind(this), null, this);
    this.game.physics.arcade.collide(this.kacheln, this.kacheln, this.collisionKachel.bind(this), null, this);
    

    // if (this.game.time.time > this.addTime) {

    var bounds = this.kacheln.getBounds();

    if (GameLogic.shouldFireNewBlocks(bounds)) {

        var laneIdx = Math.floor(Math.random() * 5);

        var laneIdx_1 = (laneIdx + 2) % 5;

        var laneIdx_2 = (laneIdx + 4) % 5;
        
        var laneIdxs = new Array();

        laneIdxs.push(laneIdx);

        if (laneIdx_1!=laneIdx) laneIdxs.push(laneIdx_1);
        if (laneIdx_2!=laneIdx_1) laneIdxs.push(laneIdx_2);
        
        var lanes = 1;

        if (Math.floor(Math.random() * 21) == 20) 
        {
          lanes = 2;
        }

        if (Math.floor(Math.random() * 41) == 40) 
        {
          lanes = 3;
        }

        for (var i=0; i < lanes; i++) {

            var c = new Kachel({
              game: this.game,
              x: 
                GameLayout.getScaledX(
                  config.laneBorderLeftRight + 
                  laneIdxs[i] * 
                  config.blockWidth + 
                  config.laneDistance + 
                  // block sprites anchor is 0.5
                  // -> we have to move it by half of width 
                  config.blockWidth/2),
              y: GameLayout.getScaledY(-config.blockHeight), 
              asset: "kachel"
            });

            var c = this.kacheln.add(c);
            var scale = GameLayout.getScale();
            c.scale.y = scale.y;
            c.scale.x = scale.x;
            c.inputEnabled = true;
            c.events.onInputDown.add(this.clickedMush, this);
            c.body.velocity.setTo(0,GameLogic.getVelocity());
            // c.body.collideWorldBounds = true;
            c.body.bounce = 1;

        }
      }
  }

  collisionHandle(A, B) {
    console.log("collision: "+A+" "+B)
    B.kill();

    GameLogic.blockHitPlatform();

    if (GameLogic.isGameOver()) 
    {
      this.state.start('GameOver')
    }

  }

  collisionKachel(A, B) {
    console.log("collision: "+A+" "+B)
    let x = 0;
    let y = GameLogic.getVelocity();

    if (A.y > B.y) 
    {
      // B ist Verursacher
      B.body.velocity.setTo(x,y*0.5);
      A.body.velocity.setTo(x,y*1.2);  
    }
    else {
      // A ist Verursacher
      A.body.velocity.setTo(x,y*0.5);
      B.body.velocity.setTo(x,y*1.2);
    }

  }

  clickedMush(mush) 
  {
    mush.kill();
    GameLogic.hitBlock();
  }

  render () {
    if (__DEV__) {

      var diffTime =  this.game.time.time - this.lastTime;

      this.lastTime = this.game.time.time;

      // this.game.debug.text("sue: "+this.speedUpEvery, 32, 32)
      /*
      this.game.debug.text('sx: ' + window.screen.width, 32, 32, config.greenColor);
      this.game.debug.text('sy: ' + window.screen.height, 32, 42,config.greenColor);
      this.game.debug.text('wx: ' + window.innerWidth, 32, 52,config.greenColor);
      this.game.debug.text('wy: ' + window.innerHeight, 32, 62,config.greenColor);
      this.game.debug.text('ex: ' + this.game.canvas.parentNode.clientWidth, 32, 72,config.greenColor);
      this.game.debug.text('ey: ' + this.game.canvas.parentNode.clientHeight, 32, 82,config.greenColor);
      */
    }
  }

 

}
