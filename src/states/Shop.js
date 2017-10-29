/* globals __DEV__ */
import Phaser from 'phaser'
import Platform from '../sprites/Platform'
import Kachel from '../sprites/Kachel'
import config from '../config'
import GameLayout from '../layout/GameLayout'
import GameLogic  from '../logic/GameLogic'
import GameComponentFactory from '../factory/GameComponentFactory'
import ShopLine from '../misc/ShopLine'

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
    this.load.image('kleckse', './assets/images/bg_kleckse.png')

    // buttons
    this.load.image('x2', './assets/images/x2.png')
    this.load.image('lives', './assets/images/lives.png')
    this.load.image('freeze', './assets/images/freeze.png')

  }

  create () {
    this.game.add.image(game.world.centerX, game.world.centerY, 'kleckse').anchor.set(0.5);
    
    this.titleText = GameComponentFactory.getText(
      {
      game: this.game,
      x: game.world.centerX, 
      y: GameLayout.getScaledY(config.infoPanelHeight/2), 
      text: 'Shop ',
      anchor: 0.5
      });  

    this.titleText = this.add.existing(this.titleText);


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
    this.backText.events.onInputDown.add(this.backToMenu.bind(this));


    var line = 0;
    var lineHeight = 70; 

    // coins  
    line++;
    this.coinsText= GameComponentFactory.getText(
      {
      game: this.game,
      x: GameLayout.getScaledX(config.gameWidth/2), 
      y: GameLayout.getScaledY(config.infoPanelHeight + line * lineHeight), 
      text: 'Your Coins: \r\n'+GameLogic.getCoins()+' ',
      anchor: 0.5
      });
    this.coinsText.fontSize = GameLayout.getScaledY(40);
    this.coinsText.align = 'center';
    this.add.existing(this.coinsText);

    // extra line
    line++;  

    // lives
    line++;

    this.livesShopLine = GameComponentFactory.createShopLine(
      {
        state: this,
        game: game,
        line: line,
        lineHeight: lineHeight,
        iconId: 'lives',
        lineText: config.coinsPerLife+' Coins ',
        countText: ': 0 ',
        onClick: this.getLife.bind(this)
      }
    );  

    // freezes
    line++;
    this.freezesShopLine = GameComponentFactory.createShopLine(
      {
        state: this,
        game: game,
        line: line,
        lineHeight: lineHeight,
        iconId: 'freeze',
        lineText: config.coinsPerFreezer+' Coins ',
        countText: ': 0 ',
        onClick: this.getFreezer.bind(this)
      }
    ); 

    // doublers
    line++;
    this.doublerShopLine = GameComponentFactory.createShopLine(
      {
        state: this,
        game: game,
        line: line,
        lineHeight: lineHeight,
        iconId: 'x2',
        lineText: config.coinsPerFreezer+' Coins ',
        countText: ': 0 ',
        onClick: this.getDoubler.bind(this)
      }
    ); 
    

    

  }

  update () 
  {
    this.updateShopLines();
  }

  updateShopLines() 
  {

    this.coinsText.text = 'Your Coins: \r\n'+GameLogic.getCoins()+' ';

    this.doublerShopLine.setCount(GameLogic.getCount("doubler"));    
    this.doublerShopLine.setEnabled(GameLogic.available("doubler"));
    
    this.freezesShopLine.setCount(GameLogic.getCount("freezer"));    
    this.freezesShopLine.setEnabled(GameLogic.available("freezer"));
    
    this.livesShopLine.setCount(GameLogic.getCount("life"));    
    this.livesShopLine.setEnabled(GameLogic.available("life"));
    
  }

  getDoubler() {
    console.log("get doubler");
    GameLogic.acquire("doubler");
  }

  getFreezer() {
    console.log("get freezer");
    GameLogic.acquire("freezer");
  }

  getLife() {
    console.log("get life");
    GameLogic.acquire("life");
  }

  backToMenu() {
    this.state.start('Menu');
  }

}
