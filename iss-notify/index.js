const EventEmitter = require('events');
const fetch = require('node-fetch');

const LOCATION_EVENT_NAME = 'location';
const ISS_NOTIFY_URL = 'http://api.open-notify.org/iss-now.json';
const DEFAULT_LOCATION_RETRIES = 5;

class ISSLocationTracker extends EventEmitter {
    constructor(timeout, notifyURL = ISS_NOTIFY_URL) {
        super(timeout);

        this.locationFetchStarted = false;
        this.timeout = timeout;
        this.notifyURL = notifyURL;

        this.on('newListener', this.onNewListener);
    }

    
    async locationFetch() {
        try {
            const positionData = await fetchISSLocation(this.notifyURL);
            this.emitLocation(positionData);
            const listeners = this.listenerCount(LOCATION_EVENT_NAME);

            if (listeners) {
                if (this.timeout) await sleep(this.timeout);
                this.locationFetch();
            } else {
                console.log('Stopped fetching location since no listeners');
                this.locationFetchStarted = false;
            }
        } catch(error) {
            // On any error occurences the previous listeners 
            // for locations are removed

            // TODO: Add a patience threshold before removing all the listeners
            // to give the system a chance to recover as errors can happen for many reasons
            console.error(error);
            this.emit('error', error);
            this.removeAllListeners(LOCATION_EVENT_NAME);
            return;
        }
    }

    emitLocation(data) {
        this.emit(LOCATION_EVENT_NAME, data);
    }

    onNewListener(eventName) {
        if (eventName === LOCATION_EVENT_NAME && !this.locationFetchStarted) {
            this.locationFetchStarted = true;
            this.locationFetch();
        }
    }
}

/**
 * Fetch International Space Station
 * from the third party source
 */
async function fetchISSLocation(notifyURL) {
    const response = await fetchRetry(notifyURL, DEFAULT_LOCATION_RETRIES);
    const jsonData = await response.json();

    if (jsonData.message == 'success') {
        return formatPositionData(jsonData);
    } else {
        throw new Error('Failed to get the position for the ISS');
    }
}

function formatPositionData(data) {
    return { position: data.iss_position, timestamp: data.timestamp };
}

/**
 * Retries the fetch operation a number of times before erroring out
 */
async function fetchRetry(url, numRetries) {
    let r = numRetries;
    while (r--) {
        try {
            return await fetch(url);
        } catch (error) {
            if (!r) throw error;
        }
    }
}

/**
 * Asynchronous sleep function implemented using `setTimeout`
 * @param {*} timeout 
 */
function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

module.exports = ISSLocationTracker;