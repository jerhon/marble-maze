import { Game } from "phaser";

let deferredPrompt;

export class LandingPage {

    constructor(private action: () => Game) { }

    runMenu() {
        this.showMenu();
        this.hideGame();
    }
    runGame() {
        this.hideMenu();
        this.showGame();

        this.action(); 
    }
    

    init() {
        if (process.env.NODE_ENV === 'production') {
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
            console.log(checked);
            this.licenseAgreed(checked);
        })

        if (window.location.href.includes('mode=game')) {
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
        document.getElementById('pwa').hidden = true;
        document.getElementById('no-pwa').hidden = false;
    }

    licenseAgreed(checked) {
        (document.getElementById("install-pwa") as HTMLButtonElement).disabled = !checked;
        (document.getElementById("play-game") as HTMLButtonElement).disabled = !checked;
    }

    installPwa() {
        deferredPrompt.prompt();
    }
}
