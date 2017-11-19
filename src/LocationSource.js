/**
 * LocationSource.js
 * Creates a Location Event Source which makes the Event management 
 * of the given stream possible
 */
const ISSLocationTracker = require('../iss-notify/index');
const locationTracker = new ISSLocationTracker(2000); 

const DEFAULT_ERROR_RETRY_TIME = 6000;
const DELAY_DEFAULT_STRING = '\n\n:\n\n';
const DEFAULT_LOCATION_EVENT_NAME = 'location';

async function LocationSourceStream(res, options = {}) {
    const { keepAliveInterval = 5000 } = options;

    let lastConnTimestamp = Date.now();
    let streamOpen = true;

    // Sending headers not our concern moving forward
    if (!res.headersSent) {
        await writeStreamHeaders();
    }

    locationTracker.on('error', onLocationError);
    locationTracker.on(DEFAULT_LOCATION_EVENT_NAME, onLocation);

    res.on('close', onClose);
    res.on('finish', onFinish);

    /**
     * Writes a response and returns a promise after flusing the data
     * to the Kernel Buffer
     */
    function write(...args) {
        return new Promise(function (resolve) {
            if (!streamOpen) return;
            lastConnTimestamp = Date.now();
            res.write(...args, resolve);
        });
    }

    /**
     * Pings the connection to 
     */
    async function setKeepAlivePings() {
        const timeDifference = Date.now() - lastConnTimestamp; 
        if (!streamOpen) return;

        if (timeDifference > keepAliveInterval) {
            await write(DELAY_DEFAULT_STRING);
            console.log('Delay written to the stream');
        }

        setTimeout(setKeepAlivePings, keepAliveInterval);
    }

    if (keepAliveInterval && keepAliveInterval > 0) setKeepAlivePings();

    function onClose() {
        console.log('Response stream closed');
        finalCleanup();
    }

    function onFinish() {
        console.log('Response stream ended, unexpectedly');
        finalCleanup();
    }
    
    async function onLocationError(error) {
        await write(
            createEvent(
                'error', 
                'Failed to fetch the location, system please retry again',
                undefined,
                DEFAULT_ERROR_RETRY_TIME
            )
        );
        res.end();
        finalCleanup();
    }

    async function onLocation(positionData) {
        await write(createEvent(DEFAULT_LOCATION_EVENT_NAME, positionData, positionData.timestamp));
    }

    /**
     * Perform finalCleanup and perform the garbage cleanup etc.
     * 
     */
    function finalCleanup() {
        if (!streamOpen) return;

        console.log('performing final cleanup for a request');

        streamOpen = false;
        locationTracker.removeListener('location', onLocation);
        locationTracker.removeListener('error', onLocationError);
    }

    async function writeStreamHeaders() {
        res.set('Content-Type', 'text/event-stream');
        res.set('Cache-Control', 'no-cache');
        res.writeHead(200, 'Ahan! You need data, you get the data');
    }
}


/**
 * Creates an event with the help of the given parameters
 * @param {*} eventName 
 * @param {*} data 
 */
function createEvent(eventName, data, id, retry) {
    let eventString = '';
    
    if (eventName) {
        eventString += 'event: ' + eventName + '\n';
    }

    if (id) {
        eventString += 'id: ' + id + '\n';
    }

    if (retry) {
        eventString += 'retry: ' + retry + '\n';
    }
    
    if (data) {
        eventString += createEventData(data);
    }

    eventString += '\n\n';
    return eventString;
}

/**
 * Creates the Data for the given event
 */
function createEventData(data) {
    if (Array.isArray(data)) {
        return data.map(d => 'data: ' + JSON.stringify(d)).join('\n');
    }

    return 'data: ' + JSON.stringify(data) + '\n';
}

module.exports = LocationSourceStream;