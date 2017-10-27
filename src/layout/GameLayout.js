import Phaser from 'phaser'
import config from '../config'

class GameLayout {

  setDimension ({ width, height }) {
    this.width = width;
    this.height = height; 

    this.deviceWidth = width;

    // keep x,y ratio
    // y/x = dy/dx | *dx
    // y/x*dx = dy
    this.deviceHeight = config.gameHeight/config.gameWidth*this.getDeviceWidth(); 

    // if new device height greater than available height, scale down 
    var scaleY = this.deviceHeight/this.height;

    if (scaleY>1.0) 
    {
      this.deviceWidth /= scaleY;
      this.deviceHeight = this.height;
    }

  }

  getScale() {
    var scale =
      { 
        x: (this.getDeviceWidth() / config.gameWidth), 
        y: (this.getDeviceHeight() / config.gameHeight) 
      };

      return scale;
  }

  getDeviceWidth() {
    return this.deviceWidth;
  }

  getDeviceHeight() {
    return this.deviceHeight; 
  }

  getScaledPoint({x ,y}) 
  {
    var scale = this.getScale();

    var result = 
    {
      x: x*scale.x,
      y: y*scale.y
    }

    return resilt;
  }

  getScaledX(x) 
  {
    return this.getScale().x*x;
  }

  getScaledY(y) 
  {
    return this.getScale().y*y;
  }


}

export default new GameLayout();