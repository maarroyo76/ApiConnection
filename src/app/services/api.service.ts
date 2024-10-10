import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Cambia esta URL por la de tu API

  constructor(private http: HttpClient) {}

  // Obtener todos los datos
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Crear un nuevo dato
  createData(newData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newData);
  }

  // Actualizar un dato existente
  updateData(id: number, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedData);
  }
}
