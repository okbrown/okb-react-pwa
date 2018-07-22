export default function register () {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/service-worker.js').then(registration => {
				//console.log('SW registered: ', registration);
			}).catch(registrationError => {
				console.log('SW registration failed: ', registrationError);
			});
		});
	}
}

export function unregister () {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			registration.unregister();
		});
	}
}