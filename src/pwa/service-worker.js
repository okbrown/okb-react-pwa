'use strict';

const applicationServerPublicKey = "",
	userUpdateEndpoint = "",
	paths = ['/'],
	endPoints = ['/v1'];


/*

	Notifications Listener

 */

/*

	Original SW Methods

	Use this for creating DB's and/or cleaning up cache.

	self.addEventListener('activate', function (event) {
		event.waitUntil();
	});

	self.addEventListener('install', function(event) {
		event.waitUntill();
	});

	// workbox.routing.registerRoute(); is now preferred ;
	self.addEventListener('fetch', function(event) {
		event.respondWith();
	});

*/


self.addEventListener('notificationclose', function (e) {
	let notification = e.notification;
	let primaryKey = notification.data.primaryKey;

	console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function (e) {
	let notification = e.notification;
	let primaryKey = notification.data.primaryKey;
	let action = e.action; // This come from the event created or sent from the push server

	if (action === 'close') {
		notification.close();
	} else {
		//clients.openWindow(`some-page-or-route.html`);
		notification.close();
	}
});


/*

	Push Notification Handler/Listener

 */
self.addEventListener('push', function (e) {
	if (e.data) {
		const body = e.data.json();
		const options = { ...body };
		e.waitUntil(
			self.registration.showNotification('Push Notification', options),
		);
	}
});

self.addEventListener('pushsubscriptionchange', function (event) {
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	event.waitUntil(
		self.registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey,
		})
		//.then(updateUserSubscription) <= this use to update user object on server
		.then(updateUserSubscription => console.log(updateUserSubscription))
		.catch(error => console.log('Update subscription error: ', error)));
});

/*

	Functions

 */

const match = ({ pathname }) => paths.some(endpoint => endpoint === pathname);
const matchRoutes = ({ url }) => (match(url));

const handleDBCache = async ({ url, event }) => {
	try {
		const response = await fetch(event.request);
		const responseBody = await response.text();
		await saveData(responseBody, url.pathname);
		return new Response(responseBody);
	}
	catch (error) {
		const { data } = await getDataByKey(url.pathname);
		return new Response(JSON.stringify(data));
	}
};

const getUser = async (eventName, keyName) => {
	const { data } = await getDataByKey(eventName, keyName);
	return new Response(JSON.stringify(data));
};

const updateSubscription = async (data, emailAddress) => {
	await fetch(`${ userUpdateEndpoint }/v1/user/${ emailAddress }`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: data,
	});
};

const updateUserSubscription = async (newSubscription) => {
	const userData = await getUser();
	const { email } = userData;
	const data = JSON.stringify({ ...userData, pushSubscription: newSubscription });
	await updateSubscription(data, email);
};

function urlB64ToUint8Array (base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
	.replace(/\-/g, '+')
	.replace(/_/g, '/');

	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[ i ] = rawData.charCodeAt(i);
	}
	return outputArray;
}

/*

	WorkBox helpers to simplify some of the service worker methods.

 */

workbox.skipWaiting();
workbox.clientsClaim();

// workbox.routing.registerRoute();

workbox.precaching.precacheAndRoute(self.__precacheManifest);