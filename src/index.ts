import "./style.css"
import {promptForPwaInstall, registerForPwaInstallation, registerServiceWorker} from "./service-worker";

export function run(): void {
	if (registerServiceWorker()) {
		registerForPwaInstallation(() => {
			document.getElementById('pwa').hidden = false;
		})
	}

	document.getElementById('install-pwa').addEventListener('click', () => {
		promptForPwaInstall();
	});

	document.getElementById('license').addEventListener('change', () => {
		const checked = (document.getElementById('license') as HTMLInputElement).checked;

		(document.getElementById("install-pwa") as HTMLButtonElement).disabled = !checked;
		(document.getElementById("play-game") as HTMLButtonElement).disabled = !checked;
	});

	document.getElementById('play-game').addEventListener('click', () => {
		document.location.href = "/game.html";
	});
}
