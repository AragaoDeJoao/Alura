import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado, Cidade } from '../models/ibge.interface';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {
  private API_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

  constructor(private http: HttpClient) { }

  getEstados(): Observable<Estado[]> {
    // Adicione um console.log aqui para debug
    console.log('Chamando getEstados');
    return this.http.get<Estado[]>(this.API_ESTADOS);
  }

  getCidadesPorEstado(uf: string): Observable<Cidade[]> {
    console.log(`Buscando cidades para o estado: ${uf}`);
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
    return this.http.get<Cidade[]>(url);
  }
}
