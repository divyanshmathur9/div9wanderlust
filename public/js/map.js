const hasCoordinates =
  Array.isArray(listing?.geometry?.coordinates) &&
  listing.geometry.coordinates.length === 2;

if (mapToken && hasCoordinates) {
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    zoom: 9,
  });

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(`${listing.title} · Approximate location`))
    .addTo(map);
} else {
  const mapContainer = document.getElementById("map");
  if (mapContainer) {
    mapContainer.innerHTML = "<p>Map preview unavailable for this listing.</p>";
  }
}
