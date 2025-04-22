/* eslint-disable */
export const displayMap = (locations, startLocation) => {
    const map = L.map('map', {
        center: [startLocation.coordinates[1], startLocation.coordinates[0]],

        scrollWheelZoom: false,
        zoomControl: false,
    });

    L.tileLayer(
        `https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=m0c1Ekaci63z92GS6xYURfC3gxOYripzlCft8qOkyXifb1VH3V0rBXiw9N0UqieJ`,
        {
            attribution:
                '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 0,
            maxZoom: 22,
        },
    ).addTo(map);

    const markerPositions = locations.map((location) => {
        const marker = L.marker([
            location.coordinates[1],
            location.coordinates[0],
        ]).addTo(map);

        L.popup({
            autoClose: false, // This prevents automatic closing when clicking elsewhere
            closeOnClick: false, // This prevents closing when clicking on the map,
            offset: [0, -20],
            className: 'map-popup',
        })
            .setLatLng([location.coordinates[1], location.coordinates[0]])
            .setContent(
                `<p>Day: ${location.day} ${location.description || 'No name provided'}</p>`,
            )
            .openOn(map);

        return [location.coordinates[1], location.coordinates[0]]; // Return the position for fitBounds
    });

    // Fit the map to the bounds of the markers
    const bounds = L.latLngBounds(markerPositions);
    map.fitBounds(bounds, {
        paddingTopLeft: [250, 50],
        paddingBottomRight: [50, 50],
    });

    if (markerPositions.length === 1) {
        map.setZoom(11); // Adjust this zoom level as needed
    } else {
        // For multiple locations, fit bounds and then zoom out slightly
        const currentZoom = map.getZoom();
        map.setZoom(currentZoom - 1);
    }
};
