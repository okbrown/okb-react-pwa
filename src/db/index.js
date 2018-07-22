let dbPromise;

const parseData = data => JSON.parse(data);
const prepForIDB = data => ([{ data }]);

const createDB = (databaseName, databaseEvent) => {
	dbPromise = idb.open(databaseName, 1, (upgradeDB) => {
		upgradeDB.createObjectStore(databaseEvent);
	});
};

const getAllData = async (databaseEvent) => {
	return dbPromise.then(db => {
		return db.transaction(databaseEvent).objectStore(databaseEvent).getAll()
	})
};

const getDataByKey = async (databaseEvent, key) => {
	return dbPromise.then(db => {
		return db.transaction(databaseEvent).objectStore(databaseEvent).get(key)
	})
};

const saveData = async (data, databaseEvent, key) => {
	const events = prepForIDB(parseData(data));
	return dbPromise.then(db => {
		const tx = db.transaction(databaseEvent, 'readwrite');
		const store = tx.objectStore(databaseEvent);
		return Promise.all(events.map(event => store.put(event, key)))
			.catch((e) => {
				console.log('store error: ', e);
				tx.abort();
				throw Error('Events were not added to the store');
			});
	});
};

const setLastUpdated = (date) => {
	localStorage.setItem('lastUpdated', date);
};

const getLastUpdated = () => {
	return localStorage.getItem('lastUpdated');
};