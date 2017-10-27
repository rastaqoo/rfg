import Phaser from 'phaser'
import config from '../config'
import GameLayout from '../layout/GameLayout'

class GameComponentFactory {

  getText(game,x,y,text) 
  {

    var text = new Phaser.Text(game,x,y,text)
    
    text.font = 'Bangers'
    // text.padding.set(10, 16)
    text.fontSize = GameLayout.getScaledY(20);
    text.smoothed = false;
    text.anchor.setTo(0.0);
    text.stroke = '#000000';
    text.strokeThickness = GameLayout.getScaledX(3);
    text.fill = '#43d637';

    console.log(text);

    return text;
  }


}

export default new GameComponentFactory();