import { useRef, useState } from 'react';
import { FaRedo, FaPlus, FaMinus } from 'react-icons/fa'; // Import icons for controls
import { RMap, RGradientMarker, useRControl } from 'maplibre-react-components';
import { useTour } from '../context/TourProvider';
import 'maplibre-react-components/style.css';
import { createPortal } from 'react-dom';

export default function TourMap() {
  const { currentTour } = useTour();
  const mapRef = useRef(null); // Reference to the map instance
  const [showResetButton, setShowResetButton] = useState(false); // State to control button visibility

  // Calculate the southwest and northeast corners of the bounding box
  const bounds = currentTour.locations.map((location) => location.coordinates);
  const southwest = [
    Math.min(...bounds.map((coord) => coord[0])), // Minimum longitude
    Math.min(...bounds.map((coord) => coord[1])), // Minimum latitude
  ];
  const northeast = [
    Math.max(...bounds.map((coord) => coord[0])), // Maximum longitude
    Math.max(...bounds.map((coord) => coord[1])), // Maximum latitude
  ];
  const boundingBox = [southwest, northeast];

  // Check if there is only one location
  const isSingleLocation =
    southwest[0] === northeast[0] && southwest[1] === northeast[1];

  // Function to reset the map view to the original bounds
  const resetBounds = () => {
    if (mapRef.current) {
      if (isSingleLocation) {
        // If only one location, center the map and set a default zoom level
        mapRef.current.setCenter(southwest);
        mapRef.current.setZoom(10); // Adjust the zoom level as needed
      } else {
        // Otherwise, fit the bounds
        mapRef.current.fitBounds(boundingBox, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 }, // Specify padding directly
          duration: 1000, // Smooth animation duration
        });
      }
      setShowResetButton(false); // Hide the reset button after resetting
    }
  };

  // Function to handle map movement
  const handleMapMove = () => {
    if (mapRef.current) {
      const currentBounds = mapRef.current.getBounds();
      const isAtDefaultBounds =
        currentBounds.getSouthWest().lng === southwest[0] &&
        currentBounds.getSouthWest().lat === southwest[1] &&
        currentBounds.getNorthEast().lng === northeast[0] &&
        currentBounds.getNorthEast().lat === northeast[1];

      if (isAtDefaultBounds) {
        setShowResetButton(false); // Hide the reset button if at default bounds
      } else {
        setShowResetButton(true); // Show the reset button if moved
      }
    }
  };

  // Custom zoom in function with smooth animation
  const zoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.easeTo({ zoom: currentZoom + 1, duration: 500 }); // Smooth zoom in
    }
  };

  // Custom zoom out function with smooth animation
  const zoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.easeTo({ zoom: currentZoom - 1, duration: 500 }); // Smooth zoom out
    }
  };

  return (
    <section className='relative overflow-hidden'>
      <div className='h-[500px]' id='map'>
        <RMap
          ref={mapRef} // Attach the map instance to the ref
          initialCenter={isSingleLocation ? southwest : [13.388, 52.517]} // Center on the single location or default
          className='maplibregl-theme-modern'
          minZoom={2}
          initialZoom={isSingleLocation ? 10 : 8} // Adjust zoom for single location
          scrollZoom={false}
          initialAttributionControl={false}
          mapStyle='/mapStyle/light.json'
          initialBounds={!isSingleLocation ? boundingBox : undefined} // Use bounds only if not a single location
          initialFitBoundsOptions={{
            padding: { top: 100, bottom: 50, left: 100, right: 100 }, // Specify padding for fitBounds
          }}
          onMove={handleMapMove} // Trigger when the map is moved
          onZoom={handleMapMove} // Trigger when the map is zoomed
        >
          {currentTour.locations.map((location, i) => {
            return (
              <RGradientMarker
                key={i * 3}
                text={location.day}
                color='#57534d'
                longitude={location.coordinates[0]}
                latitude={location.coordinates[1]}
              />
            );
          })}
          <MapInfo />
        </RMap>
      </div>

      {/* Custom Zoom Controls */}
      <div className='absolute top-5 right-5 z-10 flex flex-col gap-2'>
        <button
          onClick={zoomIn}
          className='rounded-full bg-white p-3 shadow-md hover:bg-gray-100'
          title='Zoom In'
        >
          <FaPlus className='text-gray-700' size={16} />
        </button>
        <button
          onClick={zoomOut}
          className='rounded-full bg-white p-3 shadow-md hover:bg-gray-100'
          title='Zoom Out'
        >
          <FaMinus className='text-gray-700' size={16} />
        </button>
      </div>

      {/* Reset Button */}
      {showResetButton && (
        <button
          onClick={resetBounds}
          className='absolute right-5 bottom-5 z-10 rounded-full bg-white p-3 shadow-md hover:bg-gray-100'
          title='Reset Map View'
        >
          <FaRedo className='text-gray-700' size={16} />
        </button>
      )}
    </section>
  );
}

function MapInfo() {
  const { container } = useRControl({
    position: 'bottom-left',
  });
  return createPortal(
    <div className='rounded bg-stone-700 p-2'>
      <p className='font-semibold text-white'>Number represents Day</p>
    </div>,
    container,
  );
}
