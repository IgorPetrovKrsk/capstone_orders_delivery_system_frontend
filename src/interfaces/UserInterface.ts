import type { Truck } from "./TruckInterface";

export type UserRole = "admin" | "dispatcher" | "driver";

export interface User {
  _id:string;
  username: string;
  role: UserRole;
  truck?: Truck;
  isActive: boolean;
  imgUrl?: string;
}