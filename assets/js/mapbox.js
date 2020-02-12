
mapboxgl.accessToken = 'pk.eyJ1IjoiY2lyY2VjbyIsImEiOiJjazZhcW9mdm0wN3ZsM29wOXF6bXRwaDhxIn0.iz4i_eSrghnGX02vj7ATDg';

// Add Constant 

const stockholm = [18.072, 59.325];
const denver = [-105.0178157, 39.737925];
const home = denver;

// Add the map to the page 

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/circeco/ck5zjodry0ujw1ioaiqvk9kjs',
    center: [-105.0178157, 39.737925],
    zoom: 13
});

// Load the tilequery 

map.on('load', function () {
    console.log("Map loading...");

    map.addSource('tilequery', {
        type: "geojson",
        data: {
            "type": "FeatureCollection",
            "features": []
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50   // Radius of each cluster when clustering points (defaults to 50)

    });

    // Add map airport layer 

    map.addSource('museums', {
        type: 'vector',
        url: 'mapbox://circeco.ck69km0681xb02to3wcdvvbss-0mo1s'
    });

    console.log("Map sourching...");
    map.addLayer({
        'id': 'museums',
        'type': 'circle',
        'source': 'museums',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'circle-radius': 8,
            'circle-color': 'rgba(55,148,179,1)'
        },
        'source-layer': 'airports'
    });

    // Add map airport layer 

    map.addSource('shops', {
        type: 'vector',
        url: 'mapbox://circeco.ck69ksutg08g02imwptgjxa6d-19vzm',
    });

    console.log("Map layering ...");
    // define the style for display the data 

    map.addLayer({
        id: 'shops',
        type: 'circle',
        source: 'shops',
        'source-layer': 'food_stores',
        paint: {
            "circle-stroke-color": "white",
            "circle-stroke-width": {
                stops: [
                    [0, 0.1],
                    [18, 3]
                ],
                base: 5
            },
            "circle-radius": {
                stops: [
                    [12, 7],
                    [22, 180]
                ],
                base: 5
            },
            "circle-color": [
                'match',
                ['get', 'STORE_TYPE'],
                'Convenience Store', '#FF8C00',
                'Convenience Store With Gas', '#FF8C00',
                'Pharmacy', '#FF8C00',
                'Specialty Food Store', '#9ACD32',
                'Small Grocery Store', '#008000',
                'Supercenter', '#008000',
                'Superette', '#008000',
                'Supermarket', '#008000',
                'Warehouse Club Store', '#008000',
                '#FF0000' // any other store type
            ]
        }
    });

});

/* Add list of shops next to the map */


// using the idle event when the map is loading to set up features for the listing 
// queryRenderedFeatures return features in one source layer in the vector source 
map.on('idle', function () {
    const features = map.queryRenderedFeatures({layers: ['shops']});
    console.log("idle features: ", features);
    buildLocationList(features)
});

// Build listing 
function buildLocationList(features) {

    console.log("buildLocationList ", features);

    const listings = document.getElementById('listings');

    features.forEach(function (feature, i) {

        /**
         * Create a shortcut for `store.properties`,
         * which will be used several times below.
         **/
        var prop = feature.properties;

        /* Add a new listing section to the sidebar. */

        var listing = listings.appendChild(document.createElement('div'));
        /* Assign a unique `id` to the listing. */
        listing.id = "listing-" + i;
        /* Assign the `item` class to each listing for styling. */
        listing.className = 'item';

        /* Add the link to the individual listing created above. */
        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'stockholmlist';
        link.id = "link-" + i;
        link.innerHTML = prop['STORE_NAME'];

        /* Add details to the individual listing. */
        var details = listing.appendChild(document.createElement('div'));
        details.innerHTML = prop['ADDRESS_LINE1'];
        if (prop.phone) {
            details.innerHTML += ' · ' + prop.phoneFormatted;
        }
    });
}



// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// Geocoder 

map.on('load', function () {
    var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        zoom: 13, // Set the zoom level for geocoding results
        placeholder: "Enter an address or place name", // This placeholder text will display in the search bar
        bbox: [-105.116, 39.679, -104.898, 39.837] // Set a bounding box
    });
    // Add the geocoder to the map
    map.addControl(geocoder, 'top-left'); // Add the search box to the top left
});

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

