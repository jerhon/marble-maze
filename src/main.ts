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
      overlapBias: 0,
      tileBias: 0
      // ,
      // debug: true,
    },
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

let deferredPrompt;
class LandingPage {

  constructor(private action: () => Phaser.Game) { }

  runMenu() {
      this.showMenu();
      this.hideGame();
  }
  runGame() {
      this.hideMenu();
      this.showGame();

      let game = this.action(); 
      game.scale.lockOrientation('portrait');
  }
  

  init() {
      if (process.env.NODE_ENV === 'prod') {
          if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/service-worker.js').then(registration => {
                      console.log('SW registered: ', registration);
                  }).catch(registrationError => {
                      console.log('SW registration failed: ', registrationError);
                  });
              });  
          }

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
      document.getElementById('play-game').addEventListener('click', (evt) => {
          this.runGame();
      });
      document.getElementById('license').addEventListener('change', (evt) => {
          var checked = (document.getElementById('license') as HTMLInputElement).checked;
          this.licenseAgreed(checked);
      })

      if (window.location.href.includes('mode=pwa')) {
          this.runGame();
      } else {
          this.runMenu();
      }
  }

  hideGame() {
      document.getElementById('game').hidden = true;
  }
  showGame() {
      document.getElementById('game').hidden = false;
  }

  hideMenu() {
      document.getElementById('play-options').hidden = true;
  }
  showMenu() {
      document.getElementById('play-options').hidden = false;
  }

  showPwaEnabled() {
      document.getElementById('pwa').hidden = false;
      document.getElementById('no-pwa').hidden = true;
  }

  licenseAgreed(checked) {
      (document.getElementById("install-pwa") as HTMLButtonElement).disabled = !checked;
      (document.getElementById("play-game") as HTMLButtonElement).disabled = !checked;
  }

  installPwa() {
      deferredPrompt.prompt();
  }
}

export function start() {
  var landingPage = new LandingPage(
    () =>  new Phaser.Game(gameConfig)
  );
  landingPage.init();
}