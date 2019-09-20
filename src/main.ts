import * as Phaser from 'phaser';
import { GameScene } from './scenes/game';
import { LoadingScene } from './scenes/loading';
import { MenuScene } from './scenes/menu';
import { MESSAGE_SCENE, MessageScene } from './scenes/message';


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: window.innerWidth,
  height: window.innerHeight,
   
  physics: {
    default: 'arcade',
    //arcade: {
    //  debug: true,
    //},
  },
  
  scene: [MenuScene, LoadingScene, GameScene, MessageScene],
  parent: 'game',
  backgroundColor: '#000000',
  disableContextMenu: true,
};

let game;
export function runGame() {
  game = new Phaser.Game(gameConfig);
}
