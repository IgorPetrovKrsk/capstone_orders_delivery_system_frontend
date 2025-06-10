import { APIProvider, Map } from "@vis.gl/react-google-maps";


export default function GoogleMap() {
  const cityCenter = JSON.parse(import.meta.env.VITE_GOOGLE_MAPS_CENTER);
  console.log(cityCenter);
  
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map defaultCenter={cityCenter} defaultZoom={12} />
    </APIProvider>
  )
};