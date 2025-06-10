import { APIProvider, Map } from "@vis.gl/react-google-maps";


export default function GoogleMap () {
  console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  
  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
    <Map defaultCenter={{ lat: 40.7128, lng: -74.006 }} defaultZoom={12} />
  </APIProvider>
};