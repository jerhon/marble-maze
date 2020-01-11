import * as Phaser from 'phaser';
import { GameScene } from './scenes/game';
import { LoadingScene } from './scenes/loading';
import { MenuScene } from './scenes/menu';
import { MESSAGE_SCENE, MessageScene } from './scenes/message';
import { LandingPage } from './landingPage';


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Marble Maze',
 
  type: Phaser.AUTO,
 
  physics: {
    default: 'arcade',
    //arcade: {
    //  debug: true,
    //},
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },

  height: 800,
  width: 700,
  
  scene: [MenuScene, LoadingScene, GameScene, MessageScene],
  parent: 'game',
  backgroundColor: '#000000',
  disableContextMenu: true,

  render: {
    roundPixels: true
  }
};

let game;
export function startLandingPage() {
  var landingPage = new LandingPage(
    () =>  new Phaser.Game(gameConfig)
  );
  landingPage.init();
}
