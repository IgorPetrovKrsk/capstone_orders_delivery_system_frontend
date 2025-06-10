import { APIProvider, Map } from "@vis.gl/react-google-maps";
import routeColors from "./colors";
import CustomPolyline from "./CustomPolyline";


export default function GoogleMap({ routes }: { routes: { lat: number; lng: number }[][] }) {
  const cityCenter = JSON.parse(import.meta.env.VITE_GOOGLE_MAPS_CENTER);
  return (
    <APIProvider
      // language='en' 
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} > 
      
      <Map defaultCenter={cityCenter} defaultZoom={12} >
        {routes.map((path, index) => (
          <CustomPolyline
            key={index}
            path={path}
            options={{
              strokeColor: routeColors[index % routeColors.length],
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        ))}
      </Map>

    </APIProvider>
  )
};