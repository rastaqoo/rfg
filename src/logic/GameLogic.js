import Phaser from 'phaser'
import config from '../config'

class GameLogic {

  constructor() 
  {
    this.storage = window.localStorage;
  }

  // initializes all game variables
  // coins are read from localstorage
  startGame({onGameOver, scale}) {

    this.lives = config.livesAtStart;
    this.score = 0;
    this.speedUpEvery = 10;
    this.speedUpFactor = 1.2;
    this.velocity = 180 * scale.y;
    this.blockCycles = 0;
    this.onGameOver = onGameOver;
    this.scale = scale;
    this.coins = this.getStorageItemAsInteger(this.getStorageKey("coins"));
  }

  blockHitPlatform() 
  {
    if (this.lives>0) {
      this.lives -= 1;
    }
    this.checkGameOver();
  }

  hitBackground() 
  {
    if (this.lives>0) {
      this.lives -= 1;
    }
    this.checkGameOver();
  }

  checkGameOver() 
  {
    if (this.isGameOver()) 
    {
      this.onGameOver();
    }
  }

  hitBlock() {
    this.score += 1;
    this.coins += 10;

    this.writeStorageItem(this.getStorageKey("coins"),this.coins);
   
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

  acquire(itemType) {

    var storageKey = this.getStorageKey(itemType);

    switch(itemType) 
    {
      case "freezer":
        if (this.getCoins() > config.coinsPerFreezer) 
        {
          this.coins -= config.coinsPerFreezer;
          this.writeStorageItem(this.getStorageKey("coins"),this.coins);
          this.writeStorageItem(storageKey, this.getStorageItemAsInteger(storageKey) + 1);
        }
        break;
      case "life":
        if (this.getCoins() > config.coinsPerLife) 
        {
          this.coins -= config.coinsPerLife;
          this.writeStorageItem(this.getStorageKey("coins"),this.coins);
          this.writeStorageItem(storageKey, this.getStorageItemAsInteger(storageKey) + 1);
        }
        break;
      case "doubler":
        if (this.getCoins() > config.coinsPerDoubler) 
        {
          this.coins -= config.coinsPerDoubler;
          this.writeStorageItem(this.getStorageKey("coins"),this.coins);
          this.writeStorageItem(storageKey, this.getStorageItemAsInteger(storageKey) + 1);
        }
        break;  
    }
  }

  getCount(itemType) {
    return this.getStorageItemAsInteger(this.getStorageKey(itemType));
  }

  available(itemType) {

    var retVal = false;

    switch(itemType) 
    {
      case "freezer":
        if (this.getCoins() > config.coinsPerFreezer) 
        {
          retVal = true;
        }
        break;
      case "life":
        if (this.getCoins() > config.coinsPerLife) 
        {
          retVal = true;
        }
        break;
      case "doubler":
        if (this.getCoins() > config.coinsPerDoubler) 
        {
          retVal = true;
        }
        break;  
    }

    // console.log("Available "+itemType+" : "+retVal);

    return retVal;
  }



  getStorageKey(itemType) {
   return config.localStoragePrefix + '.' +itemType;
  }

  getStorageItemAsInteger(item) {
    var itemRead = this.storage.getItem(item);
    
        if (itemRead) 
        {
          return parseInt(itemRead,10);
        } 
        else {
          return 0;
        }
  }

  writeStorageItem(item, value) {
    this.storage.setItem(item, value+'');
  }


}

export default new GameLogic();