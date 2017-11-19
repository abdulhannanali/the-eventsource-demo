document.addEventListener('DOMContentLoaded', demo);

function demo() {
    const LOCATION_SOURCE_BASE_URL = '/iss-location';
    
    const latitudeValue = document.querySelector('.location-field.latitude .value');
    const longitudeValue = document.querySelector('.location-field.longitude .value');
    const statusDot = document.querySelector('.status .status-dot');
    const statusText = document.querySelector('.status .status-text');
    
    const issMapContainer = document.querySelector('.iss-location-map .location-map-container');

    const connectionStates = {
        0: ['connecting', 'Connecting Currently (Connecting)'],
        1: ['open', 'Connected (Open)'],
        2: ['closed', 'Not Connected (Closed)'],
    };

    const locationSource = new EventSource(LOCATION_SOURCE_BASE_URL, { withCredentials: true });
    updateConnectionStatus();

    locationSource.onopen = function () {
        console.log('Connection is open');
        console.log('Ready state is ', locationSource.readyState);
        updateConnectionStatus();
    }

    locationSource.onerror = function (event) {
        console.log('Error occured while connecting');
        console.log(event);
        updateConnectionStatus();
    }


    /**
     * Updates the Connection state for the UI
     */
    function updateConnectionStatus() {
        const [ className, textContent ] = connectionStates[locationSource.readyState]; 
        statusDot.className = 'status-dot ' + className;
        statusText.textContent = textContent;
    }

    /**
     * Update textual location
     */
    function updatePositionText(latitude, longitude, timestamp) {
        const sep = '||';
        
        const formattedValue = formatcoords([latitude, longitude]).format(
            'f', { latLonSeparator: sep }
        );

        const [ fLatitude, fLongitude ] = formattedValue.split(sep);

        latitudeValue.textContent = fLatitude;
        longitudeValue.textContent = fLongitude;
    }

    /**
     * Initializes the Map with the help of LeafletJS
     */
    function initializeMap() {
        
        const loadingMapPlaceholder = document.querySelector(
            `.iss-location-map
            .location-map-container
            .loading-map`
        );
        
        const map = L.map('location-map').setView([0, 0], 3);

        const satelliteMarker = L.marker([ 0, 0 ]);

        const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29tcHV0aXN0aWMiLCJhIjoiY2phNzVrdmRpN2YxcTMybWl6YzMzOGk4dyJ9.i47fp5IHigKJWeG3PSLjGg';
        
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.dark',
            accessToken: MAPBOX_ACCESS_TOKEN
        }).addTo(map);

        
        let popupOpened = false;
        locationSource.addEventListener('location', (event) => {
            const { position } = JSON.parse(event.data);
            const { latitude, longitude } = position;

            const latlng = [ latitude, longitude ];
            setMarkerLocation(latlng);
            
            satelliteMarker.bindPopup(`
                Hey, I am ISS 🛰 <br>
                Latitude: <b>${latitude}</b><br>
                Longitude: <b>${longitude}</b>
            `);

            
            satelliteMarker.addTo(map);
            map.panTo(latlng);
            
            if (!popupOpened) {
                satelliteMarker.openPopup();
                popupOpened = true;
            }

            updatePositionText(latitude, longitude);
            updateConnectionStatus();
        });
    
        function setMarkerLocation (latlng) {
            satelliteMarker.setLatLng(latlng);
        }
    }


    initializeMap();
}
