import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function TourMap() {
  return (
    <section className='overflow-hidde'>
      <div className='h-[500px]' id='map'>
        <MapContainer
          center={[48.8584, 2.2945]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='<a href=\"https://www.jawg.io?utm_medium=map&utm_source=attribution\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors'
            url='https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=m0c1Ekaci63z92GS6xYURfC3gxOYripzlCft8qOkyXifb1VH3V0rBXiw9N0UqieJ'
          />
          <Marker position={[48.8584, 2.2945]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}
