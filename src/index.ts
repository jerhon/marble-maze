import "./style.css"

let deferredPrompt;

export function serviceWorker() {
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



export function run() {
    if (process.env.NODE_ENV === 'prod') {
        serviceWorker();

        window.addEventListener('beforeinstallprompt', (e) => {
            // Stash the event so it can be triggered later.
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('pwa').hidden = false;
        });
    }

    document.getElementById('install-pwa').addEventListener('click', (evt) => {
        deferredPrompt.prompt();
    });

    document.getElementById('license').addEventListener('change', (evt) => {
        const checked = (document.getElementById('license') as HTMLInputElement).checked;

        (document.getElementById("install-pwa") as HTMLButtonElement).disabled = !checked;
        (document.getElementById("play-game") as HTMLButtonElement).disabled = !checked;
    });

    document.getElementById('play-game').addEventListener('click', (evt) => {
        document.location.href = "/game.html";
    });
}


