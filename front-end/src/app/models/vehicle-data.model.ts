export interface VehicleData {
  id: number | string
  vin: string
  vehicle: string
  odometro: number
  nivelCombustivel: number
  status: string
  lat: number
  long: number
}

export interface VehicleDataAPI {
  vehicleData: VehicleData[];
}
