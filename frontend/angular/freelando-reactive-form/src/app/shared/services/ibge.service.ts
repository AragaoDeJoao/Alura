import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, retry} from 'rxjs';
import {Cidade, Estado} from '../models/ibge.interface';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {
  private readonly API_URL = 'https://servicosdados.ibge.gov.br/api/v1/localidades';

  constructor(private http: HttpClient) {

  }

  getEstados() : Observable<Estado[]>{
    return this.http.get<Estado[]>(`${this.API_URL}/estados?orderBy=nome`).pipe(retry(2));
  }

  getCidadesPorEstado(uf: string) : Observable<Cidade[]>{
    return this.http.get<Cidade[]>(`${this.API_URL}/estados/${uf}/municipios?orderBy=nome`).pipe(retry(2));
  }


}
