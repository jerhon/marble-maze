import * as Phaser from 'phaser';
import { GameScene } from './game';
import { LoadingScene } from './loading';


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: window.innerWidth,
  height: window.innerHeight,
 
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  
  scene: [LoadingScene, GameScene],
  parent: 'game',
  backgroundColor: '#000000',
  disableContextMenu: true

};
 
export const game = new Phaser.Game(gameConfig);