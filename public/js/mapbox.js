/*eslint-disable */
export const displayMap = (locations) => {

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FoZTE1NDAiLCJhIjoiY2ttd3g5YjQ3MDBxMTJ0bXUyMTlrcmc4NSJ9.xMZ_ybTHmnR_bF4h1_UbSA';

    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cahe1540/ckmwxknqk0avi17ps07ogxknw',
    scrollZoom: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        
        //create marker
        const el = document.createElement('div');
        el.className = 'marker';

        //Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);

        //Add popup
        new mapboxgl
            .Popup({
                offset: 30
            })
            .setLngLat(loc.coordinates)
            .setHTML(`<p> Day ${loc.day}: ${loc.description} </p>`)
            .addTo(map);

        //Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });

}

