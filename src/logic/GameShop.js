import Phaser from 'phaser'
import config from '../config'

class GameShop {

  constructor() 
  {
    this.storage = window.localStorage;
  }

  startGame() {

    this.lives = config.livesAtStart;
    this.score = 0;
    this.speedUpEvery = 10;
    this.speedUpFactor = 1.2;
    this.velocity = 180;
    this.blockCycles = 0;
    this.coins = 0;

    var coinsRead = this.storage.getItem(config.localStorageCoins);

    if (coinsRead) 
    {
      this.coins = parseInt(coinsRead,10);
    }
    
  }

  blockHitPlatform() 
  {
    if (this.lives>0) {
      this.lives -= 1;
    }
  }

  hitBlock() {
    this.score += 1;
    this.coins += 10;

    this.storage.setItem(config.localStorageCoins,this.coins+'');

    console.log("hit block. score is "+this.score);
    
  }

  isGameOver() {
    return this.lives <= 0;
  }

  getScore() 
  {
    return this.score;
  }

  getLives() 
  {
    return this.lives;
  }

  getCoins() 
  {
    return this.coins;
  }

  getVelocity() 
  {
    return this.velocity + Math.random()*this.velocity/5;
  }

  shouldFireNewBlocks(blockGroupBounds) 
  {

    if ((blockGroupBounds.y > Math.round(Math.random() * 10)+5 || blockGroupBounds.height == 0)) 
    {
      this.blockCycles++;

      // more speed, one cycle break
      if (this.blockCycles % this.speedUpEvery == 0) 
      {
        this.velocity = this.velocity * this.speedUpFactor;
        this.speedUpEvery = 2 * this.speedUpEvery;
        // just speed up, no new block
        return false;
      }
      else {
        // new block
        return true;
      }

    }

    // no new block
    return false;
  }

}

export default new GameShop();