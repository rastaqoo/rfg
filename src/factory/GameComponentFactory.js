import Phaser from 'phaser'
import config from '../config'
import GameLayout from '../layout/GameLayout'
import ShopLine from '../misc/ShopLine'

class GameComponentFactory {

  getText({game,x,y,text,anchor, anchory, fontSize}) 
  {

    var text = new Phaser.Text(game,x,y,text)
    
    text.font = 'Bangers'
    // text.padding.set(10, 16)
    text.fontSize = GameLayout.getScaledY(config.defaultFontSize);
    text.smoothed = false;
    text.anchor.setTo(anchor,anchory);
    text.stroke = '#000000';
    text.strokeThickness = GameLayout.getScaledX(3);
    text.fill = '#43d637';

    if (fontSize) {
      text.fontSize = fontSize;
    }

    console.log(text);

    return text;
  }

  // creates a line with an icon, a description and a count text and retuns a handle 
  // with these three objects
  createShopLine({game, state, line, lineHeight, iconId, lineText, countText, onClick}) 
  {
    var icon = state.add.image(
      GameLayout.getScaledX(40),
      GameLayout.getScaledY(config.infoPanelHeight + line * lineHeight),
      iconId);
    icon.anchor.set(0.5);
    var textObject  = this.getText(
      {
      game: game,
      x: GameLayout.getScaledX(80), 
      y: GameLayout.getScaledY(config.infoPanelHeight + line * lineHeight), 
      text: lineText,
      anchor: 0.0,
      anchory: 0.5
      });
    textObject.fontSize = GameLayout.getScaledY(30);
    state.add.existing(textObject);

    var countTextObject  = this.getText(
      {
      game: game,
      x: GameLayout.getScaledX(config.gameWidth-70), 
      y: GameLayout.getScaledY(config.infoPanelHeight + line * lineHeight), 
      text: countText,
      anchor: 0.0,
      anchory: 0.5
      });
    countTextObject.fontSize = GameLayout.getScaledY(30);
    state.add.existing(countTextObject);

    var shopLine = new ShopLine(
      {
        icon: icon,
        text: textObject,
        countText: countTextObject,
        onClick: onClick
      });  

    return shopLine;
  }


}

export default new GameComponentFactory();