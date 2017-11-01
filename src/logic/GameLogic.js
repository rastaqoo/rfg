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

    // global time
    this.time = 0;

    // global rest
    this.lives = config.livesAtStart;
    this.score = 0;
    this.speedUpEvery = 10;
    this.speedUpFactor = 1.2;
    this.velocity = 180 * scale.y;
    this.blockCycles = 0;
    this.onGameOver = onGameOver;
    this.scale = scale;
    this.coins = this.getStorageItemAsInteger(this.getStorageKey("coins"));
    // freeze
    this.frozen = false;
    this.frozenUntil = 0; 
    this.velocityBeforeFreeze = 0;
    this.speedUpFactoreBeforeFreeze = 0;

    // double coins
    this.doubleCoins = false;
    this.doubleCoinsUntil = 0; 
    
  }

  tick(timelong) 
  {
    // check freeze
    this.time = timelong;
    this.checkFrozen();
    this.checkDoubleCoins();
  }


  /*
   * DOUBLE COINS
   */ 
  checkDoubleCoins() 
  {
    if (this.doubleCoins) 
    {
      // 20 seconds over -> unfreeze
      if (this.doubleCoinsUntil < this.time) 
      {
        this.disableDoubleCoins();
      }
    }
  }

  enableDoubleCoins()
  {
    this.doubleCoinsUntil = this.time + 20000;
    this.doubleCoins = true;
  }

  disableDoubleCoins()
  {
    this.doubleCoins = false;
  }


  /*
   * FROZEN
   */
  isFrozen() {
    return this.frozen;
  }

  checkFrozen() 
  {
    if (this.frozen) 
    {
      // 20 seconds over -> unfreeze
      if (this.frozenUntil < this.time) 
      {
        this.unfreeze();
      }

      // no blocks anymore -> unfreeze
      if (this.frozenGroup) 
      {
        if (this.frozenGroup.countLiving() == 0) {
          this.unfreeze();
        }
      }

    }
  }

  unfreeze() 
  {
    this.velocity = this.velocityBeforeFreeze;
    this.speedUpFactor = this.speedUpFactoreBeforeFreeze;
    this.frozen = false;
  }

  freeze(spriteGroup) 
  {

    this.velocityBeforeFreeze = this.velocity;
    this.speedUpFactoreBeforeFreeze = this.speedUpFactor;
    this.velocity = 10;
    this.frozenGroup = spriteGroup;
    this.frozenGroup.setAllChildren("body.velocity.y",10);
    this.speedUpFactor = 1;
    this.frozenUntil = this.time + 20000;
    this.frozen = true;
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
    this.coins += (this.doubleCoins)?20:10;

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
    if (this.frozen)
      return false;


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
        if (this.getCoins() >= config.coinsPerFreezer) 
        {
          this.coins -= config.coinsPerFreezer;
          this.writeStorageItem(this.getStorageKey("coins"),this.coins);
          this.writeStorageItem(storageKey, this.getStorageItemAsInteger(storageKey) + 1);
        }
        break;
      case "life":
        if (this.getCoins() >= config.coinsPerLife) 
        {
          this.coins -= config.coinsPerLife;
          this.writeStorageItem(this.getStorageKey("coins"),this.coins);
          this.writeStorageItem(storageKey, this.getStorageItemAsInteger(storageKey) + 1);
        }
        break;
      case "doubler":
        if (this.getCoins() >= config.coinsPerDoubler) 
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

  canWePut(itemType) {
    let retval = false;
    
    switch(itemType) 
    {
      case "freezer":
        retval = (!this.frozen) && (this.getCount(itemType)>0);
        break;
      case "life":
        retval = (this.getCount(itemType)>0)
        break;
      case "doubler":
        retval = (!this.doubleCoins) && (this.getCount(itemType)>0)
        break;  
    }

    return retval;
  }


  available(itemType) {

    var retVal = false;

    switch(itemType) 
    {
      case "freezer":
        if (this.getCoins() >= config.coinsPerFreezer) 
        {
          retVal = true;
        }
        break;
      case "life":
        if (this.getCoins() >= config.coinsPerLife) 
        {
          retVal = true;
        }
        break;
      case "doubler":
        if (this.getCoins() >= config.coinsPerDoubler) 
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

  putLife() 
  {
    var storageKey = this.getStorageKey("life");

    if (this.getCount("life")>0) 
    {
      this.writeStorageItem(storageKey, this.getStorageItemAsInteger(storageKey) - 1);
      this.lives++;
    }
  }

  putFreezer(spriteGroup) 
  {
    var storageKey = this.getStorageKey("freezer");

    if (this.getCount("freezer")>0) 
    {
      this.writeStorageItem(storageKey, this.getStorageItemAsInteger(storageKey) - 1);
      this.freeze(spriteGroup);
    }
  }

  putDoubler() 
  {
    var storageKey = this.getStorageKey("doubler");

    if (this.getCount("doubler")>0) 
    {
      this.writeStorageItem(storageKey, this.getStorageItemAsInteger(storageKey) - 1);
      this.enableDoubleCoins();
    }
  }

}

export default new GameLogic();