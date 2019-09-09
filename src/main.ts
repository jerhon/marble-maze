import * as Phaser from 'phaser';
import { GameScene } from './scenes/game';
import { LoadingScene } from './scenes/loading';
import { MenuScene } from './scenes/menu';


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
  disableContextMenu: true,
};

export const game = new Phaser.Game(gameConfig);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('SW registered: ', registration);
      }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
      });
  });
}