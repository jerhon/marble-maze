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

export const game = new Phaser.Game(gameConfig);

if (window.location.href.indexOf('mode=pwa') >= 0) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
  }
}