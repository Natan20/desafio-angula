import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Veiculo, VeiculosAPI } from '../models/veiculo.model';
import { VehicleData, VehicleDataAPI } from '../models/vehicle-data.model';

// Serviço de comunicação com o back-end para os dados do dashboard (Passos 8-11)
@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getVeiculos(): Observable<Veiculo[]> {
    return this.http.get<VeiculosAPI>(`${this.apiUrl}/vehicle`).pipe(pluck('vehicles'));
  }

  getVehicleData(): Observable<VehicleData[]> {
    return this.http.get<VehicleDataAPI>(`${this.apiUrl}/vehicleData`).pipe(pluck('vehicleData'));
  }
}
