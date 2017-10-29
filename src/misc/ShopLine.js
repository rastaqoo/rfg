import Phaser from 'phaser'

export default class {
  
  constructor ({icon, text, countText, onClick}) {
     this.icon = icon;
     this.text = text;
     this.countText = countText;
     this.onClick = onClick;
  }

  getIcon() {
    return this.icon;
  }

  getText() {
    return this.text;
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
    this.countText.text = ': '+count+' ';
  }

  enable() {
    this.icon.alpha=1;
    this.text.alpha=1;
    this.countText.alpha=1;
    this.icon.inputEnabled=true;
    this.text.inputEnabled=true;
    this.icon.events.onInputDown.add(this.onClick);
    this.text.events.onInputDown.add(this.onClick);
  }

  disable() {
    this.icon.alpha=0.5;
    this.text.alpha=0.5;
    this.countText.alpha=1;
    this.icon.inputEnabled=false;
    this.text.inputEnabled=false;
  }

}
