import * as Phaser from 'phaser';
import { GameScene } from './scenes/game';
import { LoadingScene } from './scenes/loading';
import { MenuScene } from './scenes/menu';
import { MessageScene } from './scenes/message';


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Marble Maze',
 
  type: Phaser.AUTO,
 
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    fullscreenTarget: 'game',
  },

  height: 704,
  width: 704,
  
  scene: [MenuScene, LoadingScene, GameScene, MessageScene],
  parent: 'game',
  backgroundColor: '#000000',
  disableContextMenu: true,

};

let deferredPrompt;
class LandingPage {

  constructor() { }
  

  init() {
      if (process.env.NODE_ENV === 'prod' || true) {
          serviceWorker();

          window.addEventListener('beforeinstallprompt', (e) => {
              // Stash the event so it can be triggered later.
              e.preventDefault();
              deferredPrompt = e;
              this.showPwaEnabled();
          });
      }

      document.getElementById('install-pwa').addEventListener('click', (evt) => {
          deferredPrompt();
      });
      document.getElementById('license').addEventListener('change', (evt) => {
          var checked = (document.getElementById('license') as HTMLInputElement).checked;
          this.licenseAgreed(checked);
      })

  }

  showPwaEnabled() {
      document.getElementById('pwa').hidden = false;
  }

  licenseAgreed(checked) {
      (document.getElementById("install-pwa") as HTMLButtonElement).disabled = !checked;
      (document.getElementById("play-game") as HTMLButtonElement).disabled = !checked;
  }

  installPwa() {
      deferredPrompt.prompt();
  }
}

function serviceWorker() {
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

export function landingPage() {
  var landingPage = new LandingPage();
  landingPage.init();
}

export function start() {
  let g =  new Phaser.Game(gameConfig);
}