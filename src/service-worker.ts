let deferredPrompt;

export function registerServiceWorker(): boolean {
	if (process.env.NODE_ENV === 'production') {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js').then(registration => {
				console.log('SW registered: ', registration);
			}).catch(registrationError => {
				console.log('SW registration failed: ', registrationError);
			});

			return true;
		}
	}
	return false;
}

export function registerForPwaInstallation(installCallback: () => void) {
	if (process.env.NODE_ENV === 'production') {
		window.addEventListener('beforeinstallprompt', (e) => {
			// Stash the event so it can be triggered later.
			e.preventDefault();
			deferredPrompt = e;
			installCallback()
		});
	}
}

/** Prompts for a PWA installation. */
export function promptForPwaInstall() {
	if (deferredPrompt)
	{
		deferredPrompt.prompt();
	}
}
