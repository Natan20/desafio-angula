import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { VehicleService } from '../../services/vehicle.service';
import { Veiculo } from '../../models/veiculo.model';
import { VehicleData } from '../../models/vehicle-data.model';

type VeiculoId = Veiculo['id'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  // Passo 8: lista de veículos vinda do back-end para preencher o select
  veiculos: Veiculo[] = [];

  // Passos 9 e 10: veículo selecionado alimenta os cartões e a imagem central
  veiculoSelecionadoId: VeiculoId | null = null;
  veiculoSelecionado: Veiculo | null = null;

  // Passo 11: dados da tabela e busca por código do veículo (VIN)
  vehicleData: VehicleData[] = [];
  dadosFiltrados: VehicleData[] = [];
  termoVin = '';
  private buscaVin$ = new Subject<string>();

  constructor(private vehicleService: VehicleService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.vehicleService.getVeiculos().subscribe((veiculos) => {
      this.veiculos = veiculos;
      this.cdr.markForCheck();
    });

    this.vehicleService.getVehicleData().subscribe((dados) => {
      this.vehicleData = dados;
      this.dadosFiltrados = dados;
      this.cdr.markForCheck();
    });

    // Passo 11: busca reativa por código do veículo (VIN)
    this.buscaVin$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((termo) => termo.trim().toUpperCase()),
        filter(() => this.vehicleData.length > 0)
      )
      .subscribe((termo) => {
        this.dadosFiltrados = termo
          ? this.vehicleData.filter((d) => d.vin.toUpperCase().includes(termo))
          : this.vehicleData;
        this.cdr.markForCheck();
      });
  }

  onDigitarVin(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.buscaVin$.next(valor);
  }

  // Passo 8, 9 e 10: troca do veículo no select atualiza cartões e imagem central
  onSelecionarVeiculo(): void {
    this.veiculoSelecionado =
      this.veiculos.find((v) => v.id === this.veiculoSelecionadoId) ?? null;
  }
}
