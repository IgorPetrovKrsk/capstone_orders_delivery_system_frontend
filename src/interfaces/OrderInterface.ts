import type { Truck } from "./TruckInterface";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Order {
  _id:string,
  origin: string;
  originCoordinates: Coordinates;
  destination: string;
  destinationCoordinates: Coordinates;
  status: 'pending' | 'assigned' | 'delivered' | 'returned';
  weight: number;
  truck?: Truck; 
}
