export interface Truck {
    _id:string,
    licensePlate: string,
    capacity: number,
    status: 'available' | 'en route' | 'idle' | 'repairs',
    imgUrl: string
}