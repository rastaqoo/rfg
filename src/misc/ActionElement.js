import Phaser from 'phaser'

/*
 * Represents a game action element below the platform (x2, freezer, life+)
 */

export default class {
  
  constructor ({icon, countText, onClick}) {
     this.icon = icon;
     this.countText = countText;
     this.onClick = onClick;
  }

  getIcon() {
    return this.icon;
  }

  getCountText() {
    return this.countText;
  }

  setEnabled(enabled) {
    if (enabled) 
    {
      this.enable();
    }
    else 
    {
      this.disable();
    }
  }

  setCount(count) {
    this.countText.text = ' '+count+' ';
  }

  enable() {
    this.icon.alpha=1;
    this.countText.alpha=1;
    this.icon.inputEnabled=true;
    this.icon.events.onInputDown.add(this.onClick);
  }

  disable() {
    this.icon.alpha=0.5;
    this.countText.alpha=1;
    this.icon.inputEnabled=false;
  }

}
