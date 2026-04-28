function getMapSource(center) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!center?.coordinates) return "";

  //  Official Google Maps Embed API format
  if (apiKey && apiKey !== "i will paste the api key will not send it to you") {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${center.coordinates.lat},${center.coordinates.lng}&zoom=14`;
  }

  // Fallback
  return `https://maps.google.com/maps?q=${center.coordinates.lat},${center.coordinates.lng}&z=13&output=embed`;
}

export function TaskMap({ selectedTask }) {
  const location = selectedTask?.location;
  // Grab the API key to check if it exists
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!location) return null;

  return (
    <section className="panel map-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Nearby task map</p>
          <h3>{selectedTask.title}</h3>
        </div>
        <span className="map-tag">{location.label}</span>
      </div>

      <iframe
        className="map-frame"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={getMapSource(location)}
        title={`Map for ${selectedTask.title}`}
      />


    </section>
  );
}