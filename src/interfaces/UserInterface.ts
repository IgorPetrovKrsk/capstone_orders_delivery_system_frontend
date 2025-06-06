import type { Truck } from "./TruckInterface";
import type { UserRole } from "./UserRoles";

export interface User {
  _id:string;
  username: string;
  role: UserRole;
  truck?: Truck;
  isActive: boolean;
  imgUrl?: string;
}