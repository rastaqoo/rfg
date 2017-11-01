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

    // this.load.image('kachel'  , 'assets/images/kachel_green_black.png')
    this.load.image('platform'  , 'assets/images/lower_platform_green.png')
    this.load.image('kleckse', './assets/images/bg_kleckse.png')

    // buttons
    this.load.image('x2', './assets/images/x2.png')
    this.load.image('lives', './assets/images/lives.png')
    this.load.image('freeze', './assets/images/freeze.png')

  }

  create () {
    
    // background image
    this.game.add.image(game.world.centerX, game.world.centerY, 'kleckse').anchor.set(0.5);
    
    this.gameBackground = game.add.graphics(0,0);

    this.gameBackground.beginFill(0xff0000);
    this.gameBackground.drawRect(
      0, 0, 
      GameLayout.getScaledX(config.gameWidth), 
      GameLayout.getScaledY(config.gameHeight));
    this.gameBackground.endFill();

    this.gameBackground.alpha = 0;
    this.gameBackground.inputEnabled = true;
    this.gameBackground.input.priorityID = 0;
    this.gameBackground.events.onInputDown.add(this.clickedBackground, this);

    this.addBackgroundTween();

    this.platform = new Platform({
      game: this.game,
      x: this.world.centerX,
      y: GameLayout.getScaledY(config.infoPanelHeight + config.flyzonePanelHeight - config.platformHeight/2),
      asset: 'platform'
    })

    this.platform.scale.x = GameLayout.getScale().x;
    this.platform.scale.y = GameLayout.getScale().y;

    this.kacheln = this.game.add.physicsGroup();
    this.game.physics.enable(this.kacheln, Phaser.Physics.ARCADE);

    this.game.add.existing(this.platform)
    this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);

    this.platform.enableBody = true;
    this.platform.body.immovable = true;

    this.scoreText = GameComponentFactory.getText(
      {
      game: this.game,
      x: GameLayout.getScaledX(config.laneBorderLeftRight), 
      y: GameLayout.getScaledY(5), 
      text: 'Score',
      anchor: 0.0
      });  

    this.livesText = GameComponentFactory.getText({
        game: this.game,
        x: GameLayout.getScaledX(config.laneBorderLeftRight), 
        y: GameLayout.getScaledY(25), 
        text: 'Lives',
        anchor: 0.0
      });  

    this.coinsText = GameComponentFactory.getText({
        game: this.game,
        x: GameLayout.getScaledX(config.laneBorderLeftRight), 
        y: GameLayout.getScaledY(45), 
        text: 'Coins',
        anchor: 0.0
    });  

    this.scoreText = this.add.existing(this.scoreText)
    this.livesText = this.add.existing(this.livesText)
    this.coinsText = this.add.existing(this.coinsText)

    // add buttons to fire: freezer, doubler and more lives
    var rowidx=0;

    this.livesAction = GameComponentFactory.createActionElement(
      {
        state: this,
        game: game,
        rowIdx: rowidx,
        iconId: 'lives',
        countText: ': 0 ',
        onClick: this.getLife.bind(this)
      }
    );  

    // freezes
    rowidx++;
    this.freezesAction = GameComponentFactory.createActionElement(
      {
        state: this,
        game: game,
        rowIdx: rowidx,
        iconId: 'freeze',
        countText: ': 0 ',
        onClick: this.getFreezer.bind(this)
      }
    ); 

    // doublers
    rowidx++;
    this.doublerAction = GameComponentFactory.createActionElement(
      {
        state: this,
        game: game,
        rowIdx: rowidx,
        iconId: 'x2',
        countText: ': 0 ',
        onClick: this.getDoubler.bind(this)
      }
    ); 
  }

  getLife() 
  {
    console.log("get life");
    GameLogic.putLife();
  }

  getDoubler() 
  {
    console.log("get doubler");
    GameLogic.putDoubler();
  }

  getFreezer() 
  {
    console.log("get freezer");
    GameLogic.putFreezer(this.kacheln);
  }  

  getKachelTexture() {

        if (!this.kachelTexture) 
        {
          console.log("create kachel texture");
          var graphics = this.game.add.graphics(0, 0);
      
          graphics.beginFill(0x43d637);
          graphics.lineStyle(2, 0x000000, 1);
          
          graphics.moveTo(0,0);
          graphics.lineTo(0, 128);
          graphics.lineTo(64, 128);
          graphics.lineTo(64, 0);
          graphics.lineTo(0, 0);
          graphics.endFill();
          this.kachelTexture = graphics.generateTexture();
          graphics.destroy();
        }
        else
        {
          console.log("using pre created kachel texture");
        }

        return this.kachelTexture;
  }


  update () 
  {

    // 
    GameLogic.tick(this.game.time.time);

    this.updateActions();

    this.scoreText.text = "Score: "+GameLogic.getScore()+' ';
    this.livesText.text = "Lives: "+GameLogic.getLives()+' ';
    this.coinsText.text = "Coins: "+GameLogic.getCoins()+' ';
    

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
              asset: this.getKachelTexture()
            });

            var c = this.kacheln.add(c);
            var scale = GameLayout.getScale();
            c.scale.y = scale.y;
            c.scale.x = scale.x;
            c.inputEnabled = true;
            c.input.priorityID = 0;
            c.events.onInputDown.add(this.clickedMush, this);
            c.body.velocity.setTo(0,GameLogic.getVelocity());
            // c.body.collideWorldBounds = true;
            c.body.bounce = 1;

        }
      }
  }

  updateActions() 
  {
    this.doublerAction.setCount(GameLogic.getCount("doubler"));    
    this.doublerAction.setEnabled(GameLogic.canWePut("doubler"));
    
    this.freezesAction.setCount(GameLogic.getCount("freezer"));    
    this.freezesAction.setEnabled(GameLogic.canWePut("freezer"));
    
    this.livesAction.setCount(GameLogic.getCount("life"));    
    this.livesAction.setEnabled(GameLogic.canWePut("life"));
  }

  collisionHandle(A, B) {
    console.log("collision: "+A+" "+B)
    B.kill();

    GameLogic.blockHitPlatform();
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

  clickedBackground() 
  {
    GameLogic.hitBackground();
    if (this.gameBackgroundTween) {
      this.gameBackgroundTween.start();
    }
    
      console.log("bg clicked");
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

  addBackgroundTween() 
  {
    console.log("add bg tween")
    this.gameBackgroundTween =  
    game.add.
      tween(this.gameBackground).
      from(
        { alpha: 1 }, 
        200, 
        "Linear", 
        false, 
        0, 
        0);
    this.gameBackgroundTween.onComplete.addOnce(this.addBackgroundTween, this);
  }



}
